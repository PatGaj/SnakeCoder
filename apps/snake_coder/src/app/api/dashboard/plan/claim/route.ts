import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'

import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { PUBLIC_MODULE_CODES_LIST } from '@/lib/moduleAccess'
import { ModuleCategory } from '@/generated/prisma/client'

const PLAN_BONUS_XP = 120

// Normalizes a date to the start of the day (local time).
const startOfDay = (value: Date) => {
  const date = new Date(value)
  date.setHours(0, 0, 0, 0)
  return date
}

const MISSION_TYPES: Array<'TASK' | 'BUGFIX' | 'QUIZ' | 'ARTICLE'> = ['TASK', 'BUGFIX', 'QUIZ', 'ARTICLE']

// Builds module filter to include public or unlocked modules.
const moduleAccessFilter = (userId: string) => ({
  isBuilding: false,
  category: ModuleCategory.CERTIFICATIONS,
  OR: [
    {
      access: {
        some: { userId, hasAccess: true },
      },
    },
    { code: { in: PUBLIC_MODULE_CODES_LIST } },
  ],
})

type ProgressRef = {
  status: 'IN_PROGRESS' | 'DONE'
  missionId: string
  moduleId: string
  module: { name: string; code: string }
  sprint: { id: string; name: string } | null
}

// Finds the latest progress item (in-progress or done) to anchor plan validation.
const fetchLastProgressRef = async (userId: string, status: ProgressRef['status']): Promise<ProgressRef | null> => {
  const progress = await prisma.userMissionProgress.findFirst({
    where: {
      userId,
      status,
      mission: {
        type: { in: MISSION_TYPES },
        sprintId: { not: null },
        module: moduleAccessFilter(userId),
      },
    },
    orderBy:
      status === 'IN_PROGRESS'
        ? [{ lastOpenedAt: 'desc' }, { startedAt: 'desc' }]
        : [{ completedAt: 'desc' }, { lastOpenedAt: 'desc' }],
    select: {
      missionId: true,
      mission: {
        select: {
          moduleId: true,
          module: { select: { name: true, code: true } },
          sprint: { select: { id: true, name: true } },
        },
      },
    },
  })

  if (!progress?.mission) {
    return null
  }

  return {
    status,
    missionId: progress.missionId,
    moduleId: progress.mission.moduleId,
    module: progress.mission.module,
    sprint: progress.mission.sprint,
  }
}

type MissionWithProgress = {
  id: string
  type: string
  etaMinutes: number
  progress: Array<{ status: string | null }>
}

type SprintWithMissions = {
  id: string
  name: string
  order: number
  missions: MissionWithProgress[]
}

type NextMissionSelection = {
  sprint: SprintWithMissions
  mission: MissionWithProgress
}

// Picks the next mission to decide which sprint should be validated for plan completion.
const pickNextMission = ({
  sprints,
  startSprintId,
  baseMissionId,
  preferMissionId,
}: {
  sprints: SprintWithMissions[]
  startSprintId?: string | null
  baseMissionId?: string | null
  preferMissionId?: string | null
}): NextMissionSelection | null => {
  const startIndex = startSprintId ? sprints.findIndex((s) => s.id === startSprintId) : 0
  const firstIndex = startIndex >= 0 ? startIndex : 0

  for (let i = firstIndex; i < sprints.length; i += 1) {
    const sprint = sprints[i]
    if (!sprint.missions.length) {
      continue
    }

    const pendingMissions = sprint.missions.filter((mission) => mission.progress[0]?.status !== 'DONE')

    if (i === firstIndex && startSprintId) {
      if (preferMissionId) {
        const preferred = sprint.missions.find((mission) => mission.id === preferMissionId)
        if (preferred && preferred.progress[0]?.status === 'IN_PROGRESS') {
          return { sprint, mission: preferred }
        }
      }

      if (baseMissionId) {
        const baseIndex = sprint.missions.findIndex((mission) => mission.id === baseMissionId)
        if (baseIndex >= 0) {
          const afterBase = sprint.missions
            .slice(baseIndex + 1)
            .find((mission) => mission.progress[0]?.status !== 'DONE')
          if (afterBase) {
            return { sprint, mission: afterBase }
          }
        }
      }

      if (pendingMissions.length > 0) {
        return { sprint, mission: pendingMissions[0] }
      }
    } else if (pendingMissions.length > 0) {
      return { sprint, mission: pendingMissions[0] }
    }
  }

  return null
}

// Verifies whether the current sprint plan requirements are satisfied.
const isPlanComplete = (sprint: SprintWithMissions) => {
  const tasks = sprint.missions.filter((m) => m.type === 'TASK' || m.type === 'BUGFIX')
  const tasksTotal = tasks.length
  const tasksDone = tasks.reduce((acc, m) => acc + (m.progress[0]?.status === 'DONE' ? 1 : 0), 0)

  const articles = sprint.missions.filter((m) => m.type === 'ARTICLE')
  const articleTotal = articles.length
  const articleDoneCount = articles.reduce((acc, m) => acc + (m.progress[0]?.status === 'DONE' ? 1 : 0), 0)

  const quizzes = sprint.missions.filter((m) => m.type === 'QUIZ')
  const quizTotal = quizzes.length
  const quizScore = quizzes.reduce((acc, m) => acc + (m.progress[0]?.status === 'DONE' ? 1 : 0), 0)

  const tasksRemaining = tasksTotal - tasksDone
  const articleRemaining = articleTotal - articleDoneCount
  const quizRemaining = quizTotal - quizScore

  const showTasks = tasksRemaining > 0
  const showArticle = articleRemaining > 0
  const showQuiz = quizRemaining > 0

  const planTasksTotal = showTasks ? 1 : 0
  const planTasksDone = showTasks ? (tasksDone > 0 ? 1 : 0) : 0

  const planArticleDone = showArticle ? articleDoneCount > 0 : false

  const planQuizPercent = showQuiz ? (quizScore > 0 ? 100 : 0) : 0
  const planQuizOk = showQuiz ? planQuizPercent >= 80 : true

  return (
    (!showTasks || planTasksDone >= planTasksTotal) &&
    (!showArticle || planArticleDone) &&
    (!showQuiz || planQuizOk)
  )
}

export async function POST() {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id

  // Require authentication for claiming the daily plan bonus.
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { planBonusClaimedAt: true },
  })

  if (!user) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const now = new Date()
  const todayStart = startOfDay(now)

  // Ensure the bonus can be claimed once per day.
  if (user.planBonusClaimedAt && user.planBonusClaimedAt >= todayStart) {
    return NextResponse.json({ error: 'Already claimed' }, { status: 409 })
  }

  const modules = await prisma.module.findMany({
    where: moduleAccessFilter(userId),
    orderBy: { createdAt: 'asc' },
    select: { id: true, name: true },
  })

  if (modules.length === 0) {
    return NextResponse.json({ error: 'No modules' }, { status: 400 })
  }

  // Find the latest progress to decide which sprint should be checked.
  const baseProgress =
    (await fetchLastProgressRef(userId, 'IN_PROGRESS')) ?? (await fetchLastProgressRef(userId, 'DONE'))

  const startModuleIndex = baseProgress ? modules.findIndex((item) => item.id === baseProgress.moduleId) : 0
  const firstModuleIndex = startModuleIndex >= 0 ? startModuleIndex : 0

  let selection: { sprint: SprintWithMissions; mission: MissionWithProgress } | null = null

  // Iterate modules and sprints in order to find the next sprint to validate.
  for (let i = firstModuleIndex; i < modules.length; i += 1) {
    const moduleItem = modules[i]
    const sprints = await prisma.sprint.findMany({
      where: { moduleId: moduleItem.id },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        name: true,
        order: true,
        missions: {
          where: { type: { in: MISSION_TYPES } },
          orderBy: { createdAt: 'asc' },
          select: {
            id: true,
            type: true,
            etaMinutes: true,
            progress: {
              where: { userId },
              select: { status: true },
            },
          },
        },
      },
    })

    const nextSelection = pickNextMission({
      sprints,
      startSprintId: moduleItem.id === baseProgress?.moduleId ? baseProgress?.sprint?.id : null,
      baseMissionId:
        moduleItem.id === baseProgress?.moduleId && baseProgress?.status === 'DONE' ? baseProgress.missionId : null,
      preferMissionId:
        moduleItem.id === baseProgress?.moduleId && baseProgress?.status === 'IN_PROGRESS'
          ? baseProgress.missionId
          : null,
    })

    if (nextSelection) {
      selection = nextSelection
      break
    }
  }

  if (!selection) {
    return NextResponse.json({ error: 'No sprint' }, { status: 400 })
  }

  if (!isPlanComplete(selection.sprint)) {
    return NextResponse.json({ error: 'Plan incomplete' }, { status: 400 })
  }

  // Apply bonus XP and mark the claim timestamp.
  await prisma.user.update({
    where: { id: userId },
    data: {
      xpTotal: { increment: PLAN_BONUS_XP },
      xpMonth: { increment: PLAN_BONUS_XP },
      xpToday: { increment: PLAN_BONUS_XP },
      planBonusClaimedAt: now,
    },
  })

  return NextResponse.json({ ok: true, bonusXp: PLAN_BONUS_XP })
}
