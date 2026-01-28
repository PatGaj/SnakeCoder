import type { QuizHeaderData, QuizQuestionData, QuizResultItem } from './components'

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

type QuizSubmitPayload = { answers: Record<string, string | null>; timeSpentSeconds: number; sessionId?: string }

// Fetches quiz header + questions for a specific attempt.
export const fetchQuiz = async (id: string, attemptId: string): Promise<QuizApiResponse> => {
  const response = await fetch(
    `/api/missions/quiz/${encodeURIComponent(id)}?attempt=${encodeURIComponent(attemptId)}`,
    { method: 'GET' }
  )
  if (!response.ok) {
    throw new Error('Failed to fetch quiz')
  }
  return response.json() as Promise<QuizApiResponse>
}

// Submits quiz answers and returns result summary.
export const submitQuiz = async (id: string, payload: QuizSubmitPayload) => {
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
