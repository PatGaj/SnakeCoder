'use client'

import React from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useLocale, useTranslations } from 'next-intl'
import toast from 'react-hot-toast'

import { getSessionId } from '@/lib/analytics'

import type { CodeEditorData, PublicTestsData, TaskDescriptionData, TestResultsData } from './components'
import type { ExecuteMode } from './types'
import { useActiveTaskTimer, useTaskData, useTaskMutations } from './hooks'
import { formatAiReview } from './utils/aiReview'
import { invalidateAiReviewCaches } from './utils/cache'
import { formatConsoleFromRun, formatFailedOutput } from './utils/execution'

export type UseTaskData = {
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
  aiReviewRemaining: number | null
  aiReviewLimit: number | null
  aiReviewEnabled?: boolean
  missionType?: 'TASK' | 'BUGFIX'
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
}

type SubmitScore = {
  passed: number
  total: number
  isPassed: boolean
  xpAwarded: number
  timeSpentSeconds: number | null
  testAttemptsCount: number | null
}

// Converts a passed/total score into a whole-number percentage for the UI.
const scoreToPercent = (score: SubmitScore) => (score.total > 0 ? Math.round((score.passed / score.total) * 100) : 0)

const useTask = (id: string): UseTaskData => {
  const t = useTranslations('task')
  const locale = useLocale()
  const queryClient = useQueryClient()
  const { data, updateSprintStatus } = useTaskData(id)
  const { getElapsedSeconds } = useActiveTaskTimer({ id, status: data?.status })
  const { executeMutation, saveMutation, aiReviewMutation } = useTaskMutations({
    id,
    locale,
    updateSprintStatus,
  })

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
  const [executeMode, setExecuteMode] = React.useState<ExecuteMode | null>(null)

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

  const runExecute = React.useCallback(
    async (mode: ExecuteMode, payload: { source: string; timeSpentSeconds?: number; sessionId?: string }) => {
      setExecuteMode(mode)
      try {
        return await executeMutation.mutateAsync({ ...payload, mode })
      } finally {
        setExecuteMode(null)
      }
    },
    [executeMutation]
  )

  // Executes user code without grading and shows console output.
  const onRun = () => {
    if (!task) return

    setConsoleValue(t('console.running'))

    void runExecute('runCode', { source: code })
      .then((data) => {
        if (data.mode !== 'runCode') return
        const output = formatConsoleFromRun(data.results)
        setConsoleValue([t('console.done'), output].filter(Boolean).join('\n'))
      })
      .catch(() => {
        setConsoleValue(t('console.error', { message: 'Nie udało się uruchomić kodu.' }))
      })
  }

  // Runs public tests and maps executor results into UI test rows.
  const onTest = () => {
    if (!task || !publicTests) return

    setResults((prev) => ({ ...prev, status: 'pending' }))
    setConsoleValue(t('console.testing'))

    void runExecute('fullTest', { source: code })
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

  // Submits the solution for grading and shows completion stats.
  const onSubmit = () => {
    setConsoleValue(t('console.submitting'))

    const timeSpentSeconds = getElapsedSeconds()

    const timeSpentPayload = timeSpentSeconds > 0 ? timeSpentSeconds : undefined

    void runExecute('completeTask', {
      source: code,
      timeSpentSeconds: timeSpentPayload,
      sessionId: getSessionId() ?? undefined,
    })
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

  // Requests AI review if allowed; updates remaining limits and surfaces errors.
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
        setConsoleValue(formatAiReview(review, t))
        setAiReviewRemaining(review.remaining)
        setAiReviewLimit(review.limit)

        await invalidateAiReviewCaches(queryClient)
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

  const runLoading = executeMutation.isPending && executeMode === 'runCode'
  const testLoading = executeMutation.isPending && executeMode === 'fullTest'
  const saveLoading = saveMutation.isPending
  const submitLoading = executeMutation.isPending && executeMode === 'completeTask'
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
    aiReviewRemaining,
    aiReviewLimit,
    aiReviewEnabled: data?.aiReviewEnabled,
    missionType: data?.missionType,
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
  }
}

export default useTask
