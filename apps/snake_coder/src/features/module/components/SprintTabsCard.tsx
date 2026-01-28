import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import React from 'react'
import { RiArrowRightLine, RiBookOpenLine, RiFlagLine, RiLock2Line, RiTestTubeLine, RiTimerLine } from 'react-icons/ri'

import { Badge, Box, Button, Progressbar, Separator } from '@/components'

import SprintMetaBadge from './SprintMetaBadge'
import useSprintTabsCard from './useSprintTabsCard'

export type SprintCardData = {
  id: string
  sprintNo: number
  title: string
  desc: string
  etaMinutes: number
  progressPercent: number
  tasksDone: number
  tasksTotal: number
  articleDone: boolean
  articleDoneCount: number
  articleTotal: number
  quizScore: number
  quizTotal: number
  status: 'locked' | 'available' | 'inProgress' | 'done'
  route: string
}

export type SprintTabsCardProps = {
  sprints: SprintCardData[]
  onOpen: (route: string) => void
}

const SprintTabsCard: React.FC<SprintTabsCardProps> = ({ sprints, onOpen }) => {
  const t = useTranslations('module')
  const {
    active,
    setActiveId,
    tabs,
    isLocked,
    isAvailable,
    isInProgress,
    isDone,
    tasksDone,
    quizDone,
    articleDone,
  } = useSprintTabsCard(sprints)

  if (!active) return null

  return (
    <div className="w-full">
      <div className="relative">
        <div className="relative top-1 z-10 mx-4 flex max-w-full gap-0.5 overflow-x-auto px-1 pb-1 lg:left-5 lg:mx-0 lg:gap-2 lg:px-2">
          {tabs.map((tab) => {
            const showDot = tab.status === 'inProgress' || tab.status === 'done'

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveId(tab.id)}
                className={clsx(
                  'shrink-0 snap-start select-none rounded-t-lg border px-2 py-1 text-[8px] cursor-pointer font-semibold uppercase tracking-[0.14em] transition-colors',
                  'lg:rounded-t-xl lg:px-4 lg:py-2 lg:text-[11px] lg:tracking-wide',
                  {
                    'opacity-55': tab.isLocked && !tab.isActive,
                    'relative -mb-px border-primary-800/70 bg-white/5 text-snowWhite-50': tab.isActive,
                    'border-transparent bg-primary-900/25 text-snowWhite-300 hover:bg-white/5 hover:text-snowWhite-50':
                      !tab.isActive,
                  }
                )}
              >
                <span className="inline-flex items-center gap-2 whitespace-nowrap">
                  {t('sprints.sprintNo', { no: tab.sprintNo })}
                  {showDot && (
                    <span
                      className={clsx('h-1.5 w-1.5 rounded-full', {
                        'bg-secondary-400': tab.status === 'inProgress',
                        'bg-jadeGreen-400': tab.status === 'done',
                      })}
                    />
                  )}
                </span>
              </button>
            )
          })}
        </div>
        <Box variant="glass" size="xl" round="3xl" className="w-full border-primary-800/70">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                {(isDone || isInProgress) && (
                  <Badge variant={isDone ? 'success' : 'secondary'} className="px-3 py-1">
                    {t('sprints.status', { status: active.status })}
                  </Badge>
                )}
                <Badge variant="muted" className="px-3 py-1">
                  <span className="inline-flex items-center gap-2">
                    <RiTimerLine size={16} className="text-secondary-300" />
                    {t('sprints.eta', { minutes: active.etaMinutes })}
                  </span>
                </Badge>
              </div>
              <p className="text-2xl font-semibold text-snowWhite-50">{active.title}</p>
              <p className="text-sm text-snowWhite-300 md:text-base">{active.desc}</p>
            </div>
            <div className="flex w-full flex-col items-start lg:w-auto lg:items-end">
              <Button
                variant={isAvailable ? 'gradient' : isLocked ? 'muted' : 'ghost'}
                size="md"
                round="lg"
                rightIcon={isLocked ? <RiLock2Line size={18} /> : <RiArrowRightLine size={18} />}
                disabled={isLocked}
                className="w-full px-6 sm:w-auto"
                onClick={() => onOpen(active.route)}
              >
                {t('sprints.cta', { status: active.status })}
              </Button>
            </div>
          </div>
          <Separator className="my-5" />
          <div className="flex flex-wrap gap-2">
            <SprintMetaBadge done={tasksDone} todoIcon={RiFlagLine}>
              {t('sprints.meta.tasks', { done: active.tasksDone, total: active.tasksTotal })}
            </SprintMetaBadge>
            <SprintMetaBadge done={articleDone} todoIcon={RiBookOpenLine}>
              {t('sprints.meta.article', { done: active.articleDoneCount, total: active.articleTotal })}
            </SprintMetaBadge>
            <SprintMetaBadge done={quizDone} todoIcon={RiTestTubeLine}>
              {t('sprints.meta.quiz', { score: active.quizScore, total: active.quizTotal })}
            </SprintMetaBadge>
          </div>
          <div className="mt-5">
            <Progressbar value={active.progressPercent} max={100} showValue label={t('sprints.progress')} />
          </div>
        </Box>
      </div>
    </div>
  )
}

export default SprintTabsCard
