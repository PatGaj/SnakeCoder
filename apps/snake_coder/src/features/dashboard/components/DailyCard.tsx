import { useTranslations } from 'next-intl'
import { RiStarSmileLine, RiTimerLine } from 'react-icons/ri'

import { Badge, Box, Button, Separator } from '@/components'

export type DailyCardStatus = 'new' | 'done' | 'inProgress'
export type DailyCardType = 'code' | 'bugfix' | 'quiz'

export type DailyCardData = {
  title: string
  shortDesc: string
  desc: string
  type: DailyCardType
  etaMinutes: number
  rewardXp: number
  status: DailyCardStatus
  route: string
}

export type DailyCardProps = {
  daily: DailyCardData
  onStart: () => void
}

const DailyCard: React.FC<DailyCardProps> = ({ daily, onStart }) => {
  const t = useTranslations('dashboard')

  return (
    <Box
      variant="glass"
      size="lg"
      round="2xl"
      className="relative w-full overflow-hidden border border-primary-800/70 bg-primary-950/45"
    >
      <div className="pointer-events-none absolute -left-10 -top-12 h-56 w-56 rounded-full bg-secondary-500/14 blur-3xl" />
      <div className="pointer-events-none absolute -right-10 -bottom-14 h-56 w-56 rounded-full bg-aquaBlue-500/10 blur-3xl" />

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary-300">{t('daily.badge')}</p>
            <Badge variant="muted" className="px-3 py-1">
              {t(`daily.types.${daily.type}`)}
            </Badge>
          </div>
          <p className="text-xl font-semibold text-snowWhite-50">{`Daily: ${daily.title}`}</p>
          <p className="text-sm font-semibold text-snowWhite-200">{daily.shortDesc}</p>
          <p className="text-xs text-snowWhite-300">{daily.desc}</p>
        </div>
        <div className="flex flex-col items-start gap-2">
          <Badge variant="muted" className="px-3 py-1">
            <span className="inline-flex items-center gap-2">
              <RiTimerLine className="text-secondary-400" size={16} />
              {`~${daily.etaMinutes} min`}
            </span>
          </Badge>
          <Badge variant="muted" className="px-3 py-1 w-full justify-center">
            + {daily.rewardXp} XP
          </Badge>
        </div>
      </div>
      <Separator className="my-4" />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-snowWhite-200">
          <RiStarSmileLine className="text-secondary-400" size={18} />
          <span>
            {t('daily.statusLabel')}{' '}
            <span className="font-semibold text-snowWhite-50">{t(`daily.status.${daily.status}`)}</span>
          </span>
        </div>
        <Button variant="gradient" size="md" round="lg" onClick={onStart}>
          {t('daily.cta')}
        </Button>
      </div>
    </Box>
  )
}

export default DailyCard
