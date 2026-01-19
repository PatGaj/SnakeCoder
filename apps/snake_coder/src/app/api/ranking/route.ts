import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'

import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

type RankingUser = {
  id: string
  rank: number
  name: string
  avatarUrl: string | null
  xp: number
  streakDays: number
  grade: string
}

const gradeLabelFromAvg = (avg: number | null) => {
  if (avg == null) return ''
  if (avg >= 4.75) return 'A'
  if (avg >= 4.25) return 'A-'
  if (avg >= 4.0) return 'B+'
  if (avg >= 3.5) return 'B'
  if (avg >= 3.0) return 'C+'
  if (avg >= 2.5) return 'C'
  if (avg >= 2.0) return 'D'
  return 'E'
}

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
