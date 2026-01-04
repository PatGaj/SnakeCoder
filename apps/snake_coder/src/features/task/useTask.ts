'use client'

import React from 'react'
import { useTranslations } from 'next-intl'

import type { CodeEditorData, PublicTestsData, TaskDescriptionData, TestResultsData } from './components'

export type UseTaskData = {
  task: TaskDescriptionData
  editor: CodeEditorData
  publicTests: PublicTestsData
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
  onSubmit: () => void
  onAiReview: () => void
  submitModalOpen: boolean
  submitPercent: number
  submitModalMessage: string
  closeSubmitModal: () => void
  saveLabel: string
}

type SubmitScore = {
  passed: number
  total: number
}

const scoreToPercent = (score: SubmitScore) => (score.total > 0 ? Math.round((score.passed / score.total) * 100) : 0)

const useTask = (id: string): UseTaskData => {
  const t = useTranslations('task')

  const task: TaskDescriptionData = {
    title: 'Powiel znaki w tekście',
    description:
      'Napisz funkcję `solve(text)`, która zwraca tekst, w którym każdy znak jest powtórzony (np. "ab" → "aabb").',
    requirements: [
      'Zachowaj kolejność znaków.',
      'Nie modyfikuj wejścia — zwróć nowy string.',
      'Nie używaj bibliotek zewnętrznych.',
    ],
    hint: 'Najprościej: zbuduj wynik, doklejając do niego każdy znak dwa razy (np. przez join).',
  }

  const editor: CodeEditorData = {
    language: 'python',
  }

  const initialCode = `"""Zadanie:
Zaimplementuj funkcję solve(text), która zwraca tekst,
w którym każdy znak jest powtórzony.

Przykład:
solve("ab") -> "aabb"
"""


def solve(text: str) -> str:
    return ""


if __name__ == "__main__":
    print(solve(input().rstrip("\\n")))
`

  const publicTests: PublicTestsData = React.useMemo(
    () => ({
      cases: [
        { id: `${id}-public-1`, input: 'hellow', output: 'hheellllooww' },
        { id: `${id}-public-2`, input: 'world', output: 'wwoorrlldd' },
      ],
    }),
    [id]
  )

  const initialResults: TestResultsData = React.useMemo(
    () => ({
      status: 'failed',
      tests: [
        { id: `${id}-test-1`, title: 'Test 1', status: 'passed', input: 'hellow', expected: 'hheellllooww' },
        {
          id: `${id}-test-2`,
          title: 'Test 2',
          status: 'failed',
          input: 'world',
          expected: 'wwoorrlldd',
          output: 'world',
        },
      ],
    }),
    [id]
  )

  const [code, setCode] = React.useState(initialCode)
  const [consoleValue, setConsoleValue] = React.useState('')
  const [results, setResults] = React.useState<TestResultsData>(initialResults)
  const [runLoading, setRunLoading] = React.useState(false)
  const [testLoading, setTestLoading] = React.useState(false)
  const [saveLoading, setSaveLoading] = React.useState(false)
  const [submitLoading, setSubmitLoading] = React.useState(false)
  const [aiLoading, setAiLoading] = React.useState(false)
  const [submitScore, setSubmitScore] = React.useState<SubmitScore | null>(null)

  React.useEffect(() => {
    setCode(initialCode)
    setConsoleValue('')
    setResults(initialResults)
    setSubmitScore(null)
    setRunLoading(false)
    setTestLoading(false)
    setSaveLoading(false)
    setSubmitLoading(false)
    setAiLoading(false)
  }, [id, initialCode, initialResults])

  const onRun = () => {
    setRunLoading(true)
    setConsoleValue(t('console.running'))

    window.setTimeout(() => {
      setConsoleValue(`${t('console.done')}\nWynik:\nssnnaakkee`)
      setRunLoading(false)
    }, 700)
  }

  const onTest = () => {
    setTestLoading(true)
    setResults((prev) => ({ ...prev, status: 'pending' }))
    setConsoleValue(t('console.testing'))

    window.setTimeout(() => {
      const looksSolved = !/(return\\s+['"]{2})/.test(code)

      setResults(
        looksSolved
          ? {
              status: 'passed',
              tests: [
                { id: `${id}-test-1`, title: 'Test 1', status: 'passed', input: 'hellow', expected: 'hheellllooww' },
                { id: `${id}-test-2`, title: 'Test 2', status: 'passed', input: 'world', expected: 'wwoorrlldd' },
              ],
            }
          : initialResults
      )

      setConsoleValue(`${t('console.done')}\nZaliczone testy: ${looksSolved ? '2/2' : '1/2'}.`)
      setTestLoading(false)
    }, 850)
  }

  const onSave = () => {
    setSaveLoading(true)
    setConsoleValue(t('console.saving'))

    window.setTimeout(() => {
      setConsoleValue(`${t('console.done')}\n${t('toast.saveSuccess')}`)
      setSaveLoading(false)
    }, 600)
  }

  const onSubmit = () => {
    if (results.status !== 'passed') {
      setConsoleValue(t('console.error', { message: t('toast.submitFailed') }))
      return
    }

    setSubmitLoading(true)
    setConsoleValue(t('console.submitting'))

    window.setTimeout(() => {
      setConsoleValue(t('console.done'))
      const usesFor = /\bfor\b/.test(code)
      setSubmitScore({ passed: usesFor ? 6 : 8, total: 8 })
      setSubmitLoading(false)
    }, 900)
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

  const submitDisabled = Boolean(submitLoading || results.status !== 'passed')
  const submitPercent = submitScore ? scoreToPercent(submitScore) : 0
  const submitModalMessage = submitScore
    ? t('submitModal.message', { status: submitScore.passed === submitScore.total ? 'passed' : 'failed' })
    : ''

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
    submitDisabled,
    onRun,
    onTest,
    onSave,
    onSubmit,
    onAiReview,
    submitModalOpen: Boolean(submitScore),
    submitPercent,
    submitModalMessage,
    closeSubmitModal: () => setSubmitScore(null),
    saveLabel: t('actions.save'),
  }
}

export default useTask
