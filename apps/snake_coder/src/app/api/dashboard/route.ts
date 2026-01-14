import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'

import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { PUBLIC_MODULE_CODES_LIST } from '@/lib/moduleAccess'

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

type ActiveSprintRef = {
  moduleId: string
  module: { name: string; code: string }
  sprint: { id: string; name: string } | null
}

const fetchActiveSprintRef = async (userId: string, status?: 'IN_PROGRESS'): Promise<ActiveSprintRef | null> => {
  const progress = await prisma.userMissionProgress.findFirst({
    where: {
      userId,
      ...(status ? { status } : {}),
      mission: {
        type: { in: ['TASK', 'BUGFIX', 'QUIZ', 'ARTICLE'] },
        sprintId: { not: null },
        module: {
          isBuilding: false,
          category: 'CERTIFICATIONS',
          OR: [
            {
              access: {
                some: { userId, hasAccess: true },
              },
            },
            { code: { in: PUBLIC_MODULE_CODES_LIST } },
          ],
        },
      },
    },
    orderBy: [{ lastOpenedAt: 'desc' }, { completedAt: 'desc' }, { startedAt: 'desc' }],
    select: {
      mission: {
        select: {
          moduleId: true,
          module: { select: { name: true, code: true } },
          sprint: { select: { id: true, name: true } },
        },
      },
    },
  })

  return progress?.mission ?? null
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
    where: { userId, status: 'DONE', grade: { not: null } },
    orderBy: [{ completedAt: 'desc' }, { lastOpenedAt: 'desc' }],
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

  const activeSprintRef = (await fetchActiveSprintRef(userId, 'IN_PROGRESS')) ?? (await fetchActiveSprintRef(userId))

  let access =
    activeSprintRef ??
    (await prisma.userModuleAccess.findFirst({
      where: {
        userId,
        hasAccess: true,
        module: { isBuilding: false, category: 'CERTIFICATIONS' },
      },
      orderBy: { startedAt: 'desc' },
      select: { moduleId: true, module: { select: { name: true, code: true } } },
    }))

  if (!access) {
    const publicModule = await prisma.module.findFirst({
      where: {
        isBuilding: false,
        category: 'CERTIFICATIONS',
        code: { in: PUBLIC_MODULE_CODES_LIST },
      },
      orderBy: { createdAt: 'asc' },
      select: { id: true, name: true, code: true },
    })

    if (publicModule) {
      access = {
        moduleId: publicModule.id,
        module: { name: publicModule.name, code: publicModule.code },
      }
    }
  }

  if (!access) {
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

  const sprints = await prisma.sprint.findMany({
    where: { moduleId: access.moduleId },
    orderBy: { order: 'asc' },
    select: {
      id: true,
      name: true,
      order: true,
      title: true,
      description: true,
      missions: {
        where: { type: { in: ['TASK', 'BUGFIX', 'QUIZ', 'ARTICLE'] } },
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

  const sprintById = new Map(sprints.map((sprint) => [sprint.id, sprint]))

  const isSprintComplete = (sprint: (typeof sprints)[number]) => {
    const tasks = sprint.missions.filter((m) => m.type === 'TASK' || m.type === 'BUGFIX')
    const tasksTotal = tasks.length
    const tasksDone = tasks.reduce((acc, m) => acc + (m.progress[0]?.status === 'DONE' ? 1 : 0), 0)
    const tasksComplete = tasksTotal === 0 || tasksDone >= tasksTotal

    const articles = sprint.missions.filter((m) => m.type === 'ARTICLE')
    const articleDoneCount = articles.reduce((acc, m) => acc + (m.progress[0]?.status === 'DONE' ? 1 : 0), 0)
    const articleDone = articles.length === 0 || articleDoneCount >= articles.length

    const quizzes = sprint.missions.filter((m) => m.type === 'QUIZ')
    const quizDone = quizzes.length === 0 || quizzes.every((m) => m.progress[0]?.status === 'DONE')

    return tasksComplete && articleDone && quizDone
  }

  const sprint =
    (activeSprintRef?.sprint?.id ? sprintById.get(activeSprintRef.sprint.id) : null) ??
    sprints.find((s) => !isSprintComplete(s)) ??
    sprints[sprints.length - 1]

  if (!sprint) {
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

  const tasks = sprint.missions.filter((m) => m.type === 'TASK' || m.type === 'BUGFIX')
  const tasksTotal = tasks.length
  const tasksDone = tasks.reduce((acc, m) => acc + (m.progress[0]?.status === 'DONE' ? 1 : 0), 0)

  const articles = sprint.missions.filter((m) => m.type === 'ARTICLE')
  const articleDoneCount = articles.reduce((acc, m) => acc + (m.progress[0]?.status === 'DONE' ? 1 : 0), 0)
  const articleDone = articles.length === 0 || articleDoneCount >= articles.length

  const quizzes = sprint.missions.filter((m) => m.type === 'QUIZ')
  const quizTotal = quizzes.length
  const quizScore = quizzes.reduce((acc, m) => acc + (m.progress[0]?.status === 'DONE' ? 1 : 0), 0)

  const activeMission = sprint.missions.find((m) => m.progress[0]?.status === 'IN_PROGRESS') ?? null
  const nextMission = activeMission ?? sprint.missions.find((m) => m.progress[0]?.status !== 'DONE') ?? sprint.missions[0]

  const hasActiveTask = Boolean(activeMission)

  const etaMinutes = sprint.missions.reduce((acc, mission) => acc + mission.etaMinutes, 0)

  const sprintRoute = `/modules/${access.module.name}/${sprint.name}`
  const taskRoute = nextMission ? missionRoute(nextMission.type, nextMission.id) : `/modules/${access.module.name}`

  const payload: DashboardResponse = {
    name: user.name,
    sprint: {
      module: mapModuleCode(access.module.code),
      moduleId: access.module.name,
      sprintId: sprint.name,
      sprintNo: sprint.order,
      etaMinutes,
      hasActiveTask,
      tasksDone,
      tasksTotal,
      articleDone,
      quizScore,
      quizTotal,
      nextTaskTitle: nextMission?.title ?? '',
      nextTaskDesc: nextMission?.shortDesc ?? '',
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
