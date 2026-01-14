'use client'

import { useTranslations } from 'next-intl'

import { ProfileAccountCard, ProfileStatsCard, ProfileUnlockedModulesCard } from './components'
import useProfile from './useProfile'

const Profile = () => {
  const t = useTranslations('profile')
  const { account, stats, unlockedModules, isError, errorLabel, saveAccount } = useProfile()

  if (!account || !stats) {
    if (isError) {
      return (
        <main className="mx-auto max-w-400 px-6 pb-10 pt-20 md:px-12">
          <div className="text-sm text-snowWhite-300">{errorLabel}</div>
        </main>
      )
    }
    return null
  }

  return (
    <main className="mx-auto max-w-400 px-6 pb-10 pt-20 space-y-8 md:px-12">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary-300">{t('badge')}</p>
        <h1 className="text-3xl font-semibold text-snowWhite-50">{t('title')}</h1>
        <p className="max-w-2xl text-sm text-snowWhite-300 md:text-base">{t('subtitle')}</p>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <ProfileAccountCard account={account} onSave={saveAccount} />
        <ProfileStatsCard stats={stats} />
      </section>

      <section>
        <ProfileUnlockedModulesCard modules={unlockedModules} />
      </section>
    </main>
  )
}

export default Profile
