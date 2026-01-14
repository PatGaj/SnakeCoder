'use client'

import React from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import toast from 'react-hot-toast'

import { useRouter } from '@/i18n/navigation'

import type { QuizHeaderData, QuizQuestionData, QuizResultItem } from './components'

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

export type QuizSubmitResponse = {
  score: number
  total: number
  passPercent: number
  items: QuizResultItem[]
}

type QuizApiResponse = {
  header: QuizHeaderData
  questions: QuizQuestionData[]
  timeLimitSeconds: number
}

type QuizSubmitPayload = { answers: Record<string, string | null>; timeSpentSeconds: number }

const createAttemptId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

const fetchQuiz = async (id: string, attemptId: string): Promise<QuizApiResponse> => {
  const response = await fetch(
    `/api/missions/quiz/${encodeURIComponent(id)}?attempt=${encodeURIComponent(attemptId)}`,
    { method: 'GET' }
  )
  if (!response.ok) {
    throw new Error('Failed to fetch quiz')
  }
  return response.json() as Promise<QuizApiResponse>
}

const formatCountdown = (totalSeconds: number) => {
  const safeSeconds = Math.max(0, totalSeconds)
  const minutes = Math.floor(safeSeconds / 60)
  const seconds = safeSeconds % 60
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

const submitQuiz = async (id: string, payload: QuizSubmitPayload) => {
  const response = await fetch(`/api/missions/quiz/${encodeURIComponent(id)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error('Failed to submit quiz')
  }

  return response.json() as Promise<QuizSubmitResponse>
}

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

  const [timeLeftSeconds, setTimeLeftSeconds] = React.useState(0)
  const startedAtRef = React.useRef<number | null>(null)
  const endsAtRef = React.useRef<number | null>(null)
  const [timerEpoch, setTimerEpoch] = React.useState(0)
  const [timerResetKey, setTimerResetKey] = React.useState(0)
  const submitGuardRef = React.useRef(false)
  const prevTimeLeftSecondsRef = React.useRef<number | null>(null)

  const currentQuestion = questions[currentIndex] ?? null
  const currentAnswer = currentQuestion ? (answers[currentQuestion.id] ?? null) : null
  const answeredCount = questions.reduce((acc, q) => acc + (answers[q.id] ? 1 : 0), 0)

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

  React.useEffect(() => {
    setCurrentIndex(0)
    setAnswers({})
    setFinished(false)
    setResultOpen(false)
    setResult(null)
    setTimeLeftSeconds(0)
    setTimerEpoch(0)
    setTimerResetKey(0)
    startedAtRef.current = null
    endsAtRef.current = null
    submitGuardRef.current = false
    prevTimeLeftSecondsRef.current = null
  }, [id])

  const finishQuiz = React.useCallback(async () => {
    if (submitGuardRef.current || locked || !header) return

    submitGuardRef.current = true
    setFinished(true)

    const timeSpentSeconds =
      startedAtRef.current != null ? Math.max(0, Math.round((Date.now() - startedAtRef.current) / 1000)) : 0

    try {
      const data = await submitMutation.mutateAsync({ answers, timeSpentSeconds })
      setResult(data)
      setResultOpen(true)
    } catch {
      submitGuardRef.current = false
      setFinished(false)
      toast.error(t('toast.submitError'))
    }
  }, [answers, header, locked, submitMutation, t])

  React.useEffect(() => {
    if (!headerTitle || timeLimitSeconds <= 0 || locked) return
    startedAtRef.current = Date.now()
    endsAtRef.current = startedAtRef.current + timeLimitSeconds * 1000
    setTimeLeftSeconds(timeLimitSeconds)
    setTimerEpoch((prev) => prev + 1)
  }, [headerTitle, locked, timeLimitSeconds, timerResetKey])

  React.useEffect(() => {
    if (!endsAtRef.current || locked) return

    const interval = window.setInterval(() => {
      const endMs = endsAtRef.current
      if (!endMs) return
      const next = Math.max(0, Math.ceil((endMs - Date.now()) / 1000))
      setTimeLeftSeconds(next)
    }, 1000)

    return () => window.clearInterval(interval)
  }, [locked, timerEpoch])

  React.useEffect(() => {
    if (!header || locked) return
    if (timeLimitSeconds <= 0) return

    const prev = prevTimeLeftSecondsRef.current
    if (!prev || prev <= 0) return
    if (timeLeftSeconds !== 0) return

    void finishQuiz()
  }, [finishQuiz, header, locked, timeLeftSeconds, timeLimitSeconds])

  React.useEffect(() => {
    prevTimeLeftSecondsRef.current = timeLeftSeconds
  }, [timeLeftSeconds])

  const goPrev = () => setCurrentIndex((idx) => Math.max(0, idx - 1))
  const goNext = () => setCurrentIndex((idx) => Math.min(total - 1, idx + 1))

  const select = (optionId: string) => {
    if (!currentQuestion) return
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionId }))
  }

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

  const closeResult = () => router.push('/missions')
  const finish = () => void finishQuiz()

  const timeLeftLabel = timerEpoch > 0 ? formatCountdown(timeLeftSeconds) : undefined

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
    isTimeWarning: timerEpoch > 0 && timeLeftSeconds > 0 && timeLeftSeconds <= 60,
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
