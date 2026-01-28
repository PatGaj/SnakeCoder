import type { AiReviewResponse, ExecuteMode, ExecuteResponse, ExecuteResponseRaw, TaskApiResponse } from './types'

import { normalizeExecuteValue } from './utils/execution'

type ExecuteRequest = {
  source: string
  mode: ExecuteMode
  timeSpentSeconds?: number
  sessionId?: string
}

// Fetches task data (description, editor config, public tests, user progress) for the given mission id.
export const fetchTask = async (id: string): Promise<TaskApiResponse> => {
  const response = await fetch(`/api/missions/task/${encodeURIComponent(id)}`, { method: 'GET' })
  if (!response.ok) {
    throw new Error('Failed to fetch task')
  }
  return response.json() as Promise<TaskApiResponse>
}

// Persists user code for a task; returns `{ ok: true }` on success.
export const saveTask = async (id: string, userCode: string) => {
  const response = await fetch(`/api/missions/task/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userCode }),
  })

  if (!response.ok) {
    throw new Error('Failed to save task')
  }

  return response.json() as Promise<{ ok: true }>
}

// Executes task code in the executor; returns run results or completion summary based on mode.
export const executeTask = async (id: string, payload: ExecuteRequest): Promise<ExecuteResponse> => {
  const response = await fetch(`/api/missions/task/${encodeURIComponent(id)}/execute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error('Failed to execute task')
  }

  const data = (await response.json()) as ExecuteResponseRaw

  if (data.mode === 'completeTask') {
    return data
  }

  const rawResults = Array.isArray(data.results) ? data.results : []

  return {
    ...data,
    results: rawResults.map((result) => ({
      expected: normalizeExecuteValue(result.expected),
      actual: normalizeExecuteValue(result.actual),
      passed: result.passed,
      stdout: normalizeExecuteValue(result.stdout),
      stderr: normalizeExecuteValue(result.stderr),
      error: normalizeExecuteValue(result.error),
    })),
  }
}

// Requests an AI review for the user's solution, throwing a rich error when the API responds with an error payload.
export const reviewTask = async (id: string, source: string, locale: string): Promise<AiReviewResponse> => {
  const response = await fetch(`/api/missions/task/${encodeURIComponent(id)}/review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ source, locale }),
  })

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as {
      error?: string
      remaining?: number
      limit?: number
    } | null
    const error = new Error(payload?.error ?? 'Failed to review task') as Error & {
      status?: number
      remaining?: number
      limit?: number
    }

    error.status = response.status
    error.remaining = payload?.remaining
    error.limit = payload?.limit

    throw error
  }

  return response.json() as Promise<AiReviewResponse>
}
