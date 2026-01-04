'use client'

import { useTranslations } from 'next-intl'

import { ChampionsTable, RankingTable } from './components'
import useRanking from './useRanking'

const Ranking = () => {
  const t = useTranslations('ranking')
  const { champions, users } = useRanking()

  return (
    <main className="mx-auto max-w-400 px-6 pb-10 pt-20 space-y-8 md:px-12">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary-300">{t('badge')}</p>
        <h1 className="text-3xl font-semibold text-snowWhite-50">{t('title')}</h1>
        <p className="max-w-2xl text-sm text-snowWhite-300 md:text-base">{t('subtitle')}</p>
      </header>

      <ChampionsTable champions={champions} />

      <RankingTable users={users} />
    </main>
  )
}

export default Ranking
