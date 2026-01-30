import { useTranslations } from 'next-intl'
import { RiStarLine, RiTrophyLine } from 'react-icons/ri'

import { Box, Separator } from '@/components'

import LastResultTile from './LastResultTile'

export type LastResultCardData = {
  todayXp: number
  yesterdayXp: number
  grade: string
}

export type LastResultCardProps = {
  lastResult: LastResultCardData
}

const LastResultCard: React.FC<LastResultCardProps> = ({ lastResult }) => {
  const t = useTranslations('dashboard')
  const gradeValue = lastResult.grade ? lastResult.grade : '-'

  return (
    <Box variant="glass" size="lg" round="2xl" className="relative z-0 w-full overflow-hidden border-primary-800/70">
      <div className="pointer-events-none absolute -left-10 -top-16 h-56 w-56 rounded-full bg-aquaBlue-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-10 -bottom-14 h-56 w-56 rounded-full bg-secondary-500/14 blur-3xl" />

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary-300">{t('sections.lastRun')}</p>
        <p className="mt-2 text-sm text-snowWhite-300">{t('lastRun.subtitle')}</p>
      </div>
      <Separator className="my-4" />
      <div className="grid gap-3 sm:grid-cols-2">
        <LastResultTile
          title={t('lastRun.xpToday')}
          value={`+${lastResult.todayXp || '0'} XP`}
          hint={t('lastRun.xpTodayHint', { yesterdayXp: lastResult.yesterdayXp || '0' })}
          icon={<RiTrophyLine className="text-secondary-400" size={22} />}
        />
        <LastResultTile
          title={t('lastRun.lastGrade')}
          value={gradeValue}
          hint={t('lastRun.gradeHint')}
          icon={<RiStarLine className="text-secondary-400" size={22} />}
        />
      </div>
    </Box>
  )
}

export default LastResultCard
