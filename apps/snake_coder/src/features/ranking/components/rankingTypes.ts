export type RankingTier = 'champions' | 'gold' | 'silver' | 'bronze'

export type RankingUser = {
  id: string
  rank: number
  name: string
  avatarUrl?: string | null
  xp: number
  streakDays: number
  grade: string
}

