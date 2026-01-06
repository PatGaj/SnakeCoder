'use client'

import { useTranslations } from 'next-intl'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import type { ProfileAccountData, ProfileAccountSaveResult, ProfileStatsData, ProfileUnlockedModuleData } from './components'

export type UseProfileData = {
  account?: ProfileAccountData
  stats?: ProfileStatsData
  unlockedModules: ProfileUnlockedModuleData[]
  isLoading: boolean
  isError: boolean
  errorLabel: string
  saveAccount: (values: { nickName: string; firstName?: string; lastName?: string }) => Promise<ProfileAccountSaveResult>
}

type ProfileApiResponse = {
  account: {
    userName: string | null
    nickName: string | null
    firstName: string | null
    lastName: string | null
  }
  stats: {
    xpTotal: number
    bestStreakDays: number
    gradeAvg: number | null
  }
  unlockedModules: ProfileUnlockedModuleData[]
}

const fetchProfile = async (): Promise<ProfileApiResponse> => {
  const response = await fetch('/api/user', { method: 'GET', cache: 'no-store' })
  if (!response.ok) {
    throw new Error('Failed to fetch profile')
  }
  return response.json() as Promise<ProfileApiResponse>
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

const useProfile = (): UseProfileData => {
  const t = useTranslations('profile')
  const queryClient = useQueryClient()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['user'],
    queryFn: fetchProfile,
  })

  const saveAccount = async (values: {
    nickName: string
    firstName?: string
    lastName?: string
  }): Promise<ProfileAccountSaveResult> => {
    const nickName = values.nickName.trim()
    const firstName = values.firstName?.trim() || null
    const lastName = values.lastName?.trim() || null

    const response = await fetch('/api/user', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nickName,
        firstName,
        lastName,
      }),
    })

    if (response.ok) {
      const userName = [firstName, lastName].filter(Boolean).join(' ').trim() || nickName
      queryClient.setQueryData(['user'], (prev: ProfileApiResponse | undefined) => {
        if (!prev) return prev
        return {
          ...prev,
          account: {
            ...prev.account,
            userName,
            nickName,
            firstName: firstName,
            lastName: lastName,
          },
        }
      })
      await queryClient.invalidateQueries({ queryKey: ['user'] })
      return { ok: true }
    }

    const payload = (await response.json().catch(() => null)) as { error?: string } | null
    const errorMessage = payload?.error ?? ''

    if (response.status === 400 && errorMessage === 'Invalid nickname') {
      return { ok: false, error: 'Invalid nickname' }
    }
    if (response.status === 409 && errorMessage === 'Nickname already exists') {
      return { ok: false, error: 'Nickname already exists' }
    }

    return { ok: false, error: 'Generic' }
  }

  if (!data) {
    return {
      account: undefined,
      stats: undefined,
      unlockedModules: [],
      isLoading,
      isError,
      errorLabel: t('error'),
      saveAccount,
    }
  }

  return {
    account: {
      userName: data.account.userName ?? t('fallbackUser'),
      nickName: data.account.nickName ?? 'user',
      firstName: data.account.firstName,
      lastName: data.account.lastName,
    },
    stats: {
      xpTotal: data.stats.xpTotal,
      bestStreakDays: data.stats.bestStreakDays,
      gradeAvg: gradeLabelFromAvg(data.stats.gradeAvg),
    },
    unlockedModules: data.unlockedModules,
    isLoading,
    isError,
    errorLabel: t('error'),
    saveAccount,
  }
}

export default useProfile
