'use client'

import clsx from 'clsx'
import React from 'react'
import { useTranslations } from 'next-intl'

import { Avatar, Badge, Box, Pagination, Separator } from '@/components'

import type { RankingTier, RankingUser } from './rankingTypes'

export type RankingTableProps = {
  users: RankingUser[]
  perPage?: number
}

const tierByRank = (rank: number): Exclude<RankingTier, 'champions'> => {
  if (rank <= 10) return 'gold'
  if (rank <= 50) return 'silver'
  return 'bronze'
}

const ROW_STYLE_BY_TIER: Record<Exclude<RankingTier, 'champions'>, string> = {
  gold: 'border-mangoYellow-600/22 bg-gradient-to-r from-mangoYellow-500/14 via-primary-950/80 to-primary-950/80 hover:from-mangoYellow-500/18 hover:via-primary-950/84',
  silver: 'border-snowWhite-50/12 bg-gradient-to-r from-snowWhite-50/8 via-primary-950/80 to-primary-950/80 hover:from-snowWhite-50/10 hover:via-primary-950/84',
  bronze: 'border-primary-800/65 bg-gradient-to-r from-primary-900/55 via-primary-950/80 to-primary-950/80 hover:from-primary-900/65 hover:via-primary-950/84',
}

const RankingTable: React.FC<RankingTableProps> = ({ users, perPage = 7 }) => {
  const t = useTranslations('ranking')
  const [page, setPage] = React.useState(1)

  const totalPages = Math.max(1, Math.ceil(users.length / perPage))
  const safePage = Math.min(page, totalPages)
  const startIndex = (safePage - 1) * perPage
  const pageUsers = users.slice(startIndex, startIndex + perPage)

  React.useEffect(() => {
    if (page !== safePage) setPage(safePage)
  }, [page, safePage])

  return (
    <Box variant="glass" size="xl" round="3xl" className="w-full border-primary-800/70">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary-300">
            {t('tiers.gold')} • {t('tiers.silver')} • {t('tiers.bronze')}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="warning" size="sm" className="px-3 py-1">
              {t('tiers.gold')} 4–10
            </Badge>
            <Badge
              variant="muted"
              size="sm"
              className="px-3 py-1 bg-snowWhite-50/8 border-snowWhite-50/18 text-snowWhite-200"
            >
              {t('tiers.silver')} 11–50
            </Badge>
            <Badge variant="muted" size="sm" className="px-3 py-1 border-primary-700/70 bg-primary-900/55">
              {t('tiers.bronze')} 51+
            </Badge>
          </div>
        </div>
        <Badge variant="muted" size="sm" className="px-3 py-1">
          {t('meta.count', { count: users.length })}
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
            {pageUsers.map((user) => {
              const tier = tierByRank(user.rank)
              return (
                <tr key={user.id} className={clsx('border-b transition-colors', ROW_STYLE_BY_TIER[tier])}>
                  <td className="relative py-3 pl-6 pr-4 whitespace-nowrap">
                    <span
                      aria-hidden
                      className={clsx('absolute inset-y-0 left-0 w-1.5 rounded-r-full', {
                        'bg-mangoYellow-500/80': tier === 'gold',
                        'bg-snowWhite-50/30': tier === 'silver',
                        'bg-primary-700/80': tier === 'bronze',
                      })}
                    />
                    <span
                      className={clsx('font-semibold', {
                        'text-mangoYellow-200': tier === 'gold',
                        'text-snowWhite-100': tier === 'silver',
                        'text-snowWhite-50': tier === 'bronze',
                      })}
                    >
                      #{user.rank}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-3">
                      <Avatar size="sm" tone="muted" userName={user.name} src={user.avatarUrl} />
                      <span className="min-w-0">
                        <span className="block truncate font-semibold text-snowWhite-50">{user.name}</span>
                        <span className="block text-xs text-snowWhite-300">{t('row.grade', { grade: user.grade })}</span>
                      </span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <span className={clsx('font-semibold', tier === 'gold' ? 'text-mangoYellow-200' : 'text-secondary-300')}>
                      {t('row.xp', { xp: user.xp })}
                    </span>
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

      <div className={clsx('mt-5 flex justify-end', { invisible: totalPages <= 1 })}>
        <Pagination totalPages={totalPages} currentPage={safePage} onPageChange={setPage} />
      </div>
    </Box>
  )
}

export default RankingTable
