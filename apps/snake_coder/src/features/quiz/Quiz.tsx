'use client'

import React from 'react'
import { useTranslations } from 'next-intl'

import { useRouter } from '@/i18n/navigation'
import { QuizActionBar, QuizHeader, QuizQuestionCard, QuizResultModal } from './components'
import useQuiz from './useQuiz'

export type QuizProps = {
  id: string
}

const Quiz: React.FC<QuizProps> = ({ id }) => {
  const t = useTranslations('quiz')
  const router = useRouter()
  const { header, questions } = useQuiz(id)

  const total = questions.length
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [answers, setAnswers] = React.useState<Record<string, string | null>>({})
  const [finished, setFinished] = React.useState(false)
  const [resultOpen, setResultOpen] = React.useState(false)

  const currentQuestion = questions[currentIndex]
  const currentAnswer = currentQuestion ? (answers[currentQuestion.id] ?? null) : null

  const answeredCount = questions.reduce((acc, q) => acc + (answers[q.id] ? 1 : 0), 0)

  const score = questions.reduce((acc, q) => {
    const answer = answers[q.id]
    return acc + (answer && answer === q.correctOptionId ? 1 : 0)
  }, 0)

  const resultItems = questions.map((q) => {
    const selectedId = answers[q.id] ?? null
    const selectedLabel = q.options.find((o) => o.id === selectedId)?.label ?? null
    return {
      id: q.id,
      title: q.title,
      prompt: q.prompt,
      selectedLabel,
      isCorrect: Boolean(selectedId && selectedId === q.correctOptionId),
    }
  })

  const goPrev = () => setCurrentIndex((idx) => Math.max(0, idx - 1))
  const goNext = () => setCurrentIndex((idx) => Math.min(total - 1, idx + 1))

  const restart = () => {
    setAnswers({})
    setCurrentIndex(0)
    setFinished(false)
    setResultOpen(false)
  }

  const select = (optionId: string) => {
    if (!currentQuestion) return
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionId }))
  }

  const canGoPrev = currentIndex > 0
  const canGoNext = Boolean(currentAnswer)
  const isLast = currentIndex === total - 1

  const finishQuiz = () => {
    setFinished(true)
    setResultOpen(true)
  }

  return (
    <main className="mx-auto max-w-400 px-6 pb-6 pt-20 md:px-12 flex flex-col gap-6 lg:h-screen lg:overflow-hidden">
      <div className="flex flex-col gap-6 lg:flex-1 lg:min-h-0">
        <QuizHeader
          header={header}
          current={currentIndex + 1}
          total={total}
          answered={answeredCount}
        />

        <div className="flex flex-col gap-4 lg:flex-1 lg:min-h-0">
          <div className="lg:flex-1 lg:min-h-0">
            {currentQuestion ? (
              <QuizQuestionCard
                question={currentQuestion}
                selectedOptionId={currentAnswer}
                onSelect={select}
                locked={finished}
              />
            ) : (
              <div className="text-sm text-snowWhite-300">{t('empty')}</div>
            )}
          </div>
          <QuizActionBar
            canGoPrev={canGoPrev}
            canGoNext={canGoNext}
            isLast={isLast}
            onPrev={goPrev}
            onNext={goNext}
            onFinish={() => {
              finishQuiz()
            }}
          />
        </div>
      </div>

      <QuizResultModal
        open={resultOpen}
        onClose={() => router.push('/missions')}
        score={score}
        total={total}
        passPercent={header.passPercent}
        items={resultItems}
        onRestart={restart}
      />
    </main>
  )
}

export default Quiz
