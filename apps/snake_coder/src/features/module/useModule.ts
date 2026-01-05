'use client'

import { useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'

import type { ModuleHeaderData } from './components/ModuleHeader'
import type { SprintCardData } from './components/SprintTabsCard'

export type UseModuleData = {
  module: ModuleHeaderData
  sprints: SprintCardData[]
  isLoading: boolean
  isError: boolean
}

type ModuleApiResponse = {
  module: ModuleHeaderData
  sprints: SprintCardData[]
}

const fetchModule = async (id: string): Promise<ModuleApiResponse> => {
  const response = await fetch(`/api/modules/${id}`, { method: 'GET' })
  if (!response.ok) {
    throw new Error('Failed to fetch module')
  }
  return response.json() as Promise<ModuleApiResponse>
}

const useModule = (id: string): UseModuleData => {
  const t = useTranslations('module')

  const fallback: ModuleHeaderData = {
    id,
    title: t('fallback.title'),
    desc: t('fallback.desc'),
    status: 'building',
    difficulty: 'beginner',
    progressPercent: 0,
    sprintsDone: 0,
    sprintsTotal: 0,
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ['module', id],
    queryFn: () => fetchModule(id),
    enabled: Boolean(id),
  })

  return {
    module: data?.module ?? fallback,
    sprints: data?.sprints ?? [],
    isLoading,
    isError,
  }
}

export default useModule
