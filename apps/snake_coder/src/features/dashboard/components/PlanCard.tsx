import { useTranslations } from 'next-intl'
import { RiRobot2Line, RiStarSmileLine, RiTestTubeLine } from 'react-icons/ri'

import { Badge, Box, ItemRow, Separator } from '@/components'

import type { DailyCardStatus } from './DailyCard'

export type PlanCardData = {
  bonusXp: number
  complete: boolean
  dailyStatus: DailyCardStatus
  quizPercent: number
  quizOk: boolean
  dailyGrade: string
  dailyGradeOk: boolean
}

export type PlanCardProps = {
  plan: PlanCardData
}

const PlanCard: React.FC<PlanCardProps> = ({ plan }) => {
  const t = useTranslations('dashboard')

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
        <ItemRow
          icon={<RiStarSmileLine className="text-secondary-400" size={18} />}
          label={t('plan.items.daily')}
          right={
            <Badge variant={plan.dailyStatus === 'done' ? 'success' : 'muted'} className="px-2 py-0.5">
              {t(`daily.status.${plan.dailyStatus}`)}
            </Badge>
          }
        />

        <ItemRow
          icon={<RiTestTubeLine className="text-secondary-400" size={18} />}
          label={t('plan.items.quiz')}
          right={
            <Badge variant={plan.quizOk ? 'success' : 'muted'} className="px-2 py-0.5">
              {plan.quizPercent}%
            </Badge>
          }
        />

        <ItemRow
          icon={<RiRobot2Line className="text-secondary-400" size={18} />}
          label={t('plan.items.task')}
          right={
            <Badge variant={plan.dailyGradeOk ? 'success' : 'muted'} className="px-2 py-0.5">
              {plan.dailyGrade}
            </Badge>
          }
        />
      </div>

      <p className="mt-4 text-xs text-snowWhite-300">{plan.complete ? t('plan.bonusReady') : t('plan.bonusHint')}</p>
    </Box>
  )
}

export default PlanCard
