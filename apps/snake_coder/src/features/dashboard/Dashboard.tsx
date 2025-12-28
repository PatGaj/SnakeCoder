'use client'

import { useTranslations } from 'next-intl'

import { useRouter } from '@/i18n/navigation'

import { DailyCard, DashboardHeader, LastResultCard, PlanCard, SkillTestCard, SprintBanner } from './components'
import useDashboard from './useDashboard'

const Dashboard = () => {
  const t = useTranslations('dashboard')
  const router = useRouter()
  const { name, plan, lastResult, sprint, daily, skillTest } = useDashboard()

  return (
    <main className="mx-auto max-w-400 px-6 py-10 space-y-8 md:px-12">
      <DashboardHeader name={name} />
      <section className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
        <PlanCard plan={plan} />
        <LastResultCard lastResult={lastResult} />
      </section>
      <SprintBanner
        sprint={sprint}
        onContinue={() => router.push(sprint.taskRoute)}
        onGoToSprint={() => router.push(sprint.route)}
      />
      <section className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
        <div className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary-300 pl-4">{t('sections.today')}</p>
          <DailyCard daily={daily} onStart={() => router.push(daily.route)} />
        </div>
        <div className="space-y-6">
          <SkillTestCard skillTest={skillTest} onGoToTest={() => router.push(skillTest.route)} />
        </div>
      </section>
    </main>
  )
}

export default Dashboard
