import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'

import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

type Params = {
  params: Promise<{
    id: string
  }>
}

type AnswerMap = Record<string, string | null | undefined>
type QuizSubmitPayload = { answers?: AnswerMap; timeSpentSeconds?: number }

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
      type: 'QUIZ',
      module: {
        isBuilding: false,
        access: {
          some: { userId, hasAccess: true },
        },
      },
    },
    include: {
      quiz: {
        include: {
          questions: {
            orderBy: { order: 'asc' },
            select: {
              id: true,
              title: true,
              prompt: true,
              options: {
                orderBy: { order: 'asc' },
                select: { id: true, label: true },
              },
            },
          },
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

  return NextResponse.json({
    header: {
      title: mission.title,
      desc: mission.shortDesc,
      xp: mission.xp,
      passPercent,
    },
    questions: mission.quiz.questions.map((q) => ({
      id: q.id,
      title: q.title,
      prompt: q.prompt,
      options: q.options.map((o) => ({ id: o.id, label: o.label })),
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
        access: {
          some: { userId, hasAccess: true },
        },
      },
    },
    include: {
      quiz: {
        include: {
          questions: {
            orderBy: { order: 'asc' },
            select: {
              id: true,
              title: true,
              prompt: true,
              options: {
                orderBy: { order: 'asc' },
                select: { id: true, label: true, isCorrect: true },
              },
            },
          },
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
  const questions = mission.quiz.questions

  const results = questions.map((q) => {
    const selectedId = answers[q.id] ?? null
    const selected = selectedId ? q.options.find((o) => o.id === selectedId) : null
    const correct = q.options.find((o) => o.isCorrect) ?? null

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

  const isAlreadyCompleted = mission.progress[0]?.status === 'DONE'
  const now = new Date()
  const startedAt = mission.progress[0]?.startedAt ?? now

  await prisma.$transaction(async (tx) => {
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
      await tx.user.update({
        where: { id: userId },
        data: {
          xpTotal: { increment: mission.xp },
          xpMonth: { increment: mission.xp },
          xpToday: { increment: mission.xp },
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
