'use client'

import { useQuery } from '@tanstack/react-query'

import type { RankingUser } from './components'

export type UseRankingData = {
  champions: RankingUser[]
  users: RankingUser[]
}

type RankingApiResponse = {
  champions: RankingUser[]
  users: RankingUser[]
}

const fetchRanking = async (): Promise<RankingApiResponse> => {
  const response = await fetch('/api/ranking', { method: 'GET', cache: 'no-store' })
  if (!response.ok) {
    throw new Error('Failed to fetch ranking')
  }
  return response.json() as Promise<RankingApiResponse>
}

const useRanking = (): UseRankingData => {
  const { data } = useQuery({
    queryKey: ['ranking'],
    queryFn: fetchRanking,
  })

  return { champions: data?.champions ?? [], users: data?.users ?? [] }
}

export default useRanking
