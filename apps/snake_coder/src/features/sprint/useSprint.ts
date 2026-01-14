'use client'

import { useQuery } from '@tanstack/react-query'
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
  isLoading: boolean
  isError: boolean
}

export type UseSprintArgs = {
  moduleId: string
  sprintId: string
}

type SprintApiResponse = {
  header: SprintHeaderData
  tasks: TaskCardData[]
}

const fetchSprint = async ({ moduleId, sprintId }: UseSprintArgs): Promise<SprintApiResponse> => {
  const response = await fetch(`/api/modules/${moduleId}/sprints/${sprintId}`, {
    method: 'GET',
    cache: 'no-store',
  })
  if (!response.ok) {
    throw new Error('Failed to fetch sprint')
  }
  return response.json() as Promise<SprintApiResponse>
}

const useSprint = ({ moduleId, sprintId }: UseSprintArgs): UseSprintData => {
  const t = useTranslations('sprint')

  const fallbackHeader: SprintHeaderData = {
    moduleId,
    sprintId,
    title: `Sprint: ${sprintId}`,
    desc: t('fallback.desc'),
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ['sprint', moduleId, sprintId],
    queryFn: () => fetchSprint({ moduleId, sprintId }),
    enabled: Boolean(moduleId && sprintId),
    refetchOnMount: 'always',
  })

  const header = data?.header ?? fallbackHeader
  const tasks = data?.tasks ?? []
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
    isLoading,
    isError,
  }
}

export default useSprint
