import { useTranslations } from 'next-intl'
import { RiArrowRightLine, RiTimerLine } from 'react-icons/ri'

import { Badge, Button, Modal, Separator } from '@/components'

import { ICON_BY_TASK_TYPE, type TaskCardData } from './TaskCard'

const STATUS_BADGE_VARIANT = {
  todo: 'muted',
  inProgress: 'secondary',
  done: 'success',
} as const

export type TaskModalProps = {
  task: TaskCardData | null
  open: boolean
  onClose: () => void
  onGoToTask: (route: string) => void
}

const TaskModal: React.FC<TaskModalProps> = ({ task, open, onClose, onGoToTask }) => {
  const t = useTranslations('sprint')

  if (!task) return null

  const TypeIcon = ICON_BY_TASK_TYPE[task.type]

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary-300">
            {t('task.modal.title')}
          </p>
          <p className="text-lg font-semibold text-snowWhite-50">{task.title}</p>
        </div>
      }
      footer={
        <Button
          variant="gradient"
          size="lg"
          round="lg"
          rightIcon={<RiArrowRightLine size={18} />}
          className="px-7"
          onClick={() => onGoToTask(task.route)}
        >
          {t('task.modal.goToTask')}
        </Button>
      }
    >
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant="muted" size="lg">
            <span className="inline-flex items-center gap-2">
              <TypeIcon size={16} />
              {t('task.type', { type: task.type })}
            </span>
          </Badge>
          <Badge variant={STATUS_BADGE_VARIANT[task.status]} size="lg">
            {t('task.status', { status: task.status })}
          </Badge>
          <Badge variant="secondary" size="lg">
            +{task.xp} XP
          </Badge>
          <Badge variant="muted" size="lg">
            <span className="inline-flex items-center gap-2">
              <RiTimerLine size={16} className="text-secondary-300" />
              {t('task.eta', { minutes: task.etaMinutes })}
            </span>
          </Badge>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary-300">{t('task.modal.goal')}</p>
          <p className="mt-2 text-sm text-snowWhite-200">{task.details.goal}</p>
        </div>

        <Separator />

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary-300">
            {t('task.modal.requirements')}
          </p>
          {task.details.requirements.length === 0 ? (
            <p className="mt-2 text-sm text-snowWhite-300">{t('task.modal.noRequirements')}</p>
          ) : (
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-snowWhite-200">
              {task.details.requirements.map((req) => (
                <li key={req}>{req}</li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary-300">
            {t('task.modal.hints')}
          </p>
          {task.details.hints.length === 0 ? (
            <p className="mt-2 text-sm text-snowWhite-300">{t('task.modal.noHints')}</p>
          ) : (
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-snowWhite-200">
              {task.details.hints.map((hint) => (
                <li key={hint}>{hint}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Modal>
  )
}

export default TaskModal
