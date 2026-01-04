'use client'

import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import { RiMedalLine, RiTrophyFill } from 'react-icons/ri'

import { Avatar, Badge, Box, Separator } from '@/components'

import type { RankingUser } from './rankingTypes'

export type ChampionsTableProps = {
  champions: RankingUser[]
}

const ICON_BY_RANK = {
  1: RiTrophyFill,
  2: RiMedalLine,
  3: RiMedalLine,
} as const

const ROW_STYLE_BY_RANK = {
  1: 'border-secondary-400/30 bg-gradient-to-r from-secondary-500/22 via-primary-950/75 to-primary-950/75 hover:from-secondary-500/28 hover:via-primary-950/78',
  2: 'border-snowWhite-50/18 bg-gradient-to-r from-snowWhite-50/10 via-primary-950/75 to-primary-950/75 hover:from-snowWhite-50/12 hover:via-primary-950/78',
  3: 'border-mangoYellow-400/22 bg-gradient-to-r from-mangoYellow-500/18 via-primary-950/75 to-primary-950/75 hover:from-mangoYellow-500/22 hover:via-primary-950/78',
} as const

const ChampionsTable: React.FC<ChampionsTableProps> = ({ champions }) => {
  const t = useTranslations('ranking')

  return (
    <Box variant="glass" size="xl" round="3xl" className="w-full border-primary-800/70">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary-300">{t('tiers.champions')}</p>
        <Badge variant="secondary" size="sm" className="px-3 py-1">
          1–3
        </Badge>
      </div>

      <Separator className="my-5 bg-primary-800/70" />

      <div className="overflow-x-auto rounded-lg border border-primary-800/80 shadow-[0_18px_42px_#00000084]">
        <table className="min-w-full divide-y divide-primary-800/70 bg-primary-950/80 text-sm text-snowWhite-50">
          <thead className="bg-primary-900/60">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-snowWhite-300 whitespace-nowrap">
                {t('columns.rank')}
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-snowWhite-300 whitespace-nowrap">
                {t('columns.user')}
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-snowWhite-300 whitespace-nowrap">
                {t('columns.xp')}
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-snowWhite-300 whitespace-nowrap">
                {t('columns.streak')}
              </th>
            </tr>
          </thead>
          <tbody>
            {champions.map((user) => {
              const Icon = ICON_BY_RANK[user.rank as 1 | 2 | 3] ?? RiMedalLine
              const rowClassName = ROW_STYLE_BY_RANK[user.rank as 1 | 2 | 3] ?? ROW_STYLE_BY_RANK[3]

              return (
                <tr key={user.id} className={clsx('border-b transition-colors', rowClassName)}>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="inline-flex items-center gap-2 font-semibold text-snowWhite-50">
                      <Icon
                        size={18}
                        className={clsx({
                          'text-secondary-300': user.rank === 1,
                          'text-snowWhite-200': user.rank === 2,
                          'text-mangoYellow-200': user.rank === 3,
                        })}
                      />
                      #{user.rank}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-3">
                      <Avatar
                        size="sm"
                        tone={user.rank === 1 ? 'secondary' : 'muted'}
                        userName={user.name}
                        src={user.avatarUrl}
                      />
                      <span className="min-w-0">
                        <span className="block truncate font-semibold text-snowWhite-50">{user.name}</span>
                        <span className="block text-xs text-snowWhite-300">
                          {t('row.grade', { grade: user.grade })}
                        </span>
                      </span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <span className="font-semibold text-secondary-300">{t('row.xp', { xp: user.xp })}</span>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <span className="text-snowWhite-200">{t('row.streak', { days: user.streakDays })}</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Box>
  )
}

export default ChampionsTable
