import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import jwt from 'jsonwebtoken'

import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { PUBLIC_MODULE_CODES_LIST } from '@/lib/moduleAccess'

type Params = {
  params: Promise<{
    id: string
  }>
}

type ExecuteMode = 'fullTest' | 'completeTask' | 'runCode'

type ExecutePayload = {
  source?: string
  mode?: ExecuteMode
  timeSpentSeconds?: number
}

const executorBaseUrl = () => (process.env.EXECUTOR_BASE_URL || 'http://localhost:8000').replace(/\/$/, '')

const EXECUTOR_HEALTH_TTL_MS = 10_000
const EXECUTOR_HEALTH_TIMEOUT_MS = 2_000
const EXECUTOR_EXECUTE_TIMEOUT_MS = 15_000

let lastHealthyAt = 0

const executorTaskId = (id: string) => {
  const prefix = process.env.EXECUTOR_TASK_ID_PREFIX
  if (!prefix) return id
  return id.startsWith(prefix) ? id : `${prefix}${id}`
}

const computeTimeBonusMultiplier = (etaMinutes: number, timeSpentSeconds?: number) => {
  if (!timeSpentSeconds || timeSpentSeconds <= 0 || !Number.isFinite(etaMinutes) || etaMinutes <= 0) {
    return 1
  }

  const etaSeconds = etaMinutes * 60
  const fastThreshold = etaSeconds / 3
  return timeSpentSeconds <= fastThreshold ? 1.2 : timeSpentSeconds <= etaSeconds ? 1.1 : 1
}

const computeAttemptsMultiplier = (testAttemptsCount: number) => {
  if (testAttemptsCount <= 2) return 1
  if (testAttemptsCount <= 4) return 0.9
  return 0.75
}

const computeAwardedXp = (
  baseXp: number,
  etaMinutes: number,
  timeSpentSeconds: number | undefined,
  testAttemptsCount: number
) => {
  const timeMultiplier = computeTimeBonusMultiplier(etaMinutes, timeSpentSeconds)
  const attemptsMultiplier = computeAttemptsMultiplier(testAttemptsCount)
  return Math.round(baseXp * timeMultiplier * attemptsMultiplier)
}

const signExecutorJwt = (userId: string) => {
  const secret = process.env.EXECUTOR_JWT_SECRET || process.env.NEXTAUTH_SECRET
  if (!secret) {
    throw new Error('Missing EXECUTOR_JWT_SECRET')
  }

  return jwt.sign({ sub: userId }, secret, {
    algorithm: 'HS256',
    expiresIn: '10m',
    issuer: 'snakecoder',
  })
}

const parseJson = async <T,>(response: Response): Promise<T | null> => {
  const text = await response.text().catch(() => '')
  if (!text) return null

  try {
    return JSON.parse(text) as T
  } catch {
    return null
  }
}

const fetchWithTimeout = async (url: string, init: RequestInit, timeoutMs: number) => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    return await fetch(url, { ...init, signal: controller.signal })
  } finally {
    clearTimeout(timeoutId)
  }
}

const isExecutorHealthy = async () => {
  const now = Date.now()
  if (lastHealthyAt && now - lastHealthyAt < EXECUTOR_HEALTH_TTL_MS) {
    return true
  }

  try {
    const response = await fetchWithTimeout(
      `${executorBaseUrl()}/health`,
      { method: 'GET', cache: 'no-store' },
      EXECUTOR_HEALTH_TIMEOUT_MS
    )

    if (!response.ok) {
      lastHealthyAt = 0
      return false
    }

    lastHealthyAt = now
    return true
  } catch {
    lastHealthyAt = 0
    return false
  }
}

export async function POST(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  const body = (await req.json().catch(() => null)) as ExecutePayload | null
  const source = body?.source
  const mode = body?.mode
  const timeSpentSeconds = typeof body?.timeSpentSeconds === 'number' ? body.timeSpentSeconds : undefined

  if (typeof source !== 'string' || !source.trim().length) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  if (mode !== 'runCode' && mode !== 'fullTest' && mode !== 'completeTask') {
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
        select: { status: true, startedAt: true, testAttemptsCount: true },
      },
    },
  })

  if (!mission) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const healthy = await isExecutorHealthy()
  if (!healthy) {
    return NextResponse.json({ error: 'Executor unavailable' }, { status: 503 })
  }

  const token = signExecutorJwt(userId)

  const payload: Record<string, unknown> = {
    source,
    mode,
    ...(mode === 'runCode' ? {} : { task_id: executorTaskId(id) }),
  }

  let response: Response

  try {
    response = await fetchWithTimeout(
      `${executorBaseUrl()}/api/execute`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      },
      EXECUTOR_EXECUTE_TIMEOUT_MS
    )
  } catch {
    lastHealthyAt = 0
    return NextResponse.json({ error: 'Executor unavailable' }, { status: 503 })
  }

  if (!response.ok) {
    const detail = await parseJson<{ detail?: string }>(response)
    return NextResponse.json(
      { error: 'Executor error', detail: detail?.detail ?? null },
      { status: response.status }
    )
  }

  const data = await parseJson<Record<string, unknown>>(response)
  if (!data) {
    return NextResponse.json({ error: 'Executor error' }, { status: 502 })
  }

  const now = new Date()

  if (mode === 'fullTest' && mission.progress[0]?.status !== 'DONE') {
    await prisma.userMissionProgress.upsert({
      where: { userId_missionId: { userId, missionId: mission.id } },
      update: {
        lastOpenedAt: now,
        testAttemptsCount: { increment: 1 },
      },
      create: {
        userId,
        missionId: mission.id,
        status: 'IN_PROGRESS',
        startedAt: now,
        lastOpenedAt: now,
        testAttemptsCount: 1,
      },
    })
  }

  if (mode !== 'completeTask') {
    if (mode === 'fullTest' && Array.isArray(data.results)) {
      const publicCount = await prisma.taskTestCase.count({ where: { taskId: mission.id, isPublic: true } })
      data.results = data.results.slice(0, publicCount)
    }
    return NextResponse.json(data)
  }

  const isTaskPassed = Boolean(data.isTaskPassed)
  const passedCount = typeof data.passedCount === 'number' ? data.passedCount : 0
  const totalCount = await prisma.taskTestCase.count({ where: { taskId: mission.id } })

  const isAlreadyCompleted = mission.progress[0]?.status === 'DONE'
  const startedAt = mission.progress[0]?.startedAt ?? now
  const shouldAwardXp = isTaskPassed && !isAlreadyCompleted
  const testAttemptsCount = mission.progress[0]?.testAttemptsCount ?? 0
  const xpAwarded = shouldAwardXp
    ? computeAwardedXp(mission.xp, mission.etaMinutes, timeSpentSeconds, testAttemptsCount)
    : 0

  await prisma.$transaction(async (tx) => {
    await tx.taskSubmission.create({
      data: {
        userId,
        taskId: mission.id,
        code: source,
        status: isTaskPassed ? 'PASSED' : 'FAILED',
        passedCount,
        totalCount,
        timeSpentSeconds,
      },
    })

    await tx.userMissionProgress.upsert({
      where: { userId_missionId: { userId, missionId: mission.id } },
      update: {
        lastOpenedAt: now,
        userCode: source,
        ...(isAlreadyCompleted
          ? {}
          : {
              status: isTaskPassed ? 'DONE' : 'IN_PROGRESS',
              startedAt,
              completedAt: isTaskPassed ? now : null,
              xpEarned: shouldAwardXp ? xpAwarded : null,
              timeSpentSeconds,
            }),
      },
      create: {
        userId,
        missionId: mission.id,
        status: isTaskPassed ? 'DONE' : 'IN_PROGRESS',
        startedAt: now,
        lastOpenedAt: now,
        completedAt: isTaskPassed ? now : null,
        xpEarned: shouldAwardXp ? xpAwarded : null,
        timeSpentSeconds,
        userCode: source,
      },
    })

    if (shouldAwardXp) {
      await tx.user.update({
        where: { id: userId },
        data: {
          xpTotal: { increment: xpAwarded },
          xpMonth: { increment: xpAwarded },
          xpToday: { increment: xpAwarded },
        },
      })
    }
  })

  return NextResponse.json({
    ...data,
    passedCount,
    totalCount,
  })
}
