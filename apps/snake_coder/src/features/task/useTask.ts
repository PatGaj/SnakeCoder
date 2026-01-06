'use client'

import React from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import toast from 'react-hot-toast'

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
  closeSubmitModal: () => void
  saveLabel: string
  resetLabel: string
}

type SubmitScore = { passed: number; total: number }

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
}

type ExecuteResponse = ExecuteRunResponse | ExecuteCompleteResponse

const scoreToPercent = (score: SubmitScore) => (score.total > 0 ? Math.round((score.passed / score.total) * 100) : 0)

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

const executeTask = async (id: string, payload: { source: string; mode: ExecuteMode }): Promise<ExecuteResponse> => {
  const response = await fetch(`/api/missions/task/${encodeURIComponent(id)}/execute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error('Failed to execute task')
  }

  return response.json() as Promise<ExecuteResponse>
}

const formatConsoleFromRun = (results: ExecuteCaseResult[]) => {
  if (!results.length) return ''

  return results
    .map((result, index) => {
      const stdout = result.stdout?.trim() ?? ''
      const stderr = result.stderr?.trim() ?? ''
      const error = result.error?.trim() ?? ''
      const actual = result.actual?.toString().trim() ?? ''

      const blocks = [stdout, actual, stderr, error].filter((block) => block.length)
      if (!blocks.length) return null

      const prefix = results.length > 1 ? `#${index + 1}\n` : ''
      return `${prefix}${blocks.join('\n')}`
    })
    .filter(Boolean)
    .join('\n\n')
}

const formatFailedOutput = (result?: ExecuteCaseResult) => {
  if (!result) return ''
  return (
    result.actual?.toString() ??
    result.stdout?.toString() ??
    result.stderr?.toString() ??
    result.error?.toString() ??
    ''
  )
}

const useTask = (id: string): UseTaskData => {
  const t = useTranslations('task')
  const queryClient = useQueryClient()

  const { data, isError } = useQuery({
    queryKey: ['task', id],
    queryFn: () => fetchTask(id),
    enabled: Boolean(id),
  })

  const task = data?.task
  const editor = data?.editor
  const publicTests = data?.publicTests
  const totalTestsCount = data?.totalTestsCount ?? 0

  const [code, setCode] = React.useState('')
  const [consoleValue, setConsoleValue] = React.useState('')
  const [results, setResults] = React.useState<TestResultsData>({ status: 'pending', tests: [] })
  const [aiLoading, setAiLoading] = React.useState(false)
  const [submitScore, setSubmitScore] = React.useState<SubmitScore | null>(null)

  React.useEffect(() => {
    if (!data) return

    setCode(data.userCode ?? data.patternCode ?? '')
    setConsoleValue('')
    setResults({ status: 'pending', tests: [] })
    setSubmitScore(null)
    setAiLoading(false)
  }, [data?.patternCode, id])

  const runMutation = useMutation({
    mutationFn: (source: string) => executeTask(id, { source, mode: 'runCode' }),
  })

  const testMutation = useMutation({
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
    mutationFn: (source: string) => executeTask(id, { source, mode: 'completeTask' }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['missions'] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
        queryClient.invalidateQueries({ queryKey: ['user'] }),
        queryClient.invalidateQueries({ queryKey: ['userStats'] }),
        queryClient.invalidateQueries({ queryKey: ['modules'] }),
      ])
    },
  })

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

    void submitMutation
      .mutateAsync(code)
      .then((data) => {
        if (data.mode !== 'completeTask') return

        setConsoleValue(t('console.done'))
        setSubmitScore({ passed: data.passedCount, total: data.totalCount || totalTestsCount })
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
    setAiLoading(true)
    setConsoleValue(t('console.aiReviewing'))

    window.setTimeout(() => {
      setConsoleValue(
        [
          'Ocena AI (mock): B',
          '',
          'Mocne strony:',
          '- czytelna struktura funkcji',
          '- poprawna obsługa typowych przypadków',
          '',
          'Do poprawy:',
          '- dopisz walidację wejścia (typ / None)',
          '- uprość składanie stringa (np. użyj join)',
          '',
          'Sugestia:',
          'Zadbaj o czytelne nazwy i testy edge-case.',
        ].join('\n')
      )
      setAiLoading(false)
    }, 950)
  }

  const runLoading = runMutation.isPending
  const testLoading = testMutation.isPending
  const saveLoading = saveMutation.isPending
  const submitLoading = submitMutation.isPending

  const submitDisabled = Boolean(submitLoading || !code.trim().length)
  const submitPercent = submitScore ? scoreToPercent(submitScore) : 0
  const submitModalMessage = submitScore
    ? t('submitModal.message', { status: submitScore.passed === submitScore.total ? 'passed' : 'failed' })
    : ''

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
    closeSubmitModal: () => setSubmitScore(null),
    saveLabel: t('actions.save'),
    resetLabel: t('actions.reset'),
  }
}

export default useTask
