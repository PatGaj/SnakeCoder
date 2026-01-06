import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'

import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

const NICKNAME_REGEX = /^[A-Za-z0-9_]+$/

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
      nickName: true,
      firstName: true,
      lastName: true,
      xpTotal: true,
      streakBest: true,
      gradeAvg: true,
      moduleAccess: {
        where: { hasAccess: true, module: { isBuilding: false } },
        orderBy: [{ startedAt: 'desc' }, { module: { code: 'asc' } }],
        select: {
          startedAt: true,
          completedAt: true,
          module: {
            select: {
              name: true,
              code: true,
              title: true,
            },
          },
        },
      },
    },
  })

  if (!user) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json({
    account: {
      userName: user.name,
      nickName: user.nickName,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    stats: {
      xpTotal: user.xpTotal,
      bestStreakDays: user.streakBest,
      gradeAvg: user.gradeAvg,
    },
    unlockedModules: user.moduleAccess.map((access) => ({
      id: access.module.name,
      code: access.module.code,
      title: access.module.title,
      unlockedAt: access.startedAt ? access.startedAt.toISOString() : null,
      completedAt: access.completedAt ? access.completedAt.toISOString() : null,
    })),
  })
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = (await req.json().catch(() => null)) as
    | { nickName?: unknown; firstName?: unknown; lastName?: unknown }
    | null

  const nickName = typeof body?.nickName === 'string' ? body.nickName.trim() : ''
  if (!nickName || !NICKNAME_REGEX.test(nickName)) {
    return NextResponse.json({ error: 'Invalid nickname' }, { status: 400 })
  }

  const firstName = typeof body?.firstName === 'string' && body.firstName.trim().length ? body.firstName.trim() : null
  const lastName = typeof body?.lastName === 'string' && body.lastName.trim().length ? body.lastName.trim() : null

  const existingNick = await prisma.user.findFirst({
    where: {
      id: { not: userId },
      nickName: { equals: nickName, mode: 'insensitive' },
    },
    select: { id: true },
  })

  if (existingNick) {
    return NextResponse.json({ error: 'Nickname already exists' }, { status: 409 })
  }

  const displayName = [firstName, lastName].filter(Boolean).join(' ').trim() || nickName

  await prisma.user.update({
    where: { id: userId },
    data: {
      nickName,
      firstName,
      lastName,
      name: displayName,
    },
  })

  return NextResponse.json({ ok: true })
}
