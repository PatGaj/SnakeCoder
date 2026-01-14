import React from 'react'

import type { SprintCardData } from './SprintTabsCard'

export type SprintTabVM = {
  id: string
  sprintNo: number
  status: SprintCardData['status']
  isActive: boolean
  isLocked: boolean
}

export type UseSprintTabsCardVM = {
  activeId: string
  setActiveId: React.Dispatch<React.SetStateAction<string>>
  active?: SprintCardData
  tabs: SprintTabVM[]
  isLocked: boolean
  isAvailable: boolean
  isInProgress: boolean
  isDone: boolean
  tasksDone: boolean
  quizDone: boolean
  articleDone: boolean
}

const useSprintTabsCard = (sprints: SprintCardData[]): UseSprintTabsCardVM => {
  const [activeId, setActiveId] = React.useState(() => sprints[0]?.id ?? '')

  React.useEffect(() => {
    if (sprints.length === 0) return
    if (!sprints.some((sprint) => sprint.id === activeId)) setActiveId(sprints[0].id)
  }, [activeId, sprints])

  const active = sprints.find((sprint) => sprint.id === activeId) ?? sprints[0]

  if (!active) {
    return {
      activeId,
      setActiveId,
      active: undefined,
      tabs: [],
      isLocked: false,
      isAvailable: false,
      isInProgress: false,
      isDone: false,
      tasksDone: false,
      quizDone: false,
      articleDone: false,
    }
  }

  const tabs: SprintTabVM[] = sprints.map((sprint) => ({
    id: sprint.id,
    sprintNo: sprint.sprintNo,
    status: sprint.status,
    isActive: sprint.id === active.id,
    isLocked: sprint.status === 'locked',
  }))

  const isLocked = active.status === 'locked'
  const isAvailable = active.status === 'available'
  const isInProgress = active.status === 'inProgress'
  const isDone = active.status === 'done'
  const tasksDone = active.tasksTotal > 0 && active.tasksDone >= active.tasksTotal
  const quizDone = active.quizTotal > 0 && active.quizScore >= active.quizTotal
  const articleDone = active.articleTotal === 0 ? true : active.articleDoneCount >= active.articleTotal

  return {
    activeId,
    setActiveId,
    active,
    tabs,
    isLocked,
    isAvailable,
    isInProgress,
    isDone,
    tasksDone,
    quizDone,
    articleDone,
  }
}

export default useSprintTabsCard
