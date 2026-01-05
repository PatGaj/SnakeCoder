'use client'

import { useQuery } from '@tanstack/react-query'

import type { ModuleCardData } from './moduleCard'

export type UseModulesData = {
  modules: ModuleCardData[]
  isLoading: boolean
  isError: boolean
}

const fetchModules = async (): Promise<ModuleCardData[]> => {
  const response = await fetch('/api/modules', { method: 'GET' })
  if (!response.ok) {
    throw new Error('Failed to fetch modules')
  }
  return response.json() as Promise<ModuleCardData[]>
}

const useModules = (): UseModulesData => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['modules'],
    queryFn: fetchModules,
  })

  return { modules: data ?? [], isLoading, isError }
}

export default useModules
