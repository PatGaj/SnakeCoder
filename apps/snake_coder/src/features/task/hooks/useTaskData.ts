import { useCallback, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import { fetchTask } from '../api'
import type { SprintTaskStatus, TaskApiResponse } from '../types'
import { invalidateTaskCaches } from '../utils/cache'

// Fetches task data and exposes a status updater for sprint/missions caches.
export const useTaskData = (id: string) => {
  const queryClient = useQueryClient()
  const updateSprintStatus = useCallback(
    (nextStatus: SprintTaskStatus) => {
      queryClient.setQueriesData<{ tasks: Array<{ id: string; status: SprintTaskStatus }> }>(
        { queryKey: ['sprint'] },
        (prev) => {
          if (!prev) return prev
          let changed = false
          const tasks = prev.tasks.map((task) => {
            if (task.id !== id) return task
            if (task.status === nextStatus) return task
            changed = true
            return { ...task, status: nextStatus }
          })

          return changed ? { ...prev, tasks } : prev
        }
      )

      queryClient.setQueriesData<Array<{ id: string; status: SprintTaskStatus }>>(
        { queryKey: ['missions'] },
        (prev) => {
          if (!prev) return prev
          let changed = false
          const missions = prev.map((mission) => {
            if (mission.id !== id) return mission
            if (mission.status === nextStatus) return mission
            changed = true
            return { ...mission, status: nextStatus }
          })

          return changed ? missions : prev
        }
      )
    },
    [id, queryClient]
  )

  const { data, isError } = useQuery({
    queryKey: ['task', id],
    queryFn: () => fetchTask(id),
    enabled: Boolean(id),
  })

  // Keep sprint status in sync and refresh related caches when task data changes.
  useEffect(() => {
    if (!data) return

    const nextStatus: SprintTaskStatus =
      data.status === 'DONE' ? 'done' : data.status === 'IN_PROGRESS' ? 'inProgress' : 'todo'

    if (nextStatus !== 'todo') {
      updateSprintStatus(nextStatus)
    }

    void invalidateTaskCaches(queryClient)
  }, [data, updateSprintStatus, queryClient])

  return { data: data as TaskApiResponse | undefined, isError, updateSprintStatus }
}
