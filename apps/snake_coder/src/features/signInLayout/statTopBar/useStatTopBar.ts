'use client'

import { useQuery } from '@tanstack/react-query'

import { gradeLabelFromAvg } from '@/lib/grades'

export type StatTopBarUserData = {
  streakDays: number
  xpGained: number
  rank: number
  grade: string
  leagueName: string
}

type StatTopBarApiResponse = {
  streakDays: number
  xpGained: number
  rank: number
  leagueName: string
  gradeAvg: number | null
}

// Fetches user stats for the top bar counters.
const fetchStatTopBar = async (): Promise<StatTopBarApiResponse> => {
  const response = await fetch('/api/user/stats', { method: 'GET', cache: 'no-store' })
  if (!response.ok) {
    throw new Error('Failed to fetch stats')
  }
  return response.json() as Promise<StatTopBarApiResponse>
}

// Loads stats for the stat top bar with safe defaults.
const useStatTopBar = (): StatTopBarUserData => {
  const { data } = useQuery({
    queryKey: ['userStats'],
    queryFn: fetchStatTopBar,
  })

  return {
    streakDays: data?.streakDays ?? 0,
    xpGained: data?.xpGained ?? 0,
    rank: data?.rank ?? 0,
    grade: gradeLabelFromAvg(data?.gradeAvg ?? null),
    leagueName: data?.leagueName ?? 'Bronze',
  }
}

export default useStatTopBar
