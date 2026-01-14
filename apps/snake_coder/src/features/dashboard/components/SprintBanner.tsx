import { useTranslations } from 'next-intl'
import {
  RiArrowRightLine,
  RiBookOpenLine,
  RiFlagLine,
  RiListCheck3,
  RiTestTubeLine,
  RiTimerLine,
} from 'react-icons/ri'

import { Badge, Box, Button, ItemRow, Progressbar, Separator } from '@/components'

export type SprintBannerData = {
  module: 'PCEP' | 'PCAP' | 'BASICS'
  sprintNo: number
  etaMinutes: number
  hasActiveTask: boolean
  tasksDone: number
  tasksTotal: number
  articleDone: boolean
  quizScore: number
  quizTotal: number
  progressPercent: number
  nextTaskTitle: string
  nextTaskDesc: string
  title: string
  desc: string
  taskRoute: string
  route: string
}

export type SprintBannerProps = {
  sprint: SprintBannerData
  onContinue: () => void
  onGoToSprint: () => void
}

const SprintBanner: React.FC<SprintBannerProps> = ({ sprint, onContinue, onGoToSprint }) => {
  const t = useTranslations('dashboard')
  const taskLabel = sprint.hasActiveTask ? t('sprint.currentTaskLabel') : t('sprint.nextTaskLabel')
  const ctaLabel = sprint.hasActiveTask ? t('sprint.ctaContinueTask') : t('sprint.ctaStartTask')
  const quizPercent = sprint.quizTotal > 0 ? (sprint.quizScore / sprint.quizTotal) * 100 : 100
  const quizDone = sprint.quizTotal > 0 ? quizPercent >= 80 : true

  return (
    <Box variant="glass" size="xl" round="3xl" className="relative w-full overflow-hidden border-primary-800/70">
      <div className="pointer-events-none absolute -left-10 -top-16 h-64 w-64 rounded-full bg-secondary-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-10 -bottom-16 h-64 w-64 rounded-full bg-aquaBlue-500/10 blur-3xl" />

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="muted" className="px-3 py-1">
              {sprint.module} • Sprint {sprint.sprintNo}
            </Badge>
            <Badge variant="muted" className="px-3 py-1">
              <span className="inline-flex items-center gap-2">
                <RiTimerLine className="text-secondary-400" size={16} />
                {t('sprint.eta', { minutes: sprint.etaMinutes })}
              </span>
            </Badge>
          </div>
          <p className="text-2xl font-semibold text-snowWhite-50">{sprint.title}</p>
          <p className="max-w-3xl text-sm text-snowWhite-300 md:text-base">{sprint.desc}</p>
        </div>

        <div className="flex shrink-0 flex-col gap-2">
          <Button
            variant="gradient"
            size="lg"
            round="lg"
            rightIcon={<RiArrowRightLine size={18} />}
            className="px-7"
            onClick={onContinue}
          >
            {ctaLabel}
          </Button>
          <Button variant="ghost" size="md" round="lg" leftIcon={<RiListCheck3 size={18} />} onClick={onGoToSprint}>
            {t('sprint.goToSprint')}
          </Button>
        </div>
      </div>

      <Separator className="my-5" />

      <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="space-y-2">
          <div className="rounded-2xl border border-primary-800/70 bg-primary-950/55 px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-secondary-300">
              {taskLabel}
            </p>
            <p className="mt-1 text-sm font-semibold text-snowWhite-50">{sprint.nextTaskTitle}</p>
            <p className="mt-1 text-xs text-snowWhite-300">{sprint.nextTaskDesc}</p>
          </div>
          <Progressbar value={sprint.progressPercent} max={100} showValue label={t('sprint.progressTitle')} />
          <p className="text-xs text-snowWhite-300">
            {t('sprint.progressDesc', { tasksDone: sprint.tasksDone, tasksTotal: sprint.tasksTotal })}
          </p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
          <ItemRow
            className="w-65"
            icon={<RiFlagLine className="text-secondary-400" size={18} />}
            label={t('sprint.items.tasks')}
            right={
              <Badge variant="muted" className="px-2 py-0.5">
                {sprint.tasksDone}/{sprint.tasksTotal}
              </Badge>
            }
          />
          <ItemRow
            className="w-65"
            icon={<RiBookOpenLine className="text-secondary-400" size={18} />}
            label={t('sprint.items.article')}
            right={
              <Badge variant={sprint.articleDone ? 'success' : 'muted'} className="px-2 py-0.5">
                {sprint.articleDone ? t('common.done') : t('common.todo')}
              </Badge>
            }
          />
          <ItemRow
            className="w-65"
            icon={<RiTestTubeLine className="text-secondary-400" size={18} />}
            label={t('sprint.items.quiz')}
            right={
              <Badge variant={quizDone ? 'success' : 'muted'} className="px-2 py-0.5">
                {sprint.quizScore}/{sprint.quizTotal}
              </Badge>
            }
          />
        </div>
      </div>
    </Box>
  )
}

export default SprintBanner
