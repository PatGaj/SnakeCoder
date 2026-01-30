import { useMutation, useQueryClient } from '@tanstack/react-query'

import { executeTask, reviewTask, saveTask } from '../api'
import type { ExecuteMode, SprintTaskStatus } from '../types'
import { invalidateSubmitCaches, invalidateTaskCaches } from '../utils/cache'

type TaskMutationParams = {
  id: string
  locale: string
  updateSprintStatus: (status: SprintTaskStatus) => void
}

// Groups task-related mutations (run/test/save/submit/review) with cache updates and analytics.
export const useTaskMutations = ({ id, locale, updateSprintStatus }: TaskMutationParams) => {
  const queryClient = useQueryClient()

  const saveMutation = useMutation({
    mutationFn: (userCode: string) => saveTask(id, userCode),
    onSuccess: async (_data, userCode) => {
      queryClient.setQueryData(['task', id], (prev: { userCode?: string } | undefined) => {
        if (!prev) return prev
        return { ...prev, userCode }
      })

      await invalidateTaskCaches(queryClient)
    },
  })

  const executeMutation = useMutation({
    mutationKey: ['taskExecute', id],
    mutationFn: (payload: { source: string; mode: ExecuteMode; timeSpentSeconds?: number; sessionId?: string }) =>
      executeTask(id, payload),
    onSuccess: async (response, variables) => {
      if (variables.mode !== 'completeTask') return

      if (response.mode === 'completeTask') {
        updateSprintStatus(response.isTaskPassed ? 'done' : 'inProgress')
      }

      await invalidateSubmitCaches(queryClient)
    },
  })

  const aiReviewMutation = useMutation({
    mutationFn: (source: string) => reviewTask(id, source, locale),
  })

  return {
    saveMutation,
    executeMutation,
    aiReviewMutation,
  }
}
