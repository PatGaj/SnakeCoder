'use client'

import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useQuery } from '@tanstack/react-query'

import type {
  LastResultBadgeVariant,
  LastResultCardData,
  PlanCardData,
  SprintBannerData,
} from './components'

export type UseDashboardData = {
  name: string
  plan?: PlanCardData
  lastResult: LastResultCardData
  sprint?: SprintBannerData
  isLoading: boolean
  isError: boolean
  errorLabel: string
}

type DashboardApiResponse = {
  name: string | null
  sprint:
    | {
        module: 'PCEP' | 'PCAP'
        moduleId: string
        sprintId: string
        sprintNo: number
        etaMinutes: number
        hasActiveTask: boolean
        tasksDone: number
        tasksTotal: number
        articleDone: boolean
        quizScore: number
        quizTotal: number
        nextTaskTitle: string
        nextTaskDesc: string
        title: string
        desc: string
        taskRoute: string
        route: string
      }
    | null
  lastResult: {
    todayXp: number
    yesterdayXp: number
    grade: string
    speedPercent: number
  }
}

const fetchDashboard = async (): Promise<DashboardApiResponse> => {
  const response = await fetch('/api/dashboard', { method: 'GET', cache: 'no-store' })
  if (!response.ok) {
    throw new Error('Failed to fetch dashboard')
  }
  return response.json() as Promise<DashboardApiResponse>
}

const useDashboard = (): UseDashboardData => {
  const t = useTranslations('dashboard')
  const { data: session } = useSession()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboard,
  })

  const name = data?.name || session?.user?.name || t('fallbackUser')

  const speedBadgeVariant: LastResultBadgeVariant = (() => {
    const percent = data?.lastResult.speedPercent ?? 100
    if (percent >= 120) return 'success'
    if (percent >= 100) return 'secondary'
    if (percent >= 80) return 'muted'
    return 'warning'
  })()

  const lastResult: LastResultCardData = {
    todayXp: data?.lastResult.todayXp ?? 0,
    yesterdayXp: data?.lastResult.yesterdayXp ?? 0,
    grade: data?.lastResult.grade ?? '—',
    speedPercent: data?.lastResult.speedPercent ?? 100,
    speedBadgeVariant,
  }

  if (!data?.sprint) {
    return {
      name,
      lastResult,
      isLoading,
      isError,
      errorLabel: t('error'),
    }
  }

  const sprintProgress = Math.round(
    (data.sprint.tasksDone / Math.max(data.sprint.tasksTotal, 1)) * 70 +
      (data.sprint.articleDone ? 15 : 0) +
      (data.sprint.quizTotal > 0 ? (data.sprint.quizScore / data.sprint.quizTotal) * 15 : 15)
  )

  const quizPercent =
    data.sprint.quizTotal > 0 ? Math.round((data.sprint.quizScore / data.sprint.quizTotal) * 100) : 100
  const quizOk = data.sprint.quizTotal > 0 ? quizPercent >= 80 : true

  const tasksDoneOk = data.sprint.tasksDone >= data.sprint.tasksTotal
  const articleOk = data.sprint.articleDone
  const planComplete = tasksDoneOk && quizOk && articleOk

  const sprint: SprintBannerData = {
    module: data.sprint.module,
    sprintNo: data.sprint.sprintNo,
    etaMinutes: data.sprint.etaMinutes,
    hasActiveTask: data.sprint.hasActiveTask,
    tasksDone: data.sprint.tasksDone,
    tasksTotal: data.sprint.tasksTotal,
    articleDone: data.sprint.articleDone,
    quizScore: data.sprint.quizScore,
    quizTotal: data.sprint.quizTotal,
    progressPercent: sprintProgress,
    title: data.sprint.title,
    desc: data.sprint.desc,
    nextTaskTitle: data.sprint.nextTaskTitle,
    nextTaskDesc: data.sprint.nextTaskDesc,
    taskRoute: data.sprint.taskRoute,
    route: data.sprint.route,
  }

  return {
    name,
    plan: {
      bonusXp: 120,
      complete: planComplete,
      tasksDone: data.sprint.tasksDone,
      tasksTotal: data.sprint.tasksTotal,
      articleDone: data.sprint.articleDone,
      quizPercent,
      quizOk,
    },
    lastResult,
    sprint,
    isLoading,
    isError,
    errorLabel: t('error'),
  }
}

export default useDashboard
