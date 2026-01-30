import React from 'react'

type ActiveTimerParams = {
  id: string
  status?: 'TODO' | 'IN_PROGRESS' | 'DONE'
}

// Tracks active time spent on a task, pausing when the tab/window is inactive.
export const useActiveTaskTimer = ({ id, status }: ActiveTimerParams) => {
  const activeSinceRef = React.useRef<number | null>(null)
  const activeSecondsRef = React.useRef<number>(0)

  // Stops the timer and accumulates elapsed seconds since last resume.
  const pauseActiveTimer = React.useCallback(() => {
    const startedAt = activeSinceRef.current
    if (!startedAt) return

    const elapsed = Math.max(0, Math.round((Date.now() - startedAt) / 1000))
    activeSecondsRef.current += elapsed
    activeSinceRef.current = null
  }, [])

  // Starts the timer if it's not already running.
  const resumeActiveTimer = React.useCallback(() => {
    if (activeSinceRef.current !== null) return
    activeSinceRef.current = Date.now()
  }, [])

  // Resets timing when task changes or is already completed.
  React.useEffect(() => {
    activeSecondsRef.current = 0
    activeSinceRef.current = null

    if (!status || status === 'DONE') {
      return
    }

    resumeActiveTimer()
  }, [id, status, resumeActiveTimer])

  // Hooks into browser visibility/focus to pause/resume timing automatically.
  React.useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        pauseActiveTimer()
      } else {
        resumeActiveTimer()
      }
    }

    window.addEventListener('focus', resumeActiveTimer)
    window.addEventListener('blur', pauseActiveTimer)
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      pauseActiveTimer()
      window.removeEventListener('focus', resumeActiveTimer)
      window.removeEventListener('blur', pauseActiveTimer)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [pauseActiveTimer, resumeActiveTimer])

  // Returns total active seconds, including the current running segment.
  const getElapsedSeconds = React.useCallback(() => {
    const pending =
      activeSinceRef.current !== null
        ? Math.max(1, Math.round((Date.now() - activeSinceRef.current) / 1000))
        : 0
    return activeSecondsRef.current + pending
  }, [])

  return { getElapsedSeconds }
}
