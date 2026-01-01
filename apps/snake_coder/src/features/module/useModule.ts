'use client'

import { useTranslations } from 'next-intl'

import type { ModuleCardData } from '@/features/modules/moduleCard'

import useModules from '@/features/modules/useModules'

import type { ModuleHeaderData } from './components/ModuleHeader'
import type { SprintCardData } from './components/SprintTabsCard'

export type UseModuleData = {
  module: ModuleHeaderData
  sprints: SprintCardData[]
}

const useModule = (id: string): UseModuleData => {
  const t = useTranslations('module')
  const { modules } = useModules()
  const base = modules.find((module) => module.id === id)

  const fallback: ModuleCardData = {
    id,
    code: id.toUpperCase(),
    title: t('fallback.title'),
    requirements: [],
    desc: t('fallback.desc'),
    progressPercent: 0,
    sprints: [],
    sprintsDone: 0,
    sprintsTotal: 0,
    category: 'certifications',
    difficulty: 'beginner',
    locked: false,
    building: true,
    completed: false,
    route: `/modules/${id}`,
  }

  const moduleData = base ?? fallback

  const status: ModuleHeaderData['status'] = moduleData.building
    ? 'building'
    : moduleData.locked
      ? 'locked'
      : moduleData.completed
        ? 'completed'
        : 'available'

  const sprintHardData: Record<string, Omit<SprintCardData, 'route'>> = {
    'pcep-1': {
      id: 'pcep-1',
      sprintNo: 1,
      title: 'Pierwsze kroki i składnia',
      desc: 'Zmienne, proste operacje i podstawowe wejście/wyjście.',
      etaMinutes: 18,
      progressPercent: 100,
      tasksDone: 6,
      tasksTotal: 6,
      articleDone: true,
      quizScore: 10,
      quizTotal: 10,
      status: 'done',
    },
    'pcep-2': {
      id: 'pcep-2',
      sprintNo: 2,
      title: 'Warunki i pętle',
      desc: 'if/elif/else, for/while i praktyczne patterny.',
      etaMinutes: 22,
      progressPercent: 100,
      tasksDone: 6,
      tasksTotal: 6,
      articleDone: true,
      quizScore: 10,
      quizTotal: 10,
      status: 'done',
    },
    'pcep-3': {
      id: 'pcep-3',
      sprintNo: 3,
      title: 'Funkcje: argumenty i zwracanie',
      desc: 'Return, argumenty, walidacja i czytelność kodu.',
      etaMinutes: 18,
      progressPercent: 42,
      tasksDone: 2,
      tasksTotal: 6,
      articleDone: true,
      quizScore: 6,
      quizTotal: 10,
      status: 'inProgress',
    },
    'pcep-4': {
      id: 'pcep-4',
      sprintNo: 4,
      title: 'Kolekcje',
      desc: 'Listy, krotki i słowniki w zadaniach.',
      etaMinutes: 20,
      progressPercent: 0,
      tasksDone: 0,
      tasksTotal: 6,
      articleDone: false,
      quizScore: 0,
      quizTotal: 10,
      status: 'available',
    },
    'pcep-5': {
      id: 'pcep-5',
      sprintNo: 5,
      title: 'Napisy i formatowanie',
      desc: 'Stringi, slicing i praktyczne formatowanie.',
      etaMinutes: 18,
      progressPercent: 0,
      tasksDone: 0,
      tasksTotal: 6,
      articleDone: false,
      quizScore: 0,
      quizTotal: 10,
      status: 'locked',
    },
    'pcep-6': {
      id: 'pcep-6',
      sprintNo: 6,
      title: 'Test umiejętności (PCEP)',
      desc: 'Zadania + quiz końcowy, żeby przejść dalej.',
      etaMinutes: 25,
      progressPercent: 0,
      tasksDone: 0,
      tasksTotal: 6,
      articleDone: false,
      quizScore: 0,
      quizTotal: 10,
      status: 'locked',
    },
    'pcap-1': {
      id: 'pcap-1',
      sprintNo: 1,
      title: 'OOP: klasy i obiekty',
      desc: 'Atrybuty, metody i praca na prostych modelach.',
      etaMinutes: 24,
      progressPercent: 0,
      tasksDone: 0,
      tasksTotal: 6,
      articleDone: false,
      quizScore: 0,
      quizTotal: 10,
      status: 'locked',
    },
    'pcap-2': {
      id: 'pcap-2',
      sprintNo: 2,
      title: 'Dziedziczenie i polimorfizm',
      desc: 'Relacje klas, nadpisywanie i praktyczne przykłady.',
      etaMinutes: 24,
      progressPercent: 0,
      tasksDone: 0,
      tasksTotal: 6,
      articleDone: false,
      quizScore: 0,
      quizTotal: 10,
      status: 'locked',
    },
    'pcap-3': {
      id: 'pcap-3',
      sprintNo: 3,
      title: 'Wyjątki i debugowanie',
      desc: 'Obsługa błędów, komunikaty i stabilny kod.',
      etaMinutes: 20,
      progressPercent: 0,
      tasksDone: 0,
      tasksTotal: 6,
      articleDone: false,
      quizScore: 0,
      quizTotal: 10,
      status: 'locked',
    },
    'pcap-4': {
      id: 'pcap-4',
      sprintNo: 4,
      title: 'Moduły i pakiety',
      desc: 'Importy, struktura projektu i dobre nawyki.',
      etaMinutes: 22,
      progressPercent: 0,
      tasksDone: 0,
      tasksTotal: 6,
      articleDone: false,
      quizScore: 0,
      quizTotal: 10,
      status: 'locked',
    },
    'pcap-5': {
      id: 'pcap-5',
      sprintNo: 5,
      title: 'Pliki i formaty danych',
      desc: 'Odczyt/zapis, JSON/CSV i walidacja.',
      etaMinutes: 22,
      progressPercent: 0,
      tasksDone: 0,
      tasksTotal: 6,
      articleDone: false,
      quizScore: 0,
      quizTotal: 10,
      status: 'locked',
    },
    'pcap-6': {
      id: 'pcap-6',
      sprintNo: 6,
      title: 'Testy i dobre praktyki',
      desc: 'Testowanie, czytelność i edge-case’y.',
      etaMinutes: 22,
      progressPercent: 0,
      tasksDone: 0,
      tasksTotal: 6,
      articleDone: false,
      quizScore: 0,
      quizTotal: 10,
      status: 'locked',
    },
    'pcap-7': {
      id: 'pcap-7',
      sprintNo: 7,
      title: 'Kolekcje i algorytmy w praktyce',
      desc: 'Zadania na strukturach danych i złożoności.',
      etaMinutes: 24,
      progressPercent: 0,
      tasksDone: 0,
      tasksTotal: 6,
      articleDone: false,
      quizScore: 0,
      quizTotal: 10,
      status: 'locked',
    },
    'pcap-8': {
      id: 'pcap-8',
      sprintNo: 8,
      title: 'Test umiejętności (PCAP)',
      desc: 'Zadania + quiz końcowy, żeby przejść dalej.',
      etaMinutes: 28,
      progressPercent: 0,
      tasksDone: 0,
      tasksTotal: 6,
      articleDone: false,
      quizScore: 0,
      quizTotal: 10,
      status: 'locked',
    },
  }

  const sprints: SprintCardData[] =
    moduleData.category === 'certifications' && (moduleData.id === 'pcep' || moduleData.id === 'pcap')
      ? moduleData.sprints.map((sprint) => {
          const data = sprintHardData[sprint.id]
          const route = `/modules/${moduleData.id}/${sprint.id}`
          return {
            ...(data ?? {
              id: sprint.id,
              sprintNo: 0,
              title: t('sprints.fallbackTitle'),
              desc: t('sprints.fallbackDesc'),
              etaMinutes: 0,
              progressPercent: sprint.progressPercent,
              tasksDone: 0,
              tasksTotal: 0,
              articleDone: false,
              quizScore: 0,
              quizTotal: 0,
              status: 'available' as const,
            }),
            status: moduleData.locked ? 'locked' : (data?.status ?? 'available'),
            route,
          }
        })
      : []

  return {
    module: {
      id: moduleData.id,
      title: moduleData.title,
      desc: moduleData.desc,
      status,
      difficulty: moduleData.difficulty,
      progressPercent: moduleData.progressPercent,
      sprintsDone: moduleData.sprintsDone,
      sprintsTotal: moduleData.sprintsTotal,
    },
    sprints,
  }
}

export default useModule
