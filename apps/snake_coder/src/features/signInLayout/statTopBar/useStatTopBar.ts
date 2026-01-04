export type StatTopBarUserData = {
  streakDays: number
  xpGained: number
  rank: number
  grade: string
  leagueName: string
}

const useStatTopBar = (): StatTopBarUserData => {
  const hardData: StatTopBarUserData = {
    streakDays: 6,
    xpGained: 420,
    rank: 28,
    grade: 'B+',
    leagueName: 'Silver',
  }

  return {
    streakDays: hardData.streakDays,
    xpGained: hardData.xpGained,
    rank: hardData.rank,
    grade: hardData.grade,
    leagueName: hardData.leagueName,
  }
}

export default useStatTopBar
