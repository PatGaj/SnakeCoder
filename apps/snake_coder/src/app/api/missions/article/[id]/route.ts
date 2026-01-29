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

type MarkReadPayload = {
  timeSpentSeconds?: number
  sessionId?: string
}

// Sanitizes optional string input for logs/analytics payloads.
const clampString = (value: unknown, max = 120) => {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  if (!trimmed) return null
  return trimmed.length > max ? trimmed.slice(0, max) : trimmed
}

// Loads article mission data and marks it as in-progress for the user.
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
      type: 'ARTICLE',
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
      article: {
        select: { tags: true, blocks: true, summary: true },
      },
      progress: {
        where: { userId },
        select: { status: true, startedAt: true },
      },
    },
  })

  if (!mission || !mission.article) {
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

  return NextResponse.json({
    header: {
      title: mission.title,
      desc: mission.shortDesc,
      readTimeMinutes: mission.etaMinutes,
      tags: mission.article.tags,
    },
    content: {
      blocks: mission.article.blocks,
      summary: mission.article.summary,
    },
    status: isAlreadyCompleted ? 'DONE' : 'IN_PROGRESS',
  })
}

// Marks an article as read, awards XP once, and logs completion analytics.
export async function POST(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  const body = (await req.json().catch(() => null)) as MarkReadPayload | null
  const timeSpentSeconds = typeof body?.timeSpentSeconds === 'number' ? body.timeSpentSeconds : undefined
  const sessionId = clampString(body?.sessionId)

  const mission = await prisma.mission.findFirst({
    where: {
      id,
      type: 'ARTICLE',
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

  await prisma.$transaction(async (tx) => {
    let streakSnapshot: number | null = null
    const xpAwardedValue = !isAlreadyCompleted ? mission.xp : 0
    await tx.userMissionProgress.upsert({
      where: { userId_missionId: { userId, missionId: mission.id } },
      update: {
        lastOpenedAt: now,
        ...(isAlreadyCompleted
          ? {}
          : {
              status: 'DONE',
              startedAt,
              completedAt: now,
              xpEarned: mission.xp,
              timeSpentSeconds,
            }),
      },
      create: {
        userId,
        missionId: mission.id,
        status: 'DONE',
        startedAt: now,
        lastOpenedAt: now,
        completedAt: now,
        xpEarned: mission.xp,
        timeSpentSeconds,
      },
    })

    if (!isAlreadyCompleted) {
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
    } else {
      const existingUser = await tx.user.findUnique({
        where: { id: userId },
        select: { streakCurrent: true },
      })
      streakSnapshot = existingUser?.streakCurrent ?? null
    }

    await tx.analyticsLog.create({
      data: {
        event: 'mission_completed',
        userId,
        sessionId,
        missionId: mission.id,
        missionType: mission.type,
        xpAwarded: xpAwardedValue,
        timeSpentSeconds,
        attemptsCount: 1,
        streakCurrent: streakSnapshot,
        payload: {
          readTimeMinutes: mission.etaMinutes,
          alreadyCompleted: isAlreadyCompleted,
        },
      },
    })
  })

  return NextResponse.json({ ok: true })
}
