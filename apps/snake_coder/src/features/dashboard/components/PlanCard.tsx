import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { RiBookOpenLine, RiFlagLine, RiTestTubeLine } from 'react-icons/ri'
import { useQueryClient } from '@tanstack/react-query'

import { Badge, Box, Button, ItemRow, Separator } from '@/components'

export type PlanCardData = {
  bonusXp: number
  complete: boolean
  bonusClaimed: boolean
  tasksDone: number
  tasksTotal: number
  articleDone: boolean
  quizPercent: number
  quizOk: boolean
  showTasks: boolean
  showArticle: boolean
  showQuiz: boolean
}

export type PlanCardProps = {
  plan: PlanCardData
}

const PlanCard: React.FC<PlanCardProps> = ({ plan }) => {
  const t = useTranslations('dashboard')
  const queryClient = useQueryClient()
  const [claiming, setClaiming] = useState(false)

  const handleClaimBonus = async () => {
    if (!plan.complete || plan.bonusClaimed || claiming) return
    setClaiming(true)
    try {
      const response = await fetch('/api/dashboard/plan/claim', { method: 'POST' })
      if (!response.ok) {
        throw new Error('Failed to claim bonus')
      }
      await queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      await queryClient.invalidateQueries({ queryKey: ['userStats'] })
    } finally {
      setClaiming(false)
    }
  }

  return (
    <Box variant="outline" size="lg" round="2xl" className="w-full border-primary-800 text-snowWhite-100">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary-300">{t('sections.plan')}</p>
          <p className="mt-2 text-sm text-snowWhite-300">{t('plan.desc')}</p>
        </div>
        <Badge variant={plan.complete ? 'success' : 'muted'} className="px-3 py-1">
          +{plan.bonusXp} XP
        </Badge>
      </div>

      <Separator className="my-4" />

      <div className="grid gap-2">
        {plan.showTasks && (
          <ItemRow
            icon={<RiFlagLine className="text-secondary-400" size={18} />}
            label={t('plan.items.tasks')}
            right={
              <Badge
                variant={plan.tasksDone >= plan.tasksTotal ? 'success' : 'muted'}
                className="px-2 py-0.5 whitespace-nowrap"
              >
                {plan.tasksDone}/{plan.tasksTotal}
              </Badge>
            }
          />
        )}

        {plan.showArticle && (
          <ItemRow
            icon={<RiBookOpenLine className="text-secondary-400" size={18} />}
            label={t('plan.items.article')}
            right={
              <Badge variant={plan.articleDone ? 'success' : 'muted'} className="px-2 py-0.5 whitespace-nowrap">
                {plan.articleDone ? t('common.done') : t('common.todo')}
              </Badge>
            }
          />
        )}

        {plan.showQuiz && (
          <ItemRow
            icon={<RiTestTubeLine className="text-secondary-400" size={18} />}
            label={t('plan.items.quiz')}
            right={
              <Badge variant={plan.quizOk ? 'success' : 'muted'} className="px-2 py-0.5 whitespace-nowrap">
                {plan.quizPercent}%
              </Badge>
            }
          />
        )}
      </div>

      <p className="mt-4 text-xs text-snowWhite-300">
        {plan.complete ? (plan.bonusClaimed ? t('plan.bonusClaimed') : t('plan.bonusReady')) : t('plan.bonusHint')}
      </p>
      {plan.complete && (
        <Button
          variant="gradient"
          size="sm"
          round="lg"
          className="mt-4 w-full sm:w-auto"
          onClick={handleClaimBonus}
          loading={claiming}
          disabled={plan.bonusClaimed}
        >
          {plan.bonusClaimed ? t('plan.bonusClaimed') : t('plan.claimBonus')}
        </Button>
      )}
    </Box>
  )
}

export default PlanCard
