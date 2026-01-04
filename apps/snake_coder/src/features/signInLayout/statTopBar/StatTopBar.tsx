'use client'

import { useTranslations } from 'next-intl'
import { RiFireLine, RiRobot2Line, RiStarSmileLine, RiTrophyLine } from 'react-icons/ri'

import StatTopBarItem from './StatTopBarItem'
import useStatTopBar from './useStatTopBar'

const StatTopBar = () => {
  const t = useTranslations('statTopBar')
  const { streakDays, xpGained, rank, grade, leagueName } = useStatTopBar()

  return (
    <div className="fixed right-10 top-0 z-90 max-w-155">
      <div className="relative overflow-hidden rounded-b-2xl border border-primary-800/70 border-r-0 border-t-0 bg-primary-950/70 px-4 py-3 shadow-[0_26px_70px_#00000085]">
        <div className="pointer-events-none absolute -left-12 -top-14 h-44 w-44 rounded-full bg-secondary-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -right-8 -top-10 h-44 w-44 rounded-full bg-aquaBlue-500/10 blur-3xl" />
        <div className="flex items-center gap-3">
          <StatTopBarItem
            tooltip={t('streak.tooltip')}
            label={t('streak.label')}
            value={t('streak.days', { days: streakDays })}
            icon={<RiFireLine className="text-orange-300" size={18} />}
            className="border-orange-400/25 bg-linear-to-br from-orange-500/18 to-primary-950/70"
            iconWrapperClassName="bg-orange-500/12"
          />
          <StatTopBarItem
            tooltip={t('xp.tooltip')}
            label="Rank XP"
            value={`${xpGained} XP`}
            icon={<RiStarSmileLine className="text-aquaBlue-200" size={18} />}
            className="border-aquaBlue-400/25 bg-linear-to-br from-aquaBlue-500/16 to-primary-950/70"
            iconWrapperClassName="bg-aquaBlue-500/12"
          />
          <StatTopBarItem
            tooltip={t('league.tooltip')}
            label={t('league.label')}
            value={`${leagueName} #${rank}`}
            icon={<RiTrophyLine className="text-yellow-200" size={18} />}
            className="border-yellow-400/25 bg-linear-to-br from-yellow-500/16 to-primary-950/70"
            iconWrapperClassName="bg-yellow-500/12"
          />
          <StatTopBarItem
            tooltip={t('ai.tooltip')}
            label={t('ai.label')}
            value={grade}
            icon={<RiRobot2Line className="text-secondary-300" size={18} />}
            className="border-secondary-400/20 bg-linear-to-br from-secondary-500/14 to-primary-950/70"
            iconWrapperClassName="bg-secondary-500/10"
          />
        </div>
      </div>
    </div>
  )
}

export default StatTopBar
