import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'

import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

type Params = {
  params: Promise<{
    id: string
  }>
}

type MarkReadPayload = {
  timeSpentSeconds?: number
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
      type: 'ARTICLE',
      module: {
        isBuilding: false,
        access: {
          some: { userId, hasAccess: true },
        },
      },
    },
    include: {
      article: {
        select: { tags: true, blocks: true, summary: true },
      },
      progress: {
        where: { userId },
        select: { status: true },
      },
    },
  })

  if (!mission || !mission.article) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

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
    status: mission.progress[0]?.status ?? null,
  })
}

export async function POST(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  const body = (await req.json().catch(() => null)) as MarkReadPayload | null
  const timeSpentSeconds = typeof body?.timeSpentSeconds === 'number' ? body.timeSpentSeconds : undefined

  const mission = await prisma.mission.findFirst({
    where: {
      id,
      type: 'ARTICLE',
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
        select: { status: true },
      },
    },
  })

  if (!mission) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const isAlreadyCompleted = mission.progress[0]?.status === 'DONE'

  await prisma.userMissionProgress.upsert({
    where: { userId_missionId: { userId, missionId: mission.id } },
    update: {
      lastOpenedAt: new Date(),
      ...(isAlreadyCompleted
        ? {}
        : {
            status: 'DONE',
            completedAt: new Date(),
            xpEarned: mission.xp,
            timeSpentSeconds,
          }),
    },
    create: {
      userId,
      missionId: mission.id,
      status: 'DONE',
      startedAt: new Date(),
      lastOpenedAt: new Date(),
      completedAt: new Date(),
      xpEarned: mission.xp,
      timeSpentSeconds,
    },
  })

  return NextResponse.json({ ok: true })
}

