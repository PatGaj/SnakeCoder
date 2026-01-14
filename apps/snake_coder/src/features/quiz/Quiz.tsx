'use client'

import { QuizActionBar, QuizHeader, QuizQuestionCard, QuizResultModal } from './components'
import useQuiz from './useQuiz'

export type QuizProps = {
  id: string
}

const Quiz: React.FC<QuizProps> = ({ id }) => {
  const {
    errorLabel,
    emptyLabel,
    header,
    total,
    currentIndex,
    answeredCount,
    timeLeftLabel,
    isTimeWarning,
    currentQuestion,
    currentAnswer,
    locked,
    canGoPrev,
    canGoNext,
    isLast,
    resultOpen,
    result,
    goPrev,
    goNext,
    select,
    finish,
    restart,
    closeResult,
    isError,
  } = useQuiz(id)

  if (!header) {
    if (isError) {
      return (
        <main className="mx-auto max-w-400 px-6 pb-6 pt-20 md:px-12">
          <div className="text-sm text-snowWhite-300">{errorLabel}</div>
        </main>
      )
    }
    return null
  }

  return (
    <main className="mx-auto max-w-400 px-6 pb-6 pt-20 md:px-12 flex flex-col gap-6 lg:h-screen lg:overflow-hidden">
      <div className="flex flex-col gap-6 lg:flex-1 lg:min-h-0">
        <QuizHeader
          header={header}
          current={currentIndex + 1}
          total={total}
          answered={answeredCount}
          timeLeftLabel={timeLeftLabel}
          isTimeWarning={isTimeWarning}
        />

        <div className="flex flex-col gap-4 lg:flex-1 lg:min-h-0">
          <div className="lg:flex-1 lg:min-h-0">
            {currentQuestion ? (
              <QuizQuestionCard
                question={currentQuestion}
                selectedOptionId={currentAnswer}
                onSelect={select}
                locked={locked}
              />
            ) : (
              <div className="text-sm text-snowWhite-300">{emptyLabel}</div>
            )}
          </div>
          <QuizActionBar
            canGoPrev={canGoPrev}
            canGoNext={canGoNext}
            isLast={isLast}
            onPrev={goPrev}
            onNext={goNext}
            onFinish={finish}
          />
        </div>
      </div>

      <QuizResultModal
        open={resultOpen && Boolean(result)}
        onClose={closeResult}
        score={result?.score ?? 0}
        total={result?.total ?? total}
        passPercent={result?.passPercent ?? header?.passPercent ?? 80}
        items={result?.items ?? []}
        onRestart={restart}
      />
    </main>
  )
}

export default Quiz
