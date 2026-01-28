import type { CodeEditorData, PublicTestsData, TaskDescriptionData } from './components'

export type ExecuteMode = 'runCode' | 'fullTest' | 'completeTask'

export type TaskApiResponse = {
  task: TaskDescriptionData
  editor: CodeEditorData
  patternCode: string
  userCode: string | null
  publicTests: PublicTestsData
  totalTestsCount: number
  timeLimitSeconds: number
  status: 'TODO' | 'IN_PROGRESS' | 'DONE'
  startedAt: string | null
  missionType: 'TASK' | 'BUGFIX'
  aiReviewEnabled?: boolean
  aiReviewRemaining: number | null
  aiReviewLimit: number | null
}

export type ExecuteCaseResult = {
  expected?: string | null
  actual?: string | null
  passed?: boolean
  stdout?: string | null
  stderr?: string | null
  error?: string | null
}

export type ExecuteRunResponse = { mode: 'runCode' | 'fullTest'; results: ExecuteCaseResult[] }
export type ExecuteCompleteResponse = {
  mode: 'completeTask'
  isTaskPassed: boolean
  passedCount: number
  totalCount: number
  xpAwarded: number
  timeSpentSeconds: number | null
  testAttemptsCount: number
}

export type ExecuteResponse = ExecuteRunResponse | ExecuteCompleteResponse

export type ExecuteCaseResultRaw = {
  expected?: unknown | null
  actual?: unknown | null
  passed?: boolean
  stdout?: unknown | null
  stderr?: unknown | null
  error?: unknown | null
}

export type ExecuteRunResponseRaw = { mode: 'runCode' | 'fullTest'; results: ExecuteCaseResultRaw[] }
export type ExecuteResponseRaw = ExecuteRunResponseRaw | ExecuteCompleteResponse

export type AiReviewResponse = {
  grade: string
  summary: string
  strengths: string[]
  improvements: string[]
  nextSteps: string[]
  remaining: number
  limit: number
}

export type SprintTaskStatus = 'todo' | 'inProgress' | 'done'
