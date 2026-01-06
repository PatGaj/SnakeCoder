import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'

import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

const leagueNameForRank = (rank: number) => {
  if (rank >= 1 && rank <= 3) return 'Champions'
  if (rank >= 4 && rank <= 10) return 'Gold'
  if (rank >= 11 && rank <= 50) return 'Silver'
  return 'Bronze'
}

export async function GET() {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      xpMonth: true,
      streakCurrent: true,
      gradeAvg: true,
    },
  })

  if (!user) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const higherCount = await prisma.user.count({
    where: { xpMonth: { gt: user.xpMonth } },
  })

  const rank = higherCount + 1

  return NextResponse.json({
    streakDays: user.streakCurrent,
    xpGained: user.xpMonth,
    rank,
    leagueName: leagueNameForRank(rank),
    gradeAvg: user.gradeAvg,
  })
}

