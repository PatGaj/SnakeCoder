'use client'

import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

import type {
  DailyCardData,
  DailyCardStatus,
  DailyCardType,
  LastResultBadgeVariant,
  LastResultCardData,
  PlanCardData,
  SkillTestCardData,
  SprintBannerData,
} from './components'

export type UseDashboardData = {
  name: string
  plan: PlanCardData
  lastResult: LastResultCardData
  sprint: SprintBannerData
  daily: DailyCardData
  skillTest: SkillTestCardData
}

const useDashboard = (): UseDashboardData => {
  const t = useTranslations('dashboard')
  const { data: session } = useSession()

  const name = session?.user?.name || t('fallbackUser')

  const gradeRank = (grade: string) => {
    const normalized = grade.trim().toUpperCase()
    const order = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F'] as const
    const idx = order.indexOf(normalized as (typeof order)[number])
    return idx === -1 ? null : idx
  }

  const isAtLeastGrade = (grade: string, minimum: string) => {
    const current = gradeRank(grade)
    const min = gradeRank(minimum)
    if (current === null || min === null) return false
    return current <= min
  }

  const hardData = {
    sprint: {
      module: 'PCEP' as const,
      sprintNo: 3,
      etaMinutes: 18,
      hasActiveTask: false,
      tasksDone: 2,
      tasksTotal: 6,
      articleDone: true,
      quizScore: 6,
      quizTotal: 10,
      sprintTestUnlocked: false,
      title: 'Funkcje: argumenty i zwracanie',
      desc: 'Krótkie ćwiczenia z funkcji: argumenty, return i walidacja.',
      nextTaskTitle: 'Walidacja danych wejściowych',
      nextTaskDesc: 'Dodaj sprawdzanie typu i zakresu argumentów oraz upewnij się, że rozwiązanie przechodzi testy.',
      taskRoute: '/missions',
      sprintRoute: '/missions?sprint=3',
    },
    daily: {
      type: 'code' as DailyCardType,
      etaMinutes: 8,
      rewardXp: 60,
      status: 'new' as DailyCardStatus,
      title: 'krótkie zadanie',
      shortDesc: 'Napisz funkcję zgodnie z opisem i przejdź testy.',
      desc: 'Szybki trening z aktualnego zakresu. Wynik: testy + feedback AI.',
      grade: 'B+',
    },
    lastResult: {
      todayXp: 40,
      yesterdayXp: 180,
      grade: 'B+',
      avgSeconds: 120,
      lastSeconds: 105,
    },
    plan: {
      bonusXp: 120,
    },
  }

  const sprintProgress = Math.round(
    (hardData.sprint.tasksDone / Math.max(hardData.sprint.tasksTotal, 1)) * 70 +
      (hardData.sprint.articleDone ? 15 : 0) +
      (hardData.sprint.quizScore / Math.max(hardData.sprint.quizTotal, 1)) * 15
  )

  const quizPercent = Math.round((hardData.sprint.quizScore / Math.max(hardData.sprint.quizTotal, 1)) * 100)
  const quizOk = quizPercent >= 80
  const dailyGradeOk = isAtLeastGrade(hardData.daily.grade, 'B')

  const planComplete = hardData.daily.status === 'done' && quizOk && dailyGradeOk

  const skillTestReady =
    hardData.sprint.tasksDone >= hardData.sprint.tasksTotal &&
    hardData.sprint.articleDone &&
    hardData.sprint.quizScore >= hardData.sprint.quizTotal

  const speedMultiplier = (() => {
    const timeSeconds = hardData.lastResult.lastSeconds
    const avg = hardData.lastResult.avgSeconds
    const fastUpper = Math.round(avg * 0.83)
    const avgUpper = Math.round(avg * 1.17)
    const slowUpper = Math.round(avg * 2.0)

    if (timeSeconds < fastUpper) return 1.2
    if (timeSeconds <= avgUpper) return 1.0
    if (timeSeconds <= slowUpper) return 0.8
    return 0.5
  })()

  const speedBadgeVariant: LastResultBadgeVariant = (() => {
    if (speedMultiplier >= 1.2) return 'success'
    if (speedMultiplier >= 1.0) return 'secondary'
    if (speedMultiplier >= 0.8) return 'muted'
    return 'warning'
  })()

  return {
    name,
    plan: {
      bonusXp: hardData.plan.bonusXp,
      complete: planComplete,
      dailyStatus: hardData.daily.status,
      quizPercent,
      quizOk,
      dailyGrade: hardData.daily.grade,
      dailyGradeOk,
    },
    lastResult: {
      todayXp: hardData.lastResult.todayXp,
      yesterdayXp: hardData.lastResult.yesterdayXp,
      grade: hardData.lastResult.grade,
      speedPercent: Math.round(speedMultiplier * 100),
      speedBadgeVariant,
    },
    sprint: {
      module: hardData.sprint.module,
      sprintNo: hardData.sprint.sprintNo,
      etaMinutes: hardData.sprint.etaMinutes,
      hasActiveTask: hardData.sprint.hasActiveTask,
      tasksDone: hardData.sprint.tasksDone,
      tasksTotal: hardData.sprint.tasksTotal,
      articleDone: hardData.sprint.articleDone,
      quizScore: hardData.sprint.quizScore,
      quizTotal: hardData.sprint.quizTotal,
      sprintTestUnlocked: hardData.sprint.sprintTestUnlocked,
      progressPercent: sprintProgress,
      title: hardData.sprint.title,
      desc: hardData.sprint.desc,
      nextTaskTitle: hardData.sprint.nextTaskTitle,
      nextTaskDesc: hardData.sprint.nextTaskDesc,
      taskRoute: hardData.sprint.taskRoute,
      route: hardData.sprint.sprintRoute,
    },
    daily: {
      title: hardData.daily.title,
      shortDesc: hardData.daily.shortDesc,
      desc: hardData.daily.desc,
      type: hardData.daily.type,
      etaMinutes: hardData.daily.etaMinutes,
      rewardXp: hardData.daily.rewardXp,
      status: hardData.daily.status,
      route: '/daily',
    },
    skillTest: {
      ready: skillTestReady,
      requirements: [
        {
          id: 'tasks',
          done: hardData.sprint.tasksDone >= hardData.sprint.tasksTotal,
          meta: `${hardData.sprint.tasksDone}/${hardData.sprint.tasksTotal}`,
        },
        {
          id: 'article',
          done: hardData.sprint.articleDone,
          meta: hardData.sprint.articleDone ? t('common.done') : t('common.todo'),
        },
        {
          id: 'quiz',
          done: hardData.sprint.quizScore >= hardData.sprint.quizTotal,
          meta: `${hardData.sprint.quizScore}/${hardData.sprint.quizTotal}`,
        },
      ],
      route: '/missions',
    },
  }
}

export default useDashboard
