import { useTranslations } from 'next-intl'
import { RiPlayLine, RiRobot2Line, RiSendPlaneLine } from 'react-icons/ri'

import { Box, Button } from '@/components'

export type TaskActionBarProps = {
  onRun: () => void
  onSubmit: () => void
  onAiReview: () => void
  runLoading?: boolean
  submitLoading?: boolean
  aiLoading?: boolean
  submitDisabled?: boolean
}

const TaskActionBar: React.FC<TaskActionBarProps> = ({
  onRun,
  onSubmit,
  onAiReview,
  runLoading,
  submitLoading,
  aiLoading,
  submitDisabled,
}) => {
  const t = useTranslations('task')

  return (
    <Box
      variant="glass"
      size="md"
      round="3xl"
      className="w-full border-primary-800/70 flex flex-col gap-3 md:flex-row"
    >
      <Button
        variant="primary"
        round="lg"
        leftIcon={<RiPlayLine size={18} />}
        className="w-full md:flex-1"
        loading={runLoading}
        onClick={onRun}
        type="button"
      >
        {t('actions.run')}
      </Button>
      <Button
        variant="gradient"
        round="lg"
        leftIcon={<RiSendPlaneLine size={18} />}
        className="w-full md:flex-1"
        loading={submitLoading}
        disabled={Boolean(submitDisabled || submitLoading)}
        onClick={onSubmit}
        type="button"
      >
        {t('actions.submit')}
      </Button>
      <Button
        variant="muted"
        round="lg"
        leftIcon={<RiRobot2Line size={18} />}
        className="w-full md:flex-1"
        loading={aiLoading}
        onClick={onAiReview}
        type="button"
      >
        {t('actions.aiReview')}
      </Button>
    </Box>
  )
}

export default TaskActionBar
