'use client'

import React from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useLocale, useTranslations } from 'next-intl'
import toast from 'react-hot-toast'

import { getSessionId } from '@/lib/analytics'

import type { CodeEditorData, PublicTestsData, TaskDescriptionData, TestResultsData } from './components'

export type UseTaskData = {
  errorLabel: string
  isError: boolean
  task?: TaskDescriptionData
  editor?: CodeEditorData
  publicTests?: PublicTestsData
  code: string
  onCodeChange: (value: string) => void
  consoleValue: string
  results: TestResultsData
  runLoading: boolean
  testLoading: boolean
  saveLoading: boolean
  submitLoading: boolean
  aiLoading: boolean
  aiReviewVisible: boolean
  aiReviewDisabled: boolean
  aiReviewRemaining: number | null
  aiReviewLimit: number | null
  submitDisabled: boolean
  onRun: () => void
  onTest: () => void
  onSave: () => void
  onReset: () => void
  onSubmit: () => void
  onAiReview: () => void
  submitModalOpen: boolean
  submitPercent: number
  submitModalMessage: string
  submitStats: {
    timeSpentSeconds: number | null
    attemptsCount: number | null
    xpAwarded: number
  } | null
  closeSubmitModal: () => void
  saveLabel: string
  resetLabel: string
}

type SubmitScore = {
  passed: number
  total: number
  isPassed: boolean
  xpAwarded: number
  timeSpentSeconds: number | null
  testAttemptsCount: number | null
}

type ExecuteMode = 'runCode' | 'fullTest' | 'completeTask'

type TaskApiResponse = {
  task: TaskDescriptionData
  editor: CodeEditorData
  patternCode: string
  userCode: string | null
  publicTests: PublicTestsData
  totalTestsCount: number
  timeLimitSeconds: number
  status: 'TODO' | 'IN_PROGRESS' | 'DONE'
  startedAt: string | null
  missionType: 'TASK' | 'BUGFIX'
  aiReviewEnabled?: boolean
  aiReviewRemaining: number | null
  aiReviewLimit: number | null
}

type ExecuteCaseResult = {
  expected?: string | null
  actual?: string | null
  passed?: boolean
  stdout?: string | null
  stderr?: string | null
  error?: string | null
}

type ExecuteRunResponse = { mode: 'runCode' | 'fullTest'; results: ExecuteCaseResult[] }
type ExecuteCompleteResponse = {
  mode: 'completeTask'
  isTaskPassed: boolean
  passedCount: number
  totalCount: number
  xpAwarded: number
  timeSpentSeconds: number | null
  testAttemptsCount: number
}

type ExecuteResponse = ExecuteRunResponse | ExecuteCompleteResponse

type ExecuteCaseResultRaw = {
  expected?: unknown | null
  actual?: unknown | null
  passed?: boolean
  stdout?: unknown | null
  stderr?: unknown | null
  error?: unknown | null
}

type ExecuteRunResponseRaw = { mode: 'runCode' | 'fullTest'; results: ExecuteCaseResultRaw[] }
type ExecuteResponseRaw = ExecuteRunResponseRaw | ExecuteCompleteResponse

type AiReviewResponse = {
  grade: string
  summary: string
  strengths: string[]
  improvements: string[]
  nextSteps: string[]
  remaining: number
  limit: number
}

const scoreToPercent = (score: SubmitScore) => (score.total > 0 ? Math.round((score.passed / score.total) * 100) : 0)

type SprintTaskStatus = 'todo' | 'inProgress' | 'done'

type SprintCacheData = {
  tasks: Array<{
    id: string
    status: SprintTaskStatus
  }>
}

type MissionsCacheData = Array<{
  id: string
  status: SprintTaskStatus
}>

const fetchTask = async (id: string): Promise<TaskApiResponse> => {
  const response = await fetch(`/api/missions/task/${encodeURIComponent(id)}`, { method: 'GET' })
  if (!response.ok) {
    throw new Error('Failed to fetch task')
  }
  return response.json() as Promise<TaskApiResponse>
}

const saveTask = async (id: string, userCode: string) => {
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

const executeTask = async (
  id: string,
  payload: { source: string; mode: ExecuteMode; timeSpentSeconds?: number; sessionId?: string }
): Promise<ExecuteResponse> => {
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

const reviewTask = async (id: string, source: string, locale: string): Promise<AiReviewResponse> => {
  const response = await fetch(`/api/missions/task/${encodeURIComponent(id)}/review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ source, locale }),
  })

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { error?: string; remaining?: number; limit?: number } | null
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

const normalizeExecuteValue = (value: unknown): string | null => {
  if (value === null || value === undefined) return null
  if (typeof value === 'string') return value
  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}

const toDisplayText = (value: string | null | undefined) => value ?? ''

const formatConsoleFromRun = (results: ExecuteCaseResult[]) => {
  if (!results.length) return ''

  return results
    .map((result, index) => {
      const stdout = toDisplayText(result.stdout).trim()
      const stderr = toDisplayText(result.stderr).trim()
      const error = toDisplayText(result.error).trim()
      const actual = toDisplayText(result.actual).trim()

      const blocks = [stdout, actual, stderr, error].filter((block) => block.length)
      if (!blocks.length) return null

      const prefix = results.length > 1 ? `#${index + 1}\n` : ''
      return `${prefix}${blocks.join('\n')}`
    })
    .filter(Boolean)
    .join('\n\n')
}

const formatFailedOutput = (result?: ExecuteCaseResult) => {
  if (!result) return null
  return result.actual ?? result.stdout ?? result.stderr ?? result.error ?? null
}

const useTask = (id: string): UseTaskData => {
  const t = useTranslations('task')
  const locale = useLocale()
  const queryClient = useQueryClient()
  const activeSinceRef = React.useRef<number | null>(null)
  const activeSecondsRef = React.useRef<number>(0)

  const pauseActiveTimer = React.useCallback(() => {
    const startedAt = activeSinceRef.current
    if (!startedAt) return

    const elapsed = Math.max(0, Math.round((Date.now() - startedAt) / 1000))
    activeSecondsRef.current += elapsed
    activeSinceRef.current = null
  }, [])

  const resumeActiveTimer = React.useCallback(() => {
    if (activeSinceRef.current !== null) return
    activeSinceRef.current = Date.now()
  }, [])

  const updateSprintStatus = React.useCallback(
    (nextStatus: SprintTaskStatus) => {
      queryClient.setQueriesData<SprintCacheData>({ queryKey: ['sprint'] }, (prev) => {
        if (!prev) return prev
        let changed = false
        const tasks = prev.tasks.map((task) => {
          if (task.id !== id) return task
          if (task.status === nextStatus) return task
          changed = true
          return { ...task, status: nextStatus }
        })

        return changed ? { ...prev, tasks } : prev
      })

      queryClient.setQueriesData<MissionsCacheData>({ queryKey: ['missions'] }, (prev) => {
        if (!prev) return prev
        let changed = false
        const missions = prev.map((mission) => {
          if (mission.id !== id) return mission
          if (mission.status === nextStatus) return mission
          changed = true
          return { ...mission, status: nextStatus }
        })

        return changed ? missions : prev
      })
    },
    [id, queryClient]
  )

  const { data, isError } = useQuery({
    queryKey: ['task', id],
    queryFn: () => fetchTask(id),
    enabled: Boolean(id),
  })

  React.useEffect(() => {
    if (!data) return

    const nextStatus: SprintTaskStatus =
      data.status === 'DONE' ? 'done' : data.status === 'IN_PROGRESS' ? 'inProgress' : 'todo'

    if (nextStatus !== 'todo') {
      updateSprintStatus(nextStatus)
    }

    void Promise.all([
      queryClient.invalidateQueries({ queryKey: ['modules'] }),
      queryClient.invalidateQueries({ queryKey: ['module'] }),
      queryClient.invalidateQueries({ queryKey: ['sprint'] }),
    ])
  }, [data, id, queryClient, updateSprintStatus])

  const task = data?.task
  const editor = data?.editor
  const publicTests = data?.publicTests
  const totalTestsCount = data?.totalTestsCount ?? 0

  const [code, setCode] = React.useState('')
  const [consoleValue, setConsoleValue] = React.useState('')
  const [results, setResults] = React.useState<TestResultsData>({ status: 'pending', tests: [] })
  const [aiReviewRemaining, setAiReviewRemaining] = React.useState<number | null>(null)
  const [aiReviewLimit, setAiReviewLimit] = React.useState<number | null>(null)
  const [submitScore, setSubmitScore] = React.useState<SubmitScore | null>(null)

  const aiReviewVisible = Boolean(data?.aiReviewEnabled ?? data?.missionType === 'TASK')
  const aiReviewDisabled = Boolean(aiReviewVisible && aiReviewRemaining === 0)

  React.useEffect(() => {
    if (!data) return

    setCode(data.userCode ?? data.patternCode ?? '')
    setConsoleValue('')
    setResults({ status: 'pending', tests: [] })
    setSubmitScore(null)
    setAiReviewRemaining(data.aiReviewRemaining ?? null)
    setAiReviewLimit(data.aiReviewLimit ?? null)
  }, [data, id])

  React.useEffect(() => {
    activeSecondsRef.current = 0
    activeSinceRef.current = null

    if (!data || data.status === 'DONE') {
      return
    }

    resumeActiveTimer()
  }, [data, id, resumeActiveTimer])

  React.useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        pauseActiveTimer()
      } else {
        resumeActiveTimer()
      }
    }

    window.addEventListener('focus', resumeActiveTimer)
    window.addEventListener('blur', pauseActiveTimer)
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      pauseActiveTimer()
      window.removeEventListener('focus', resumeActiveTimer)
      window.removeEventListener('blur', pauseActiveTimer)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [pauseActiveTimer, resumeActiveTimer])

  const runMutation = useMutation({
    mutationKey: ['taskExecute', id, 'run'],
    mutationFn: (source: string) => executeTask(id, { source, mode: 'runCode' }),
  })

  const testMutation = useMutation({
    mutationKey: ['taskExecute', id, 'test'],
    mutationFn: (source: string) => executeTask(id, { source, mode: 'fullTest' }),
  })

  const saveMutation = useMutation({
    mutationFn: (userCode: string) => saveTask(id, userCode),
    onSuccess: async (_data, userCode) => {
      queryClient.setQueryData(['task', id], (prev: TaskApiResponse | undefined) => {
        if (!prev) return prev
        return { ...prev, userCode }
      })

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['missions'] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
        queryClient.invalidateQueries({ queryKey: ['modules'] }),
        queryClient.invalidateQueries({ queryKey: ['module'] }),
        queryClient.invalidateQueries({ queryKey: ['sprint'] }),
      ])
    },
  })

  const submitMutation = useMutation({
    mutationKey: ['taskExecute', id, 'submit'],
    mutationFn: ({ source, timeSpentSeconds }: { source: string; timeSpentSeconds?: number }) =>
      executeTask(id, {
        source,
        mode: 'completeTask',
        timeSpentSeconds,
        sessionId: getSessionId() ?? undefined,
      }),
    onSuccess: async (response) => {
      if (response.mode === 'completeTask') {
        updateSprintStatus(response.isTaskPassed ? 'done' : 'inProgress')
      }

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['missions'] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
        queryClient.invalidateQueries({ queryKey: ['user'] }),
        queryClient.invalidateQueries({ queryKey: ['userStats'] }),
        queryClient.invalidateQueries({ queryKey: ['modules'] }),
        queryClient.invalidateQueries({ queryKey: ['module'] }),
        queryClient.invalidateQueries({ queryKey: ['sprint'] }),
      ])
    },
  })

  const aiReviewMutation = useMutation({
    mutationFn: (source: string) => reviewTask(id, source, locale),
  })

  const formatAiReview = React.useCallback(
    (review: AiReviewResponse) => {
      const blocks: string[] = [`${t('aiReview.labels.grade')}: ${review.grade}`]

      if (review.summary) {
        blocks.push(`${t('aiReview.labels.summary')}: ${review.summary}`)
      }

      if (review.strengths.length) {
        blocks.push(`${t('aiReview.labels.strengths')}:\n- ${review.strengths.join('\n- ')}`)
      }

      if (review.improvements.length) {
        blocks.push(`${t('aiReview.labels.improvements')}:\n- ${review.improvements.join('\n- ')}`)
      }

      if (review.nextSteps.length) {
        blocks.push(`${t('aiReview.labels.nextSteps')}:\n- ${review.nextSteps.join('\n- ')}`)
      }

      if (Number.isFinite(review.remaining) && Number.isFinite(review.limit)) {
        blocks.push(`${t('aiReview.labels.remaining')}: ${review.remaining}/${review.limit}`)
      }

      return blocks.join('\n\n')
    },
    [t]
  )

  const onRun = () => {
    if (!task) return

    setConsoleValue(t('console.running'))

    void runMutation
      .mutateAsync(code)
      .then((data) => {
        if (data.mode !== 'runCode') return
        const output = formatConsoleFromRun(data.results)
        setConsoleValue([t('console.done'), output].filter(Boolean).join('\n'))
      })
      .catch(() => {
        setConsoleValue(t('console.error', { message: 'Nie udało się uruchomić kodu.' }))
      })
  }

  const onTest = () => {
    if (!task || !publicTests) return

    setResults((prev) => ({ ...prev, status: 'pending' }))
    setConsoleValue(t('console.testing'))

    void testMutation
      .mutateAsync(code)
      .then((data) => {
        if (data.mode !== 'fullTest') return
        const visibleResults = data.results.slice(0, publicTests.cases.length)

        const tests = publicTests.cases.map((testCase, index) => {
          const result = visibleResults[index]
          const passed = Boolean(result?.passed)
          return {
            id: testCase.id,
            title: `Test ${index + 1}`,
            status: passed ? ('passed' as const) : ('failed' as const),
            input: testCase.input,
            expected: testCase.output,
            output: passed ? undefined : formatFailedOutput(result),
          }
        })

        const allPassed = tests.length > 0 && tests.every((test) => test.status === 'passed')
        setResults({ status: allPassed ? 'passed' : 'failed', tests })

        const passedCount = tests.filter((test) => test.status === 'passed').length
        setConsoleValue(`${t('console.done')}\nZaliczone testy: ${passedCount}/${tests.length}.`)
      })
      .catch(() => {
        setResults((prev) => ({ ...prev, status: 'failed' }))
        setConsoleValue(t('console.error', { message: 'Nie udało się uruchomić testów.' }))
      })
  }

  const onSave = () => {
    setConsoleValue(t('console.saving'))

    void saveMutation
      .mutateAsync(code)
      .then(() => {
        setConsoleValue(`${t('console.done')}\n${t('toast.saveSuccess')}`)
        toast.success(t('toast.saveSuccess'))
      })
      .catch(() => {
        setConsoleValue(t('console.error', { message: t('toast.saveFailed') }))
        toast.error(t('toast.saveFailed'))
      })
  }

  const onReset = () => {
    const nextCode = data?.patternCode ?? ''
    setCode(nextCode)

    setConsoleValue(t('console.saving'))

    void saveMutation
      .mutateAsync(nextCode)
      .then(() => {
        setConsoleValue(`${t('console.done')}\n${t('toast.saveSuccess')}`)
        toast.success(t('toast.saveSuccess'))
      })
      .catch(() => {
        setConsoleValue(t('console.error', { message: t('toast.saveFailed') }))
        toast.error(t('toast.saveFailed'))
      })
  }

  const onSubmit = () => {
    setConsoleValue(t('console.submitting'))

    const timeSpentSeconds =
      activeSecondsRef.current +
      (activeSinceRef.current ? Math.max(1, Math.round((Date.now() - activeSinceRef.current) / 1000)) : 0)

    const timeSpentPayload = timeSpentSeconds > 0 ? timeSpentSeconds : undefined

    void submitMutation
      .mutateAsync({ source: code, timeSpentSeconds: timeSpentPayload })
      .then((data) => {
      if (data.mode !== 'completeTask') return

      setConsoleValue(t('console.done'))
      setSubmitScore({
        passed: data.passedCount,
        total: data.totalCount || totalTestsCount,
        isPassed: data.isTaskPassed,
        xpAwarded: data.xpAwarded ?? 0,
        timeSpentSeconds: data.timeSpentSeconds ?? null,
        testAttemptsCount: Number.isFinite(data.testAttemptsCount) ? data.testAttemptsCount : null,
      })
        if (data.isTaskPassed) {
          toast.success(t('toast.submitSuccess'))
        } else {
          toast.error(t('toast.submitFailed'))
        }
      })
      .catch(() => {
        setConsoleValue(t('console.error', { message: 'Nie udało się wysłać rozwiązania.' }))
      })
  }

  const onAiReview = () => {
    if (!aiReviewVisible) {
      const message = t('toast.aiReviewNotAvailable')
      setConsoleValue(t('console.error', { message }))
      toast.error(message)
      return
    }

    if (aiReviewDisabled) {
      const message = t('toast.aiReviewLimit')
      setConsoleValue(t('console.error', { message }))
      toast.error(message)
      return
    }

    if (!code.trim().length) {
      const message = t('toast.aiReviewEmpty')
      setConsoleValue(t('console.error', { message }))
      toast.error(message)
      return
    }

    setConsoleValue(t('console.aiReviewing'))

    void aiReviewMutation
      .mutateAsync(code)
      .then(async (review) => {
        setConsoleValue(formatAiReview(review))
        setAiReviewRemaining(review.remaining)
        setAiReviewLimit(review.limit)

        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
          queryClient.invalidateQueries({ queryKey: ['user'] }),
          queryClient.invalidateQueries({ queryKey: ['userStats'] }),
          queryClient.invalidateQueries({ queryKey: ['ranking'] }),
        ])
      })
      .catch((error: Error & { status?: number; remaining?: number; limit?: number }) => {
        const status = error.status

        if (status === 429) {
          setAiReviewRemaining(0)
          setAiReviewLimit(error.limit ?? aiReviewLimit)
        }

        const message =
          status === 429
            ? t('toast.aiReviewLimit')
            : status === 403
              ? t('toast.aiReviewNotAvailable')
              : t('toast.aiReviewFailed')

        setConsoleValue(t('console.error', { message }))
        toast.error(message)
      })
  }

  const runLoading = runMutation.isPending
  const testLoading = testMutation.isPending
  const saveLoading = saveMutation.isPending
  const submitLoading = submitMutation.isPending
  const aiLoading = aiReviewMutation.isPending

  const submitDisabled = Boolean(submitLoading || !code.trim().length)
  const submitPercent = submitScore ? scoreToPercent(submitScore) : 0
  const submitModalMessage = submitScore
    ? t('submitModal.message', { status: submitScore.isPassed ? 'passed' : 'failed' })
    : ''
  const submitStats = submitScore
    ? {
        timeSpentSeconds: submitScore.timeSpentSeconds ?? null,
        attemptsCount: submitScore.testAttemptsCount ?? null,
        xpAwarded: submitScore.xpAwarded ?? 0,
      }
    : null

  return {
    errorLabel: t('error'),
    isError,
    task,
    editor,
    publicTests,
    code,
    onCodeChange: setCode,
    consoleValue,
    results,
    runLoading,
    testLoading,
    saveLoading,
    submitLoading,
    aiLoading,
    aiReviewVisible,
    aiReviewDisabled,
    aiReviewRemaining,
    aiReviewLimit,
    submitDisabled,
    onRun,
    onTest,
    onSave,
    onReset,
    onSubmit,
    onAiReview,
    submitModalOpen: Boolean(submitScore),
    submitPercent,
    submitModalMessage,
    submitStats,
    closeSubmitModal: () => setSubmitScore(null),
    saveLabel: t('actions.save'),
    resetLabel: t('actions.reset'),
  }
}

export default useTask
