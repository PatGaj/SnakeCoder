'use client'

import { useRouter } from '@/i18n/navigation'

import { DashboardHeader, LastResultCard, PlanCard, SkillTestCard, SprintBanner, NoSprintCard } from './components'
import useDashboard from './useDashboard'

const Dashboard = () => {
  const router = useRouter()
  const { name, plan, lastResult, sprint, skillTest, isLoading, isError, errorLabel } = useDashboard()

  if (isError) {
    return (
      <main className="mx-auto max-w-400 px-6 py-10 md:px-12">
        <div className="text-sm text-snowWhite-300">{errorLabel}</div>
      </main>
    )
  }

  if (isLoading && !sprint) {
    return null
  }

  return (
    <main className="mx-auto max-w-400 px-6 py-10 space-y-8 md:px-12">
      <DashboardHeader name={name} />

      <section className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
        {plan ? <PlanCard plan={plan} /> : <NoSprintCard onGoToModules={() => router.push('/modules')} />}
        <LastResultCard lastResult={lastResult} />
      </section>

      {sprint && (
        <SprintBanner
          sprint={sprint}
          onContinue={() => router.push(sprint.taskRoute)}
          onGoToSprint={() => router.push(sprint.route)}
        />
      )}

      {skillTest && <SkillTestCard skillTest={skillTest} onGoToTest={() => router.push(skillTest.route)} />}
    </main>
  )
}

export default Dashboard
