import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import { RiArrowRightSLine, RiLightbulbFlashLine } from 'react-icons/ri'

import { Box, Separator } from '@/components'

export type TaskDescriptionData = {
  title: string
  description: string
  requirements: string[]
  hint?: string
}

export type TaskDescriptionProps = {
  task: TaskDescriptionData
  className?: string
}

const TaskDescription: React.FC<TaskDescriptionProps> = ({ task, className }) => {
  const t = useTranslations('task')

  return (
    <Box variant="glass" size="xl" round="3xl" className={clsx('w-full border-primary-800/70', className)}>
      <div className="space-y-5">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary-300">
          {t('sections.description')}
        </p>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-snowWhite-50">{task.title}</h2>
          <p className="text-sm text-snowWhite-300 md:text-base">{task.description}</p>
        </div>

        <Separator className="bg-primary-800/70" />

        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary-300">
            {t('sections.requirements')}
          </p>
          <ul className="space-y-2">
            {task.requirements.map((requirement) => (
              <li key={requirement} className="flex items-start gap-2 text-sm text-snowWhite-200">
                <RiArrowRightSLine className="mt-0.5 text-secondary-300" size={18} />
                <span className="min-w-0">{requirement}</span>
              </li>
            ))}
          </ul>
        </div>

        {task.hint && (
          <>
            <Separator className="bg-primary-800/70" />
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary-300">
                {t('sections.hint')}
              </p>
              <div
                className={clsx(
                  'flex gap-3 rounded-2xl border border-primary-800/70 bg-primary-900/30 px-4 py-3 text-sm text-snowWhite-200'
                )}
              >
                <RiLightbulbFlashLine size={18} className="mt-0.5 text-secondary-300" />
                <p className="min-w-0">{task.hint}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </Box>
  )
}

export default TaskDescription
