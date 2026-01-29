import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'

import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { gradeLabelFromAvg } from '@/lib/grades'

type RankingUser = {
  id: string
  rank: number
  name: string
  avatarUrl: string | null
  xp: number
  streakDays: number
  grade: string
}

// Returns monthly ranking data split into champions (top 3) and the rest.
export async function GET() {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const users = await prisma.user.findMany({
    orderBy: [{ xpMonth: 'desc' }, { id: 'asc' }],
    select: {
      id: true,
      nickName: true,
      name: true,
      image: true,
      xpMonth: true,
      streakCurrent: true,
      gradeAvg: true,
    },
  })

  const ranked: RankingUser[] = users.map((user, idx) => ({
    id: user.id,
    rank: idx + 1,
    name: user.nickName ?? user.name ?? 'USER',
    avatarUrl: user.image ?? null,
    xp: user.xpMonth,
    streakDays: user.streakCurrent,
    grade: gradeLabelFromAvg(user.gradeAvg),
  }))

  return NextResponse.json({
    champions: ranked.slice(0, 3),
    users: ranked.slice(3),
  })
}
