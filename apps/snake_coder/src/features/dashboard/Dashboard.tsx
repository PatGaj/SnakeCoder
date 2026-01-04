'use client'

import { useRouter } from '@/i18n/navigation'

import { DashboardHeader, LastResultCard, PlanCard, SkillTestCard, SprintBanner } from './components'
import useDashboard from './useDashboard'

const Dashboard = () => {
  const router = useRouter()
  const { name, plan, lastResult, sprint, skillTest } = useDashboard()

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
      <SkillTestCard skillTest={skillTest} onGoToTest={() => router.push(skillTest.route)} />
    </main>
  )
}

export default Dashboard
