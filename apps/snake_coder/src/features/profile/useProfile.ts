'use client'

import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

import type { ProfileAccountData, ProfileStatsData } from './components'

export type UseProfileData = {
  account: ProfileAccountData
  stats: ProfileStatsData
}

const useProfile = (): UseProfileData => {
  const t = useTranslations('profile')
  const { data: session } = useSession()

  const name = session?.user?.name || t('fallbackUser')

  const hardData = {
    nickName: 'julia_dev',
    firstName: 'Julia',
    lastName: 'Kowalska',
    stats: {
      xpTotal: 6420,
      bestStreakDays: 28,
      gradeAvg: 'B+',
    },
  } as const

  return {
    account: {
      userName: name,
      nickName: hardData.nickName,
      firstName: hardData.firstName,
      lastName: hardData.lastName,
    },
    stats: hardData.stats,
  }
}

export default useProfile
