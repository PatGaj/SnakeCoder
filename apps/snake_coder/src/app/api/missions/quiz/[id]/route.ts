import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'

import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { PUBLIC_MODULE_CODES_LIST } from '@/lib/moduleAccess'

type Params = {
  params: Promise<{
    id: string
  }>
}

type AnswerMap = Record<string, string | null | undefined>
type QuizSubmitPayload = { answers?: AnswerMap; timeSpentSeconds?: number; sessionId?: string }

type QuizOptionPayload = {
  id: string
  label: string
  isCorrect: boolean
  order: number
}

type QuizQuestionPayload = {
  id: string
  title: string
  prompt: string
  order: number
  options: QuizOptionPayload[]
}

const clampString = (value: unknown, max = 120) => {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  if (!trimmed) return null
  return trimmed.length > max ? trimmed.slice(0, max) : trimmed
}

const hashString = (value: string) => {
  let hash = 2166136261
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

const createRng = (seed: number) => {
  let state = seed >>> 0
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0
    return state / 2 ** 32
  }
}

const shuffleWithSeed = <T,>(items: T[], seed: number) => {
  const result = [...items]
  const rand = createRng(seed)
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

const normalizeQuizOptions = (value: unknown): QuizOptionPayload[] => {
  if (!Array.isArray(value)) return []
  const options: QuizOptionPayload[] = []

  value.forEach((entry, index) => {
    if (!entry || typeof entry !== 'object') return
    const record = entry as Record<string, unknown>
    const label = typeof record.label === 'string' ? record.label.trim() : ''
    if (!label) return

    const id =
      typeof record.id === 'string' && record.id.trim() ? record.id.trim() : String(index + 1)
    const order =
      typeof record.order === 'number' && Number.isFinite(record.order) ? record.order : index + 1
    const isCorrect = typeof record.isCorrect === 'boolean' ? record.isCorrect : false

    options.push({ id, label, order, isCorrect })
  })

  return options.sort((a, b) => a.order - b.order)
}

const normalizeQuizQuestions = (value: unknown): QuizQuestionPayload[] => {
  if (!Array.isArray(value)) return []
  const questions: QuizQuestionPayload[] = []

  value.forEach((entry, index) => {
    if (!entry || typeof entry !== 'object') return
    const record = entry as Record<string, unknown>
    const title = typeof record.title === 'string' ? record.title.trim() : ''
    const prompt = typeof record.prompt === 'string' ? record.prompt.trim() : ''
    if (!title || !prompt) return

    const id =
      typeof record.id === 'string' && record.id.trim() ? record.id.trim() : `q-${index + 1}`
    const order =
      typeof record.order === 'number' && Number.isFinite(record.order) ? record.order : index + 1
    const options = normalizeQuizOptions(record.options)

    questions.push({ id, title, prompt, order, options })
  })

  return questions.sort((a, b) => a.order - b.order)
}

export async function GET(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  const mission = await prisma.mission.findFirst({
    where: {
      id,
      type: 'QUIZ',
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
      quiz: {
        select: {
          questions: true,
        },
      },
      progress: {
        where: { userId },
        select: { status: true, startedAt: true },
      },
    },
  })

  if (!mission || !mission.quiz) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const now = new Date()
  const isAlreadyCompleted = mission.progress[0]?.status === 'DONE'
  const startedAt = mission.progress[0]?.startedAt ?? now

  await prisma.userMissionProgress.upsert({
    where: { userId_missionId: { userId, missionId: mission.id } },
    update: {
      lastOpenedAt: now,
      ...(isAlreadyCompleted ? {} : { status: 'IN_PROGRESS', startedAt }),
    },
    create: {
      userId,
      missionId: mission.id,
      status: 'IN_PROGRESS',
      startedAt: now,
      lastOpenedAt: now,
    },
  })

  const timeLimitSeconds = mission.timeLimitSeconds ?? mission.etaMinutes * 60
  const passPercent = mission.passPercent ?? 80
  const attempt = new URL(req.url).searchParams.get('attempt') ?? ''

  const questions = normalizeQuizQuestions(mission.quiz.questions)

  return NextResponse.json({
    header: {
      title: mission.title,
      desc: mission.shortDesc,
      xp: mission.xp,
      passPercent,
    },
    questions: questions.map((q) => ({
      id: q.id,
      title: q.title,
      prompt: q.prompt,
      options: shuffleWithSeed(
        normalizeQuizOptions(q.options),
        hashString(`${userId}:${mission.id}:${q.id}:${attempt}`)
      ).map((option) => ({
        id: option.id,
        label: option.label,
      })),
    })),
    timeLimitSeconds,
  })
}

export async function POST(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  const body = (await req.json().catch(() => null)) as QuizSubmitPayload | null

  if (!body?.answers || typeof body.answers !== 'object') {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const mission = await prisma.mission.findFirst({
    where: {
      id,
      type: 'QUIZ',
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
      quiz: {
        select: {
          questions: true,
        },
      },
      progress: {
        where: { userId },
        select: { status: true, startedAt: true, completedAt: true, xpEarned: true, timeSpentSeconds: true },
      },
    },
  })

  if (!mission || !mission.quiz) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const passPercent = mission.passPercent ?? 80
  const answers = body.answers
  const questions = normalizeQuizQuestions(mission.quiz.questions)

  const results = questions.map((q) => {
    const questionOptions = normalizeQuizOptions(q.options)
    const selectedId = answers[q.id] ?? null
    const selected = selectedId ? questionOptions.find((o) => o.id === selectedId) : null
    const correct = questionOptions.find((o) => o.isCorrect) ?? null

    const isCorrect = Boolean(selected && correct && selected.id === correct.id)

    return {
      id: q.id,
      title: q.title,
      prompt: q.prompt,
      selectedLabel: selected?.label ?? null,
      isCorrect,
    }
  })

  const score = results.reduce((acc, r) => acc + (r.isCorrect ? 1 : 0), 0)
  const total = results.length
  const percent = total > 0 ? Math.round((score / total) * 100) : 0
  const passed = percent >= passPercent

  const timeSpentSeconds = typeof body.timeSpentSeconds === 'number' ? body.timeSpentSeconds : undefined
  const sessionId = clampString(body.sessionId)

  const isAlreadyCompleted = mission.progress[0]?.status === 'DONE'
  const now = new Date()
  const startedAt = mission.progress[0]?.startedAt ?? now

  await prisma.$transaction(async (tx) => {
    let streakSnapshot: number | null = null
    const shouldLogCompletion = passed
    const xpAwardedValue = !isAlreadyCompleted && passed ? mission.xp : 0
    await tx.quizAttempt.create({
      data: {
        userId,
        quizId: mission.id,
        answers,
        score,
        total,
        percent,
        passed,
        timeSpentSeconds,
      },
    })

    await tx.userMissionProgress.upsert({
      where: { userId_missionId: { userId, missionId: mission.id } },
      update: {
        lastOpenedAt: now,
        ...(isAlreadyCompleted
          ? {}
          : {
              status: passed ? 'DONE' : 'IN_PROGRESS',
              startedAt,
              completedAt: passed ? now : null,
              xpEarned: passed ? mission.xp : null,
              timeSpentSeconds,
            }),
      },
      create: {
        userId,
        missionId: mission.id,
        status: passed ? 'DONE' : 'IN_PROGRESS',
        startedAt: now,
        lastOpenedAt: now,
        completedAt: passed ? now : null,
        xpEarned: passed ? mission.xp : null,
        timeSpentSeconds,
      },
    })

    if (!isAlreadyCompleted && passed) {
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          xpTotal: { increment: mission.xp },
          xpMonth: { increment: mission.xp },
          xpToday: { increment: mission.xp },
        },
        select: { streakCurrent: true },
      })
      streakSnapshot = updatedUser?.streakCurrent ?? null
    } else if (shouldLogCompletion) {
      const existingUser = await tx.user.findUnique({
        where: { id: userId },
        select: { streakCurrent: true },
      })
      streakSnapshot = existingUser?.streakCurrent ?? null
    }

    if (shouldLogCompletion) {
      const attemptsCount = await tx.quizAttempt.count({ where: { userId, quizId: mission.id } })

      await tx.analyticsLog.create({
        data: {
          event: 'mission_completed',
          userId,
          sessionId,
          missionId: mission.id,
          missionType: mission.type,
          xpAwarded: xpAwardedValue,
          timeSpentSeconds,
          attemptsCount,
          streakCurrent: streakSnapshot,
          payload: {
            score,
            total,
            percent,
            passPercent,
            alreadyCompleted: isAlreadyCompleted,
          },
        },
      })
    }
  })

  return NextResponse.json({
    score,
    total,
    passPercent,
    items: results,
  })
}
