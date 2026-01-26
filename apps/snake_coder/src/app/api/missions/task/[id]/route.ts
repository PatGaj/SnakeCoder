import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'

import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { PUBLIC_MODULE_CODES_LIST } from '@/lib/moduleAccess'

const REVIEW_LIMIT_PER_DAY = 3

type Params = {
  params: Promise<{
    id: string
  }>
}

type SaveTaskPayload = {
  userCode?: string
}

type TaskTestCasePayload = {
  input: unknown
  expectedOutput: unknown
}

const normalizeTaskTests = (value: unknown): TaskTestCasePayload[] => {
  if (!Array.isArray(value)) return []

  return value
    .map((entry) => {
      if (!entry || typeof entry !== 'object') return null
      const record = entry as Record<string, unknown>
      const input = record.input
      const expectedOutput = record.expectedOutput ?? record.output ?? record.expected

      if (input === undefined && expectedOutput === undefined) return null

      return {
        input: input ?? '',
        expectedOutput: expectedOutput ?? '',
      }
    })
    .filter((entry): entry is TaskTestCasePayload => Boolean(entry))
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
    include: {
      task: {
        select: {
          language: true,
          starterCode: true,
          tests: true,
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

  const taskTests = normalizeTaskTests(mission.task.tests)
  const publicTests = taskTests.slice(0, 3)
  const totalTestsCount = taskTests.length
  const progress = mission.progress[0]

  let aiReviewRemaining: number | null = null
  let aiReviewLimit: number | null = null
  let aiReviewEnabled = false

  if (mission.type === 'TASK') {
    aiReviewEnabled = true
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const reviewsToday = await prisma.taskReview.count({
      where: {
        userId,
        createdAt: { gte: todayStart },
      },
    })

    aiReviewLimit = REVIEW_LIMIT_PER_DAY
    aiReviewRemaining = Math.max(0, REVIEW_LIMIT_PER_DAY - reviewsToday)
  }

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
      cases: publicTests.map((testCase, index) => ({
        id: `public-${index + 1}`,
        input: testCase.input,
        output: testCase.expectedOutput,
      })),
    },
    totalTestsCount,
    timeLimitSeconds: mission.timeLimitSeconds ?? mission.etaMinutes * 60,
    status: progress?.status ?? 'TODO',
    startedAt: progress?.startedAt ? progress.startedAt.toISOString() : null,
    missionType: mission.type,
    aiReviewEnabled,
    aiReviewRemaining,
    aiReviewLimit,
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
