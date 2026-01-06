'use client'

import { useQuery } from '@tanstack/react-query'

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

const fetchStatTopBar = async (): Promise<StatTopBarApiResponse> => {
  const response = await fetch('/api/user/stats', { method: 'GET', cache: 'no-store' })
  if (!response.ok) {
    throw new Error('Failed to fetch stats')
  }
  return response.json() as Promise<StatTopBarApiResponse>
}

const gradeLabelFromAvg = (avg: number | null) => {
  if (avg == null) return '—'
  if (avg >= 4.75) return 'A'
  if (avg >= 4.25) return 'A-'
  if (avg >= 4.0) return 'B+'
  if (avg >= 3.5) return 'B'
  if (avg >= 3.0) return 'C+'
  if (avg >= 2.5) return 'C'
  if (avg >= 2.0) return 'D'
  return 'E'
}

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
