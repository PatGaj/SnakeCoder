'use client'

import { useTranslations } from 'next-intl'
import { RiFireLine, RiRobot2Line, RiStarSmileLine, RiTrophyLine } from 'react-icons/ri'

import StatTopBarItem from './StatTopBarItem'
import useStatTopBar from './useStatTopBar'

const StatTopBar = () => {
  const t = useTranslations('statTopBar')
  const { streakDays, xpGained, rank, grade, leagueName } = useStatTopBar()

  return (
    <div className="sticky top-0 z-90 w-full lg:fixed lg:right-10 lg:left-auto lg:top-0 lg:w-fit lg:px-0">
      <div className="relative w-full overflow-hidden border-b border-primary-800/70 bg-primary-950 px-3 py-3 shadow-[0_26px_70px_#00000085] lg:rounded-b-2xl lg:border-r-0 lg:border-t-0 lg:px-4">
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-1 lg:justify-start">
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
