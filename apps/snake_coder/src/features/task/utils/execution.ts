import type { ExecuteCaseResult } from '../types'

// Normalizes arbitrary executor values into strings for UI display.
export const normalizeExecuteValue = (value: unknown): string | null => {
  if (value === null || value === undefined) return null
  if (typeof value === 'string') return value
  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}

const toDisplayText = (value: string | null | undefined) => value ?? ''

// Builds console output from run results (stdout/actual/stderr/error), collapsing empty blocks.
export const formatConsoleFromRun = (results: ExecuteCaseResult[]) => {
  if (!results.length) return ''

  return results
    .map((result, index) => {
      const stdout = toDisplayText(result.stdout).trim()
      const stderr = toDisplayText(result.stderr).trim()
      const error = toDisplayText(result.error).trim()
      const actual = toDisplayText(result.actual).trim()

      const blocks = [stdout, actual, stderr, error].filter((block) => block.length)
      if (!blocks.length) return null

      const prefix = results.length > 1 ? `#${index + 1}\n` : ''
      return `${prefix}${blocks.join('\n')}`
    })
    .filter(Boolean)
    .join('\n\n')
}

// Picks the most relevant output for a failed test case.
export const formatFailedOutput = (result?: ExecuteCaseResult) => {
  if (!result) return null
  return result.actual ?? result.stdout ?? result.stderr ?? result.error ?? null
}
