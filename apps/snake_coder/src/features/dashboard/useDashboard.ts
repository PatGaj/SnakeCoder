'use client'

import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useQuery } from '@tanstack/react-query'

import type { LastResultCardData, PlanCardData, SprintBannerData } from './components'

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
        module: 'PCEP' | 'PCAP' | 'BASICS'
        moduleId: string
        sprintId: string
        sprintNo: number
        etaMinutes: number
        hasActiveTask: boolean
        tasksDone: number
        tasksTotal: number
        articleDone: boolean
        articleDoneCount: number
        articleTotal: number
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
  planBonusClaimed: boolean
  lastResult: {
    todayXp: number
    yesterdayXp: number
    grade: string
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

  const lastResult: LastResultCardData = {
    todayXp: data?.lastResult.todayXp ?? 0,
    yesterdayXp: data?.lastResult.yesterdayXp ?? 0,
    grade: data?.lastResult.grade ?? '',
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

  const tasksRemaining = data.sprint.tasksTotal - data.sprint.tasksDone
  const articleRemaining = data.sprint.articleTotal - data.sprint.articleDoneCount
  const quizRemaining = data.sprint.quizTotal - data.sprint.quizScore

  const showTasks = tasksRemaining > 0
  const showArticle = articleRemaining > 0
  const showQuiz = quizRemaining > 0

  const hasPlanItems = showTasks || showArticle || showQuiz

  const planTasksTotal = showTasks ? 1 : 0
  const planTasksDone = showTasks ? (data.sprint.tasksDone > 0 ? 1 : 0) : 0

  const planArticleDone = showArticle ? data.sprint.articleDoneCount > 0 : false

  const planQuizPercent = showQuiz ? (data.sprint.quizScore > 0 ? 100 : 0) : 0
  const planQuizOk = showQuiz ? planQuizPercent >= 80 : true

  const planComplete =
    (!showTasks || planTasksDone >= planTasksTotal) && (!showArticle || planArticleDone) && (!showQuiz || planQuizOk)

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
    plan: hasPlanItems
      ? {
          bonusXp: 120,
          complete: planComplete,
          bonusClaimed: data?.planBonusClaimed ?? false,
          tasksDone: planTasksDone,
          tasksTotal: planTasksTotal,
          articleDone: planArticleDone,
          quizPercent: planQuizPercent,
          quizOk: planQuizOk,
          showTasks,
          showArticle,
          showQuiz,
        }
      : undefined,
    lastResult,
    sprint,
    isLoading,
    isError,
    errorLabel: t('error'),
  }
}

export default useDashboard
