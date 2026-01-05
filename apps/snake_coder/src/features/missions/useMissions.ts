'use client'

import React from 'react'

import { useQuery } from '@tanstack/react-query'

export type MissionDifficulty = 'beginner' | 'intermediate' | 'advanced'

export type MissionType = 'task' | 'bugfix' | 'quiz' | 'article'

export type MissionStatus = 'todo' | 'inProgress' | 'done'

export type MissionData = {
  id: string
  title: string
  shortDesc: string
  moduleId: string
  moduleCode: string
  moduleTitle: string
  sprintId?: string
  difficulty: MissionDifficulty
  type: MissionType
  status: MissionStatus
  etaMinutes: number
  xp: number
  route: string
}

type MissionFilters = {
  difficulty: MissionDifficulty | ''
  moduleId: string | ''
  type: MissionType | ''
  status: MissionStatus | ''
}

export type UseMissionsData = {
  missions: MissionData[]
  filtered: MissionData[]
  pageMissions: MissionData[]
  total: number
  totalPages: number
  page: number
  perPage: number
  setPage: (page: number) => void
  setPerPage: (perPage: number) => void
  filters: MissionFilters
  setFilter: {
    difficulty: (value: MissionDifficulty | '') => void
    moduleId: (value: string | '') => void
    type: (value: MissionType | '') => void
    status: (value: MissionStatus | '') => void
    clear: () => void
  }
  filterOptions: {
    difficulty: readonly MissionDifficulty[]
    module: Array<{ id: string; code: string; title: string }>
    type: readonly MissionType[]
    status: readonly MissionStatus[]
  }
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

const MAX_PER_PAGE = 50

const EMPTY_MISSIONS: MissionData[] = []

const fetchMissions = async (): Promise<MissionData[]> => {
  const response = await fetch('/api/missions', { method: 'GET' })
  if (!response.ok) {
    throw new Error('Failed to fetch missions')
  }
  return response.json() as Promise<MissionData[]>
}

const useMissions = (): UseMissionsData => {
  const { data } = useQuery({
    queryKey: ['missions'],
    queryFn: fetchMissions,
  })

  const missions = data ?? EMPTY_MISSIONS

  const filterOptions = React.useMemo(() => {
    return {
      difficulty: ['beginner', 'intermediate', 'advanced'] as const,
      module: Array.from(
        missions.reduce((acc, mission) => {
          if (!acc.has(mission.moduleId)) {
            acc.set(mission.moduleId, { id: mission.moduleId, code: mission.moduleCode, title: mission.moduleTitle })
          }
          return acc
        }, new Map<string, { id: string; code: string; title: string }>())
      )
        .map(([, value]) => value)
        .sort((a, b) => a.code.localeCompare(b.code)),
      type: ['task', 'bugfix', 'quiz', 'article'] as const,
      status: ['todo', 'inProgress', 'done'] as const,
    }
  }, [missions])

  const [filters, setFilters] = React.useState<MissionFilters>({
    difficulty: '',
    moduleId: '',
    type: '',
    status: '',
  })

  const [page, setPage] = React.useState(1)
  const [perPage, setPerPage] = React.useState(12)

  const filtered = React.useMemo(
    () =>
      missions.filter((mission) => {
        const difficultyOk = !filters.difficulty || filters.difficulty === mission.difficulty
        const moduleOk = !filters.moduleId || filters.moduleId === mission.moduleId
        const typeOk = !filters.type || filters.type === mission.type
        const statusOk = !filters.status || filters.status === mission.status
        return difficultyOk && moduleOk && typeOk && statusOk
      }),
    [filters.difficulty, filters.moduleId, filters.status, filters.type, missions]
  )

  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / perPage))

  React.useEffect(() => {
    setPage(1)
  }, [filters, perPage])

  React.useEffect(() => {
    setPage((prev) => clamp(prev, 1, totalPages))
  }, [totalPages])

  const pageMissions = React.useMemo(() => {
    const start = (page - 1) * perPage
    return filtered.slice(start, start + perPage)
  }, [filtered, page, perPage])

  return {
    missions,
    filtered,
    pageMissions,
    total,
    totalPages,
    page,
    perPage,
    setPage,
    setPerPage: (next) => setPerPage(clamp(next, 1, MAX_PER_PAGE)),
    filters,
    setFilter: {
      difficulty: (value) => setFilters((prev) => ({ ...prev, difficulty: value })),
      moduleId: (value) => setFilters((prev) => ({ ...prev, moduleId: value })),
      type: (value) => setFilters((prev) => ({ ...prev, type: value })),
      status: (value) => setFilters((prev) => ({ ...prev, status: value })),
      clear: () => setFilters({ difficulty: '', moduleId: '', type: '', status: '' }),
    },
    filterOptions,
  }
}

export default useMissions
