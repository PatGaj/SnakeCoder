import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'

import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

const DAY_MS = 24 * 60 * 60 * 1000

// Normalizes a date to midnight to compare calendar days.
const startOfDay = (value: Date) => {
  const date = new Date(value)
  date.setHours(0, 0, 0, 0)
  return date
}

// Computes day difference between two dates (calendar-based).
const diffDays = (from: Date, to: Date) => {
  const diffMs = startOfDay(to).getTime() - startOfDay(from).getTime()
  return Math.round(diffMs / DAY_MS)
}

// Maps rank to the user-facing league label.
const leagueNameForRank = (rank: number) => {
  if (rank >= 1 && rank <= 3) return 'Champions'
  if (rank >= 4 && rank <= 10) return 'Gold'
  if (rank >= 11 && rank <= 50) return 'Silver'
  return 'Bronze'
}

// Returns current user stats and updates streak if a new day has started.
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
      streakBest: true,
      streakUpdatedAt: true,
      gradeAvg: true,
    },
  })

  if (!user) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const now = new Date()
  let streakCurrent = user.streakCurrent
  let streakBest = user.streakBest
  let shouldUpdate = false

  if (user.streakUpdatedAt) {
    const daysSince = diffDays(user.streakUpdatedAt, now)
    if (daysSince > 0) {
      streakCurrent = daysSince === 1 ? streakCurrent + 1 : 1
      streakBest = Math.max(streakBest, streakCurrent)
      shouldUpdate = true
    }
  } else {
    streakCurrent = streakCurrent > 0 ? streakCurrent + 1 : 1
    streakBest = Math.max(streakBest, streakCurrent)
    shouldUpdate = true
  }

  if (shouldUpdate) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        streakCurrent,
        streakBest,
        streakUpdatedAt: now,
      },
    })
  }

  const higherCount = await prisma.user.count({
    where: { xpMonth: { gt: user.xpMonth } },
  })

  const rank = higherCount + 1

  return NextResponse.json({
    streakDays: streakCurrent,
    xpGained: user.xpMonth,
    rank,
    leagueName: leagueNameForRank(rank),
    gradeAvg: user.gradeAvg,
  })
}
