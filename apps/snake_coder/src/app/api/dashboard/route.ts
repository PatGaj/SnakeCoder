import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'

import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { PUBLIC_MODULE_CODES_LIST } from '@/lib/moduleAccess'
import { ModuleCategory } from '@/generated/prisma/client'

type DashboardModuleCode = 'PCEP' | 'PCAP' | 'BASICS'

type DashboardSprintData = {
  module: DashboardModuleCode
  moduleId: string
  sprintId: string
  sprintNo: number
  etaMinutes: number
  hasActiveTask: boolean
  tasksDone: number
  tasksTotal: number
  articleDone: boolean
  articleDoneCount: number
  articleTotal: number
  quizScore: number
  quizTotal: number
  nextTaskTitle: string
  nextTaskDesc: string
  title: string
  desc: string
  taskRoute: string
  route: string
}

type DashboardResponse = {
  name: string | null
  sprint: DashboardSprintData | null
  lastResult: {
    todayXp: number
    yesterdayXp: number
    grade: string
    speedPercent: number
  }
}

const missionRoute = (type: string, id: string) => {
  if (type === 'QUIZ') return `/missions/quiz/${id}`
  if (type === 'ARTICLE') return `/missions/article/${id}`
  return `/missions/task/${id}`
}

const mapModuleCode = (code: string): DashboardModuleCode => {
  if (code === 'PCAP') return 'PCAP'
  if (code === 'BASICS') return 'BASICS'
  return 'PCEP'
}

const speedPercentFromTime = ({ timeSeconds, avgSeconds }: { timeSeconds?: number | null; avgSeconds?: number }) => {
  if (!timeSeconds || !avgSeconds || avgSeconds <= 0) return 100

  const fastUpper = Math.round(avgSeconds * 0.83)
  const avgUpper = Math.round(avgSeconds * 1.17)
  const slowUpper = Math.round(avgSeconds * 2.0)

  if (timeSeconds < fastUpper) return 120
  if (timeSeconds <= avgUpper) return 100
  if (timeSeconds <= slowUpper) return 80
  return 50
}

const MISSION_TYPES: Array<'TASK' | 'BUGFIX' | 'QUIZ' | 'ARTICLE'> = ['TASK', 'BUGFIX', 'QUIZ', 'ARTICLE']

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
  title: string
  shortDesc: string
  etaMinutes: number
  progress: Array<{ status: string | null }>
}

type SprintWithMissions = {
  id: string
  name: string
  order: number
  title: string
  description: string
  missions: MissionWithProgress[]
}

type NextMissionSelection = {
  sprint: SprintWithMissions
  mission: MissionWithProgress
}

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

export async function GET() {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
    },
  })

  if (!user) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const lastGraded = await prisma.userMissionProgress.findFirst({
    where: { userId, grade: { not: null } },
    orderBy: [{ lastOpenedAt: 'desc' }, { completedAt: 'desc' }],
    select: { grade: true },
  })

  const lastTimed = await prisma.userMissionProgress.findFirst({
    where: { userId, status: 'DONE', timeSpentSeconds: { not: null } },
    orderBy: [{ completedAt: 'desc' }, { lastOpenedAt: 'desc' }],
    select: { timeSpentSeconds: true, mission: { select: { etaMinutes: true } } },
  })

  const speedPercent = speedPercentFromTime({
    timeSeconds: lastTimed?.timeSpentSeconds,
    avgSeconds: lastTimed?.mission.etaMinutes ? lastTimed.mission.etaMinutes * 60 : undefined,
  })

  const now = new Date()
  const todayStart = new Date(now)
  todayStart.setHours(0, 0, 0, 0)
  const yesterdayStart = new Date(todayStart)
  yesterdayStart.setDate(todayStart.getDate() - 1)

  const [todayAgg, yesterdayAgg] = await Promise.all([
    prisma.userMissionProgress.aggregate({
      where: { userId, completedAt: { gte: todayStart } },
      _sum: { xpEarned: true },
    }),
    prisma.userMissionProgress.aggregate({
      where: { userId, completedAt: { gte: yesterdayStart, lt: todayStart } },
      _sum: { xpEarned: true },
    }),
  ])

  const todayXp = todayAgg._sum.xpEarned ?? 0
  const yesterdayXp = yesterdayAgg._sum.xpEarned ?? 0

  const modules = await prisma.module.findMany({
    where: moduleAccessFilter(userId),
    orderBy: { createdAt: 'asc' },
    select: { id: true, name: true, code: true },
  })

  if (modules.length === 0) {
    const payload: DashboardResponse = {
      name: user.name,
      sprint: null,
      lastResult: {
        todayXp,
        yesterdayXp,
        grade: lastGraded?.grade ?? '—',
        speedPercent,
      },
    }
    return NextResponse.json(payload)
  }

  const baseProgress =
    (await fetchLastProgressRef(userId, 'IN_PROGRESS')) ?? (await fetchLastProgressRef(userId, 'DONE'))

  const startModuleIndex = baseProgress ? modules.findIndex((item) => item.id === baseProgress.moduleId) : 0
  const firstModuleIndex = startModuleIndex >= 0 ? startModuleIndex : 0

  let selection: { module: (typeof modules)[number]; sprint: SprintWithMissions; mission: MissionWithProgress } | null =
    null

  for (let i = firstModuleIndex; i < modules.length; i += 1) {
    const moduleItem = modules[i]
    const sprints = await prisma.sprint.findMany({
      where: { moduleId: moduleItem.id },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        name: true,
        order: true,
        title: true,
        description: true,
        missions: {
          where: { type: { in: MISSION_TYPES } },
          orderBy: { createdAt: 'asc' },
          select: {
            id: true,
            type: true,
            title: true,
            shortDesc: true,
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
      selection = { module: moduleItem, ...nextSelection }
      break
    }
  }

  if (!selection) {
    const payload: DashboardResponse = {
      name: user.name,
      sprint: null,
      lastResult: {
        todayXp,
        yesterdayXp,
        grade: lastGraded?.grade ?? '—',
        speedPercent,
      },
    }
    return NextResponse.json(payload)
  }

  const { module: moduleItem, sprint, mission: nextMission } = selection

  const tasks = sprint.missions.filter((m) => m.type === 'TASK' || m.type === 'BUGFIX')
  const tasksTotal = tasks.length
  const tasksDone = tasks.reduce((acc, m) => acc + (m.progress[0]?.status === 'DONE' ? 1 : 0), 0)

  const articles = sprint.missions.filter((m) => m.type === 'ARTICLE')
  const articleTotal = articles.length
  const articleDoneCount = articles.reduce((acc, m) => acc + (m.progress[0]?.status === 'DONE' ? 1 : 0), 0)
  const articleDone = articleTotal === 0 || articleDoneCount >= articleTotal

  const quizzes = sprint.missions.filter((m) => m.type === 'QUIZ')
  const quizTotal = quizzes.length
  const quizScore = quizzes.reduce((acc, m) => acc + (m.progress[0]?.status === 'DONE' ? 1 : 0), 0)

  const hasActiveTask = nextMission.progress[0]?.status === 'IN_PROGRESS'

  const etaMinutes = sprint.missions.reduce((acc, mission) => acc + mission.etaMinutes, 0)

  const sprintRoute = `/modules/${moduleItem.name}/${sprint.name}`
  const taskRoute = missionRoute(nextMission.type, nextMission.id)

  const payload: DashboardResponse = {
    name: user.name,
    sprint: {
      module: mapModuleCode(moduleItem.code),
      moduleId: moduleItem.name,
      sprintId: sprint.name,
      sprintNo: sprint.order,
      etaMinutes,
      hasActiveTask,
      tasksDone,
      tasksTotal,
      articleDone,
      articleDoneCount,
      articleTotal,
      quizScore,
      quizTotal,
      nextTaskTitle: nextMission.title,
      nextTaskDesc: nextMission.shortDesc,
      title: sprint.title,
      desc: sprint.description,
      taskRoute,
      route: sprintRoute,
    },
    lastResult: {
      todayXp,
      yesterdayXp,
      grade: lastGraded?.grade ?? '—',
      speedPercent,
    },
  }

  return NextResponse.json(payload)
}
