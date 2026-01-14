'use client'

import { useRouter } from '@/i18n/navigation'
import { motion } from 'framer-motion'

import { DashboardHeader, LastResultCard, PlanCard, SprintBanner, NoSprintCard } from './components'
import useDashboard from './useDashboard'

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1]

const pageVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: EASE_OUT,
      when: 'beforeChildren',
      staggerChildren: 0.08,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE_OUT } },
}

const Dashboard = () => {
  const router = useRouter()
  const { name, plan, lastResult, sprint, isLoading, isError, errorLabel } = useDashboard()
  const showPlan = Boolean(plan)
  const showNoSprint = !sprint

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
    <motion.main
      className="mx-auto max-w-400 px-6 py-10 space-y-8 md:px-12"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <DashboardHeader name={name} />
      </motion.div>

      <motion.section
        className={showPlan || showNoSprint ? 'grid gap-6 lg:grid-cols-[1fr_0.95fr]' : 'grid gap-6'}
        variants={itemVariants}
      >
        {showPlan && <PlanCard plan={plan} />}
        {!showPlan && showNoSprint && <NoSprintCard onGoToModules={() => router.push('/modules')} />}
        <LastResultCard lastResult={lastResult} />
      </motion.section>

      {sprint && (
        <motion.div variants={itemVariants}>
          <SprintBanner
            sprint={sprint}
            onContinue={() => router.push(sprint.taskRoute)}
            onGoToSprint={() => router.push(sprint.route)}
          />
        </motion.div>
      )}

    </motion.main>
  )
}

export default Dashboard
