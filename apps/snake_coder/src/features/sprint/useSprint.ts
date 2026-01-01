'use client'

import { useTranslations } from 'next-intl'

import type { KanbanColumnId, TaskCardData } from './components'

type KanbanTone = 'muted' | 'secondary' | 'success'

export type SprintHeaderData = {
  moduleId: string
  sprintId: string
  title: string
  desc: string
}

export type UseSprintData = {
  header: SprintHeaderData
  columns: Array<{
    id: KanbanColumnId
    title: string
    tone: KanbanTone
    tasks: TaskCardData[]
    count: number
  }>
  hasTasks: boolean
}

export type UseSprintArgs = {
  moduleId: string
  sprintId: string
}

const useSprint = ({ moduleId, sprintId }: UseSprintArgs): UseSprintData => {
  const t = useTranslations('sprint')

  const header: SprintHeaderData = {
    moduleId,
    sprintId,
    title: `Sprint: ${sprintId}`,
    desc: 'Krótki kanban z zadaniami sprintu. Kliknij kartę, aby zobaczyć szczegóły i przejść do zadania.',
  }

  const taskPool: Record<string, TaskCardData[]> = {
    'pcep-3': [
      {
        id: 'pcep-3-task-1',
        title: 'Walidacja argumentów funkcji',
        shortDesc: 'Dodaj sprawdzanie typu i zakresu argumentów oraz upewnij się, że rozwiązanie przechodzi testy.',
        etaMinutes: 8,
        xp: 60,
        type: 'code',
        status: 'inProgress',
        route: '/missions',
        details: {
          goal: 'Napisz funkcję zgodnie z opisem, dodaj walidację wejścia i przejdź wszystkie testy.',
          requirements: [
            'Nie używaj pętli for.',
            'Nie używaj bibliotek zewnętrznych.',
            'Błędne dane wejściowe obsłuż przez TypeError / ValueError (bez print).',
          ],
          hints: [
            'Zastanów się, czy lepiej zwracać błąd, czy rzucać wyjątek.',
            'Obsłuż przypadki brzegowe: None, typy nieint, wartości ujemne.',
          ],
        },
      },
      {
        id: 'pcep-3-task-2',
        title: 'Popraw błąd w warunku',
        shortDesc: 'Napraw błąd logiczny w warunku, który powoduje zły wynik dla edge-case’ów.',
        etaMinutes: 6,
        xp: 45,
        type: 'bugfix',
        status: 'todo',
        route: '/missions',
        details: {
          goal: 'Znajdź problem w kodzie i popraw go tak, aby testy przechodziły.',
          requirements: [
            'Zmień tylko to, co konieczne — nie przepisuj całego rozwiązania.',
            'Upewnij się, że wszystkie testy przechodzą po poprawce.',
          ],
          hints: ['Uruchom testy i sprawdź, dla jakiego przypadku wynik jest błędny.'],
        },
      },
      {
        id: 'pcep-3-quiz-1',
        title: 'Quiz: funkcje i return',
        shortDesc: 'Krótki quiz z argumentów, return i podstaw walidacji.',
        etaMinutes: 5,
        xp: 30,
        type: 'quiz',
        status: 'todo',
        route: '/missions',
        details: {
          goal: 'Odpowiedz na pytania i zobacz wynik od razu.',
          requirements: [],
          hints: ['Zwróć uwagę na mutowalność argumentów i domyślne wartości.'],
        },
      },
      {
        id: 'pcep-3-task-3',
        title: 'Refaktor czytelności',
        shortDesc: 'Uprość kod: lepsze nazwy, mniejsze zagnieżdżenia, lepsze warunki.',
        etaMinutes: 7,
        xp: 40,
        type: 'code',
        status: 'done',
        route: '/missions',
        details: {
          goal: 'Popraw czytelność rozwiązania bez zmiany zachowania.',
          requirements: [
            'Nie zmieniaj zachowania (testy muszą przejść).',
            'Unikaj głębokich zagnieżdżeń — uprość warunki.',
            'Zadbaj o czytelne nazwy zmiennych i funkcji.',
          ],
          hints: ['Wyciągnij warunki do pomocniczych funkcji lub zmiennych.'],
        },
      },
    ],
  }

  const tasks = taskPool[sprintId] ?? []
  const tasksByStatus = tasks.reduce<Record<KanbanColumnId, TaskCardData[]>>(
    (acc, task) => {
      acc[task.status].push(task)
      return acc
    },
    { todo: [], inProgress: [], done: [] }
  )

  return {
    header,
    columns: [
      { id: 'todo', title: t('columns.todo'), tone: 'muted', tasks: tasksByStatus.todo, count: tasksByStatus.todo.length },
      {
        id: 'inProgress',
        title: t('columns.inProgress'),
        tone: 'secondary',
        tasks: tasksByStatus.inProgress,
        count: tasksByStatus.inProgress.length,
      },
      { id: 'done', title: t('columns.done'), tone: 'success', tasks: tasksByStatus.done, count: tasksByStatus.done.length },
    ],
    hasTasks: tasks.length > 0,
  }
}

export default useSprint
