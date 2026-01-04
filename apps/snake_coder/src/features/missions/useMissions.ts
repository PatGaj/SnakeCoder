'use client'

import React from 'react'

import useModules from '@/features/modules/useModules'

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

type BaseMission = Omit<MissionData, 'moduleCode' | 'moduleTitle' | 'difficulty' | 'route'>

const BASE_MISSIONS: BaseMission[] = [
  {
    id: 'pcep-1-article-1',
    moduleId: 'pcep',
    sprintId: 'pcep-1',
    title: 'Artykuł: pierwsze kroki i składnia',
    shortDesc: 'Krótka lektura: zmienne, typy i podstawowe wejście/wyjście.',
    type: 'article',
    status: 'done',
    etaMinutes: 6,
    xp: 20,
  },
  {
    id: 'pcep-1-quiz-1',
    moduleId: 'pcep',
    sprintId: 'pcep-1',
    title: 'Podstawy składni',
    shortDesc: 'Krótki quiz: zmienne, typy i proste operatory.',
    type: 'quiz',
    status: 'done',
    etaMinutes: 6,
    xp: 30,
  },
  {
    id: 'pcep-1-task-1',
    moduleId: 'pcep',
    sprintId: 'pcep-1',
    title: 'Formatowanie napisów',
    shortDesc: 'Popraw output programu bez zmiany logiki.',
    type: 'task',
    status: 'done',
    etaMinutes: 8,
    xp: 55,
  },
  {
    id: 'pcep-2-bugfix-1',
    moduleId: 'pcep',
    sprintId: 'pcep-2',
    title: 'Zły warunek',
    shortDesc: 'Napraw błąd w if/elif dla edge-case’ów.',
    type: 'bugfix',
    status: 'inProgress',
    etaMinutes: 7,
    xp: 45,
  },
  {
    id: 'pcep-2-task-1',
    moduleId: 'pcep',
    sprintId: 'pcep-2',
    title: 'Pętle i sumowanie',
    shortDesc: 'Policz wynik na podstawie listy liczb i przejdź testy.',
    type: 'task',
    status: 'todo',
    etaMinutes: 10,
    xp: 60,
  },
  {
    id: 'pcep-3-article-1',
    moduleId: 'pcep',
    sprintId: 'pcep-3',
    title: 'Artykuł: funkcje i walidacja',
    shortDesc: 'Argumenty, return i walidacja danych wejściowych w praktyce.',
    type: 'article',
    status: 'done',
    etaMinutes: 7,
    xp: 25,
  },
  {
    id: 'pcep-3-task-1',
    moduleId: 'pcep',
    sprintId: 'pcep-3',
    title: 'Walidacja argumentów funkcji',
    shortDesc: 'Dodaj sprawdzanie typu i zakresu argumentów oraz upewnij się, że rozwiązanie przechodzi testy.',
    type: 'task',
    status: 'inProgress',
    etaMinutes: 8,
    xp: 60,
  },
  {
    id: 'pcep-3-bugfix-1',
    moduleId: 'pcep',
    sprintId: 'pcep-3',
    title: 'Popraw błąd w warunku',
    shortDesc: 'Napraw błąd logiczny w warunku, który powoduje zły wynik dla edge-case’ów.',
    type: 'bugfix',
    status: 'todo',
    etaMinutes: 6,
    xp: 45,
  },
  {
    id: 'pcep-3-quiz-1',
    moduleId: 'pcep',
    sprintId: 'pcep-3',
    title: 'Funkcje i return',
    shortDesc: 'Krótki quiz z argumentów, return i podstaw walidacji.',
    type: 'quiz',
    status: 'todo',
    etaMinutes: 5,
    xp: 30,
  },
  {
    id: 'pcep-3-task-2',
    moduleId: 'pcep',
    sprintId: 'pcep-3',
    title: 'Refaktor czytelności',
    shortDesc: 'Uprość kod: lepsze nazwy, mniejsze zagnieżdżenia, lepsze warunki.',
    type: 'task',
    status: 'done',
    etaMinutes: 7,
    xp: 40,
  },
  {
    id: 'pcep-4-task-1',
    moduleId: 'pcep',
    sprintId: 'pcep-4',
    title: 'Słowniki w praktyce',
    shortDesc: 'Zbuduj mapę zliczeń i obsłuż brakujące klucze.',
    type: 'task',
    status: 'todo',
    etaMinutes: 11,
    xp: 70,
  },
  {
    id: 'pcep-4-quiz-1',
    moduleId: 'pcep',
    sprintId: 'pcep-4',
    title: 'Kolekcje',
    shortDesc: 'Listy, krotki, słowniki — szybki przegląd.',
    type: 'quiz',
    status: 'todo',
    etaMinutes: 6,
    xp: 30,
  },
  {
    id: 'pcap-1-task-1',
    moduleId: 'pcap',
    sprintId: 'pcap-1',
    title: 'Klasa i walidacja',
    shortDesc: 'Zaimplementuj klasę z metodami i walidacją danych.',
    type: 'task',
    status: 'todo',
    etaMinutes: 12,
    xp: 90,
  },
  {
    id: 'pcap-1-bugfix-1',
    moduleId: 'pcap',
    sprintId: 'pcap-1',
    title: 'Atrybut klasy',
    shortDesc: 'Napraw błąd związany z atrybutem klasowym vs instancji.',
    type: 'bugfix',
    status: 'todo',
    etaMinutes: 9,
    xp: 70,
  },
  {
    id: 'pcap-2-task-1',
    moduleId: 'pcap',
    sprintId: 'pcap-2',
    title: 'Dziedziczenie',
    shortDesc: 'Użyj dziedziczenia i nadpisywania metod w praktyce.',
    type: 'task',
    status: 'todo',
    etaMinutes: 14,
    xp: 100,
  },
  {
    id: 'pcap-3-quiz-1',
    moduleId: 'pcap',
    sprintId: 'pcap-3',
    title: 'Wyjątki',
    shortDesc: 'Wyjątki, raise, try/except — pytania praktyczne.',
    type: 'quiz',
    status: 'todo',
    etaMinutes: 7,
    xp: 35,
  },
  {
    id: 'pcap-4-task-1',
    moduleId: 'pcap',
    sprintId: 'pcap-4',
    title: 'Importy i pakiety',
    shortDesc: 'Popraw strukturę importów i przygotuj prosty pakiet.',
    type: 'task',
    status: 'todo',
    etaMinutes: 12,
    xp: 85,
  },
  {
    id: 'pcap-5-bugfix-1',
    moduleId: 'pcap',
    sprintId: 'pcap-5',
    title: 'Parsowanie pliku',
    shortDesc: 'Napraw błąd w odczycie danych i obsłuż złe formaty.',
    type: 'bugfix',
    status: 'todo',
    etaMinutes: 10,
    xp: 80,
  },
  {
    id: 'pcap-6-task-1',
    moduleId: 'pcap',
    sprintId: 'pcap-6',
    title: 'Testy jednostkowe',
    shortDesc: 'Dodaj testy i upewnij się, że edge-case’y są pokryte.',
    type: 'task',
    status: 'todo',
    etaMinutes: 15,
    xp: 110,
  },
]

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

const useMissions = (): UseMissionsData => {
  const { modules } = useModules()

  const moduleById = React.useMemo(() => new Map(modules.map((m) => [m.id, m])), [modules])

  const missions: MissionData[] = React.useMemo(
    () =>
      BASE_MISSIONS.map((mission) => {
        const moduleData = moduleById.get(mission.moduleId)
        const routeBase =
          mission.type === 'quiz'
            ? '/missions/quiz'
            : mission.type === 'article'
            ? '/missions/article'
            : '/missions/task'
        return {
          ...mission,
          moduleCode: moduleData?.code ?? mission.moduleId.toUpperCase(),
          moduleTitle: moduleData?.title ?? mission.moduleId,
          difficulty: moduleData?.difficulty ?? 'beginner',
          route: `${routeBase}/${mission.id}`,
        }
      }),
    [moduleById]
  )

  const filterOptions = React.useMemo(() => {
    const moduleIds = Array.from(new Set(missions.map((m) => m.moduleId)))
    return {
      difficulty: ['beginner', 'intermediate', 'advanced'] as const,
      module: moduleIds
        .map((id) => {
          const moduleData = moduleById.get(id)
          return {
            id,
            code: moduleData?.code ?? id.toUpperCase(),
            title: moduleData?.title ?? id,
          }
        })
        .sort((a, b) => a.code.localeCompare(b.code)),
      type: ['task', 'bugfix', 'quiz', 'article'] as const,
      status: ['todo', 'inProgress', 'done'] as const,
    }
  }, [missions, moduleById])

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
