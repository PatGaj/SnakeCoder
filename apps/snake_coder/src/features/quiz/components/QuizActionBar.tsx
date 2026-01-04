import { useTranslations } from 'next-intl'
import { RiArrowLeftLine, RiArrowRightLine, RiFlagLine } from 'react-icons/ri'

import { Box, Button } from '@/components'

export type QuizActionBarProps = {
  canGoPrev: boolean
  canGoNext: boolean
  isLast: boolean
  onPrev: () => void
  onNext: () => void
  onFinish: () => void
}

const QuizActionBar: React.FC<QuizActionBarProps> = ({ canGoPrev, canGoNext, isLast, onPrev, onNext, onFinish }) => {
  const t = useTranslations('quiz')

  return (
    <Box
      variant="glass"
      size="md"
      round="3xl"
      className="w-full border-primary-800/70 flex flex-col gap-3 md:flex-row"
    >
      <Button
        variant="ghost"
        round="lg"
        className="w-full md:flex-1"
        leftIcon={<RiArrowLeftLine size={18} />}
        onClick={onPrev}
        type="button"
        disabled={!canGoPrev}
      >
        {t('actions.prev')}
      </Button>

      {!isLast ? (
        <Button
          variant="primary"
          round="lg"
          className="w-full md:flex-1"
          rightIcon={<RiArrowRightLine size={18} />}
          onClick={onNext}
          type="button"
          disabled={!canGoNext}
        >
          {t('actions.next')}
        </Button>
      ) : (
        <Button
          variant="gradient"
          round="lg"
          className="w-full md:flex-1"
          rightIcon={<RiFlagLine size={18} />}
          onClick={onFinish}
          type="button"
          disabled={!canGoNext}
        >
          {t('actions.finish')}
        </Button>
      )}
    </Box>
  )
}

export default QuizActionBar
