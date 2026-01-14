import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'

import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

type Params = {
  params: Promise<{
    id: string
  }>
}

type SaveTaskPayload = {
  userCode?: string
}

export async function GET(_: Request, { params }: Params) {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  const mission = await prisma.mission.findFirst({
    where: {
      id,
      type: { in: ['TASK', 'BUGFIX'] },
      module: {
        isBuilding: false,
        access: {
          some: { userId, hasAccess: true },
        },
      },
    },
    include: {
      task: {
        select: {
          language: true,
          starterCode: true,
          tests: {
            where: { isPublic: true },
            orderBy: { order: 'asc' },
            select: { id: true, input: true, expectedOutput: true },
          },
        },
      },
      progress: {
        where: { userId },
        select: { status: true, startedAt: true, userCode: true },
      },
    },
  })

  if (!mission?.task) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const totalTestsCount = await prisma.taskTestCase.count({ where: { taskId: mission.id } })
  const progress = mission.progress[0]

  if (progress) {
    await prisma.userMissionProgress.update({
      where: { userId_missionId: { userId, missionId: mission.id } },
      data: { lastOpenedAt: new Date() },
    })
  }

  return NextResponse.json({
    task: {
      title: mission.title,
      description: mission.description,
      requirements: mission.requirements,
      hint: mission.hints[0] ?? undefined,
    },
    editor: {
      language: mission.task.language,
    },
    patternCode: mission.task.starterCode,
    userCode: progress?.userCode ?? null,
    publicTests: {
      cases: mission.task.tests.map((test) => ({
        id: test.id,
        input: test.input,
        output: test.expectedOutput,
      })),
    },
    totalTestsCount,
    timeLimitSeconds: mission.timeLimitSeconds ?? mission.etaMinutes * 60,
    status: progress?.status ?? 'TODO',
  })
}

export async function PATCH(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  const body = (await req.json().catch(() => null)) as SaveTaskPayload | null
  const userCode = body?.userCode

  if (typeof userCode !== 'string') {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const mission = await prisma.mission.findFirst({
    where: {
      id,
      type: { in: ['TASK', 'BUGFIX'] },
      module: {
        isBuilding: false,
        access: {
          some: { userId, hasAccess: true },
        },
      },
    },
    include: {
      progress: {
        where: { userId },
        select: { status: true, startedAt: true },
      },
    },
  })

  if (!mission) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const isAlreadyCompleted = mission.progress[0]?.status === 'DONE'
  const now = new Date()
  const startedAt = mission.progress[0]?.startedAt ?? now

  await prisma.userMissionProgress.upsert({
    where: { userId_missionId: { userId, missionId: mission.id } },
    update: {
      lastOpenedAt: now,
      userCode,
      ...(isAlreadyCompleted ? {} : { status: 'IN_PROGRESS', startedAt }),
    },
    create: {
      userId,
      missionId: mission.id,
      status: 'IN_PROGRESS',
      startedAt: now,
      lastOpenedAt: now,
      userCode,
    },
  })

  return NextResponse.json({ ok: true })
}
