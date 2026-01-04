import { useTranslations } from 'next-intl'
import { RiFireLine, RiRobot2Line, RiStarSmileLine } from 'react-icons/ri'

import { Box, Separator, Stat } from '@/components'

export type ProfileStatsData = {
  xpTotal: number
  bestStreakDays: number
  gradeAvg: string
}

export type ProfileStatsCardProps = {
  stats: ProfileStatsData
}

const ProfileStatsCard: React.FC<ProfileStatsCardProps> = ({ stats }) => {
  const t = useTranslations('profile')

  return (
    <Box variant="glass" size="lg" round="2xl" className="relative w-full overflow-hidden border-primary-800/70">
      <div className="pointer-events-none absolute -right-14 -top-14 h-56 w-56 rounded-full bg-aquaBlue-500/12 blur-3xl" />
      <div className="pointer-events-none absolute -left-10 -bottom-16 h-56 w-56 rounded-full bg-secondary-500/10 blur-3xl" />

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary-300">{t('sections.stats')}</p>
        <p className="mt-2 text-sm text-snowWhite-300">{t('stats.subtitle')}</p>
      </div>

      <Separator className="my-4 bg-primary-800/70" />

      <div className="grid gap-3 sm:grid-cols-2">
        <Stat
          label={
            <span className="inline-flex items-center gap-2">
              <RiFireLine className="text-orange-300" size={16} />
              {t('stats.bestStreak')}
            </span>
          }
          value={stats.bestStreakDays}
          helper={t('stats.bestStreakHint')}
          className="border-orange-400/25 bg-linear-to-br from-orange-500/14 to-primary-950/70"
        />
        <Stat
          label={
            <span className="inline-flex items-center gap-2">
              <RiStarSmileLine className="text-aquaBlue-200" size={16} />
              {t('stats.totalXp')}
            </span>
          }
          value={`${stats.xpTotal} XP`}
          helper={t('stats.totalXpHint')}
          className="border-aquaBlue-400/25 bg-linear-to-br from-aquaBlue-500/14 to-primary-950/70"
        />
        <Stat
          label={
            <span className="inline-flex items-center gap-2">
              <RiRobot2Line className="text-secondary-300" size={16} />
              {t('stats.gradeAvg')}
            </span>
          }
          value={stats.gradeAvg}
          helper={t('stats.gradeAvgHint')}
          className="border-secondary-400/20 bg-linear-to-br from-secondary-500/12 to-primary-950/70"
        />
      </div>
    </Box>
  )
}

export default ProfileStatsCard
