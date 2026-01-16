import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import { RiBookOpenLine, RiBugLine, RiCodeLine, RiQuestionAnswerLine, RiTimerLine } from 'react-icons/ri'

import { Badge, Box } from '@/components'

export type SprintTaskType = 'code' | 'bugfix' | 'quiz' | 'article'

export const ICON_BY_TASK_TYPE = {
  code: RiCodeLine,
  bugfix: RiBugLine,
  quiz: RiQuestionAnswerLine,
  article: RiBookOpenLine,
}

export type TaskCardData = {
  id: string
  title: string
  shortDesc: string
  etaMinutes: number
  xp: number
  type: SprintTaskType
  status: 'todo' | 'inProgress' | 'done'
  route: string
  details: {
    goal: string
    hints: string[]
    requirements: string[]
  }
}

export type TaskCardProps = {
  task: TaskCardData
  onOpen: () => void
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onOpen }) => {
  const t = useTranslations('sprint')
  const TypeIcon = ICON_BY_TASK_TYPE[task.type]

  return (
    <button type="button" className="w-full text-left" onClick={onOpen}>
      <Box
        variant="glass"
        size="md"
        round="2xl"
        className={clsx(
          'w-full border-primary-800/70 cursor-pointer shadow-[0_8px_18px_rgba(5,12,30,0.24)] transition-shadow',
          'hover:bg-white/6 hover:shadow-[0_12px_24px_rgba(5,12,30,0.32)]',
          'px-3 py-2 lg:px-5 lg:py-4'
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-2">
            <Badge variant="muted" className="px-2 py-0.5 text-[11px] lg:px-3 lg:py-1 lg:text-xs">
              <span className="inline-flex items-center gap-2 text-snowWhite-200">
                <TypeIcon size={16} />
                {t('task.type', { type: task.type })}
              </span>
            </Badge>
            <p className="truncate text-xs font-semibold text-snowWhite-50 lg:text-sm">{task.title}</p>
            <p className="line-clamp-2 text-[11px] text-snowWhite-300 lg:text-xs">{task.shortDesc}</p>
          </div>

          <div className="shrink-0 text-right">
            <p className="text-xs font-semibold text-secondary-300 lg:text-sm">+{task.xp} XP</p>
            <p className="mt-1 inline-flex items-center gap-2 text-[11px] text-snowWhite-300 lg:text-xs">
              <RiTimerLine size={12} className="text-secondary-300 lg:size-[14px]" />
              {t('task.eta', { minutes: task.etaMinutes })}
            </p>
          </div>
        </div>
      </Box>
    </button>
  )
}

export default TaskCard
