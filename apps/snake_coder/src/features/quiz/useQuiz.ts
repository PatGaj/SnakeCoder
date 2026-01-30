'use client'

import React from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import toast from 'react-hot-toast'

import { getSessionId } from '@/lib/analytics'
import { useRouter } from '@/i18n/navigation'
import { useCountdownTimer } from '@/hooks/useCountdownTimer'

import type { QuizHeaderData, QuizQuestionData } from './components'
import { fetchQuiz, submitQuiz, type QuizSubmitResponse } from './api'
import { createAttemptId } from './utils/attempt'
import { formatCountdown } from './utils/time'

export type UseQuizData = {
  errorLabel: string
  emptyLabel: string

  header?: QuizHeaderData
  questions: QuizQuestionData[]
  timeLimitSeconds: number
  isLoading: boolean
  isError: boolean

  currentIndex: number
  total: number
  answeredCount: number
  currentQuestion: QuizQuestionData | null
  currentAnswer: string | null

  locked: boolean
  canGoPrev: boolean
  canGoNext: boolean
  isLast: boolean

  timeLeftLabel?: string
  isTimeWarning: boolean

  resultOpen: boolean
  result: QuizSubmitResponse | null

  goPrev: () => void
  goNext: () => void
  select: (optionId: string) => void
  finish: () => void
  restart: () => void
  closeResult: () => void
}

type QuizSubmitPayload = { answers: Record<string, string | null>; timeSpentSeconds: number; sessionId?: string }

const useQuiz = (id: string): UseQuizData => {
  const t = useTranslations('quiz')
  const router = useRouter()
  const queryClient = useQueryClient()

  const [attemptId, setAttemptId] = React.useState(() => createAttemptId())

  const { data, isLoading, isError } = useQuery({
    queryKey: ['quiz', id, attemptId],
    queryFn: () => fetchQuiz(id, attemptId),
    enabled: Boolean(id),
  })

  const header = data?.header
  const questions = data?.questions ?? []
  const timeLimitSeconds = data?.timeLimitSeconds ?? 0

  const total = questions.length
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [answers, setAnswers] = React.useState<Record<string, string | null>>({})
  const [finished, setFinished] = React.useState(false)
  const [resultOpen, setResultOpen] = React.useState(false)
  const [result, setResult] = React.useState<QuizSubmitResponse | null>(null)

  const [timerResetKey, setTimerResetKey] = React.useState(0)
  const submitGuardRef = React.useRef(false)
  const prevTimeLeftSecondsRef = React.useRef<number | null>(null)

  const currentQuestion = questions[currentIndex] ?? null
  const currentAnswer = currentQuestion ? (answers[currentQuestion.id] ?? null) : null
  const answeredCount = questions.reduce((acc, q) => acc + (answers[q.id] ? 1 : 0), 0)

  // Submits quiz answers and refreshes relevant caches after success.
  const submitMutation = useMutation({
    mutationFn: (payload: QuizSubmitPayload) => submitQuiz(id, payload),
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

  const locked = finished || submitMutation.isPending
  const canGoPrev = !locked && currentIndex > 0
  const canGoNext = !locked && Boolean(currentAnswer)
  const isLast = currentIndex === total - 1

  const headerTitle = header?.title

  // Resets local state when navigating to a different quiz id.
  React.useEffect(() => {
    setCurrentIndex(0)
    setAnswers({})
    setFinished(false)
    setResultOpen(false)
    setResult(null)
    setTimerResetKey(0)
    submitGuardRef.current = false
    prevTimeLeftSecondsRef.current = null
  }, [id])

  const timerEnabled = Boolean(headerTitle) && timeLimitSeconds > 0 && !locked
  const { timeLeftSeconds, getElapsedSeconds } = useCountdownTimer({
    durationSeconds: timeLimitSeconds,
    enabled: timerEnabled,
    resetKey: timerResetKey,
  })

  // Finalizes the quiz: locks UI, submits answers, and shows results.
  const finishQuiz = React.useCallback(async () => {
    if (submitGuardRef.current || locked || !header) return

    submitGuardRef.current = true
    setFinished(true)

    const timeSpentSeconds = getElapsedSeconds()

    try {
      const data = await submitMutation.mutateAsync({
        answers,
        timeSpentSeconds,
        sessionId: getSessionId() ?? undefined,
      })
      setResult(data)
      setResultOpen(true)
    } catch {
      submitGuardRef.current = false
      setFinished(false)
      toast.error(t('toast.submitError'))
    }
  }, [answers, getElapsedSeconds, header, locked, submitMutation, t])

  // Auto-submits when the timer reaches zero.
  React.useEffect(() => {
    if (!header || locked) return
    if (timeLimitSeconds <= 0) return

    const prev = prevTimeLeftSecondsRef.current
    if (!prev || prev <= 0) return
    if (timeLeftSeconds !== 0) return

    void finishQuiz()
  }, [finishQuiz, header, locked, timeLeftSeconds, timeLimitSeconds])

  // Track previous time to detect countdown reaching zero.
  React.useEffect(() => {
    prevTimeLeftSecondsRef.current = timeLeftSeconds
  }, [timeLeftSeconds])

  const goPrev = () => setCurrentIndex((idx) => Math.max(0, idx - 1))
  const goNext = () => setCurrentIndex((idx) => Math.min(total - 1, idx + 1))

  // Records a selected option for the current question.
  const select = (optionId: string) => {
    if (!currentQuestion) return
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionId }))
  }

  // Starts a new attempt with a fresh attempt id and timer state.
  const restart = () => {
    setAttemptId(createAttemptId())
    setAnswers({})
    setCurrentIndex(0)
    setFinished(false)
    setResultOpen(false)
    setResult(null)
    submitGuardRef.current = false
    setTimerResetKey((prev) => prev + 1)
  }

  // Navigates back to missions after closing results.
  const closeResult = () => router.push('/missions')
  const finish = () => void finishQuiz()

  const timeLeftLabel = timerEnabled ? formatCountdown(timeLeftSeconds) : undefined

  return {
    errorLabel: t('error'),
    emptyLabel: t('empty'),
    header,
    questions,
    timeLimitSeconds,
    isLoading,
    isError,
    currentIndex,
    total,
    answeredCount,
    currentQuestion,
    currentAnswer,
    locked,
    canGoPrev,
    canGoNext,
    isLast,
    timeLeftLabel,
    isTimeWarning: timerEnabled && timeLeftSeconds > 0 && timeLeftSeconds <= 60,
    resultOpen,
    result,
    goPrev,
    goNext,
    select,
    finish,
    restart,
    closeResult,
  }
}

export default useQuiz
