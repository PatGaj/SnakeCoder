'use client'

import type { RankingUser } from './components'

export type UseRankingData = {
  champions: RankingUser[]
  users: RankingUser[]
}

type SeedUser = Omit<RankingUser, 'rank'>

const SEEDED_USERS: SeedUser[] = [
  { id: 'u-01', name: 'Maja', xp: 6420, streakDays: 28, grade: 'A', avatarUrl: null },
  { id: 'u-02', name: 'Kacper', xp: 5900, streakDays: 19, grade: 'A-', avatarUrl: null },
  { id: 'u-03', name: 'Zuzanna', xp: 5605, streakDays: 22, grade: 'B+', avatarUrl: null },
  { id: 'u-04', name: 'Oskar', xp: 5210, streakDays: 14, grade: 'B', avatarUrl: null },
  { id: 'u-05', name: 'Julia', xp: 4980, streakDays: 16, grade: 'B', avatarUrl: null },
  { id: 'u-06', name: 'Michał', xp: 4770, streakDays: 11, grade: 'B-', avatarUrl: null },
  { id: 'u-07', name: 'Amelia', xp: 4530, streakDays: 9, grade: 'C+', avatarUrl: null },
  { id: 'u-08', name: 'Piotr', xp: 4320, streakDays: 7, grade: 'C+', avatarUrl: null },
  { id: 'u-09', name: 'Oliwia', xp: 4170, streakDays: 12, grade: 'B-', avatarUrl: null },
  { id: 'u-10', name: 'Filip', xp: 4010, streakDays: 6, grade: 'C', avatarUrl: null },
  { id: 'u-11', name: 'Nikodem', xp: 3890, streakDays: 5, grade: 'C', avatarUrl: null },
  { id: 'u-12', name: 'Natalia', xp: 3740, streakDays: 8, grade: 'C+', avatarUrl: null },
]

const gradeByIndex = (index: number) => {
  if (index < 3) return 'A'
  if (index < 10) return 'B'
  if (index < 30) return 'C+'
  if (index < 50) return 'C'
  return 'D'
}

const generateUsers = (): SeedUser[] => {
  const generated = Array.from({ length: 80 - SEEDED_USERS.length }, (_v, i) => {
    const idx = SEEDED_USERS.length + i
    const xp = Math.max(120, 3600 - idx * 42 + (idx % 5) * 13)
    const streakDays = Math.max(0, 18 - Math.floor(idx / 6) + (idx % 4))
    return {
      id: `u-${String(idx + 1).padStart(2, '0')}`,
      name: `USER_${String(1000 + idx)}`,
      xp,
      streakDays,
      grade: gradeByIndex(idx),
      avatarUrl: null,
    } satisfies SeedUser
  })

  return [...SEEDED_USERS, ...generated]
}

const ALL_USERS_SORTED: RankingUser[] = generateUsers()
  .sort((a, b) => b.xp - a.xp)
  .map((user, idx) => ({ ...user, rank: idx + 1 }))

const useRanking = (): UseRankingData => {
  const champions = ALL_USERS_SORTED.filter((u) => u.rank <= 3)
  const users = ALL_USERS_SORTED.filter((u) => u.rank >= 4)

  return { champions, users }
}

export default useRanking
