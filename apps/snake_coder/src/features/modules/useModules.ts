'use client'

import type { ModuleCardData } from './moduleCard'

export type UseModulesData = {
  modules: ModuleCardData[]
}

const useModules = (): UseModulesData => {
  const hardData: ModuleCardData[] = [
    {
      id: 'pcep',
      code: 'PCEP',
      title: 'PCEP: fundamenty Pythona',
      requirements: ['Start od zera', 'Podstawy komputera', 'Logika', 'Regularność'],
      desc: 'Zacznij od absolutnych podstaw i ucz się przez krótkie misje. Przerobisz składnię, typy, operatory, instrukcje warunkowe i pętle, a potem przejdziesz do funkcji oraz kolekcji (listy, krotki, słowniki). Na koniec sprintów wchodzisz w test umiejętności, który domyka moduł.',
      progressPercent: 42,
      sprintsDone: 2,
      sprintsTotal: 6,
      sprints: [
        { id: 'pcep-1', progressPercent: 100 },
        { id: 'pcep-2', progressPercent: 100 },
        { id: 'pcep-3', progressPercent: 42 },
        { id: 'pcep-4', progressPercent: 0 },
        { id: 'pcep-5', progressPercent: 0 },
        { id: 'pcep-6', progressPercent: 0 },
      ],
      category: 'certifications',
      difficulty: 'beginner',
      locked: false,
      building: false,
      completed: false,
      route: '/modules/pcep',
    },
    {
      id: 'pcap',
      code: 'PCAP',
      title: 'PCAP: Średnio-zaawansowany programista Python',
      requirements: ['PCEP', 'Funkcje', 'Kolekcje', 'Debugowanie'],
      desc: 'Moduł dla osób, które chcą pisać bardziej “produkcyjnie”. Skupisz się na OOP, modułach i pakietach, wyjątkach, pracy z plikami oraz dobrych praktykach (czytelność, testy, edge-case’y). Każdy sprint kończy się utrwaleniem wiedzy w zadaniach i quizie, a moduł domyka test umiejętności.',
      progressPercent: 0,
      sprintsDone: 0,
      sprintsTotal: 8,
      sprints: [
        { id: 'pcap-1', progressPercent: 0 },
        { id: 'pcap-2', progressPercent: 0 },
        { id: 'pcap-3', progressPercent: 0 },
        { id: 'pcap-4', progressPercent: 0 },
        { id: 'pcap-5', progressPercent: 0 },
        { id: 'pcap-6', progressPercent: 0 },
        { id: 'pcap-7', progressPercent: 0 },
        { id: 'pcap-8', progressPercent: 0 },
      ],
      category: 'certifications',
      difficulty: 'intermediate',
      locked: true,
      building: false,
      completed: false,
      route: '/modules/pcap',
    },
    {
      id: 'numpy',
      code: 'NumPy',
      title: 'NumPy: obliczenia i tablice',
      requirements: ['Podstawy Pythona', 'Listy i pętle', 'Funkcje'],
      desc: 'Wejdź w świat obliczeń numerycznych: tablice, indeksowanie, wektoryzacja i proste operacje na danych. Misje uczą przez praktykę — piszesz kod, uruchamiasz testy i dostajesz feedback. Idealne jako krok w stronę analizy danych i ML.',
      progressPercent: 0,
      sprintsDone: 0,
      sprintsTotal: 0,
      sprints: [],
      category: 'libraries',
      difficulty: 'intermediate',
      locked: false,
      building: true,
      completed: false,
      route: '/modules/numpy',
    },
    {
      id: 'flask',
      code: 'Flask',
      title: 'Flask: web od podstaw',
      requirements: ['Podstawy Pythona', 'Funkcje', 'Podstawy HTTP'],
      desc: 'Zbuduj fundamenty web-devu w Pythonie: routing, request/response, walidacja danych i proste API. Sprinty będą krótkie i konkretne, z testami i automatycznym feedbackiem. Świetne, jeśli chcesz przejść od zadań do praktycznych zastosowań.',
      progressPercent: 0,
      sprintsDone: 0,
      sprintsTotal: 0,
      sprints: [],
      category: 'libraries',
      difficulty: 'intermediate',
      locked: false,
      building: true,
      completed: false,
      route: '/modules/flask',
    },
  ]

  return { modules: hardData }
}

export default useModules
