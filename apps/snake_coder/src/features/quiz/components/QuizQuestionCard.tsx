import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import { RiCheckLine } from 'react-icons/ri'

import { Box, Separator } from '@/components'

export type QuizOption = {
  id: string
  label: string
}

export type QuizQuestionData = {
  id: string
  title: string
  prompt: string
  options: QuizOption[]
  correctOptionId: string
}

export type QuizQuestionCardProps = {
  question: QuizQuestionData
  selectedOptionId: string | null
  onSelect: (optionId: string) => void
  locked?: boolean
}

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'] as const

const QuizQuestionCard: React.FC<QuizQuestionCardProps> = ({ question, selectedOptionId, onSelect, locked }) => {
  const t = useTranslations('quiz')

  return (
    <Box variant="glass" size="xl" round="3xl" className="w-full border-primary-800/70 flex flex-col min-h-0">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary-300">{t('question.select')}</p>
        <h2 className="text-lg font-semibold text-snowWhite-50 md:text-xl">{question.title}</h2>
        <p className="text-sm text-snowWhite-300 md:text-base">{question.prompt}</p>
      </div>

      <Separator className="my-5 bg-primary-800/70" />

      <div className="flex-1 min-h-0 overflow-y-auto pr-1 grid gap-3 sm:grid-cols-2 scrollbar-thumb-secondary-500 scrollbar-track-primary-500 scrollbar-thin">
        {question.options.map((option, index) => {
          const letter = LETTERS[index] ?? '?'
          const selected = option.id === selectedOptionId

          return (
            <button
              key={option.id}
              type="button"
              disabled={locked}
              onClick={() => onSelect(option.id)}
              aria-pressed={selected}
              className={clsx(
                'w-full rounded-2xl border px-4 py-3 text-left transition-colors flex items-start gap-3 min-h-20 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-400/40',
                'disabled:opacity-60 disabled:cursor-not-allowed',
                selected
                  ? 'border-secondary-400/50 bg-secondary-500/10 ring-1 ring-secondary-400/20'
                  : 'border-primary-800/80 bg-primary-950/40 hover:bg-primary-900/40 hover:border-primary-700/80'
              )}
            >
              <span
                className={clsx(
                  'mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-semibold',
                  selected
                    ? 'bg-secondary-500/15 text-secondary-100 ring-1 ring-secondary-400/40'
                    : 'bg-primary-950/50 text-snowWhite-200'
                )}
              >
                {letter}
              </span>
              <span className="min-w-0 flex-1 text-sm leading-snug text-snowWhite-50">{option.label}</span>
              {selected && <RiCheckLine size={18} className="shrink-0 text-secondary-300 mt-0.5" />}
            </button>
          )
        })}
      </div>
    </Box>
  )
}

export default QuizQuestionCard
