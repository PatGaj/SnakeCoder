import { useCallback, useEffect, useRef, useState } from 'react'

type CountdownTimerParams = {
  durationSeconds: number
  enabled: boolean
  resetKey?: number
}

// Runs a countdown timer and exposes remaining time plus elapsed seconds.
export const useCountdownTimer = ({ durationSeconds, enabled, resetKey = 0 }: CountdownTimerParams) => {
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(0)
  const [timerEpoch, setTimerEpoch] = useState(0)
  const startedAtRef = useRef<number | null>(null)
  const endsAtRef = useRef<number | null>(null)

  useEffect(() => {
    if (!enabled || durationSeconds <= 0) {
      startedAtRef.current = null
      endsAtRef.current = null
      setTimeLeftSeconds(0)
      return
    }

    const now = Date.now()
    startedAtRef.current = now
    endsAtRef.current = now + durationSeconds * 1000
    setTimeLeftSeconds(durationSeconds)
    setTimerEpoch((prev) => prev + 1)
  }, [durationSeconds, enabled, resetKey])

  useEffect(() => {
    if (!endsAtRef.current || !enabled) return

    const interval = window.setInterval(() => {
      const endMs = endsAtRef.current
      if (!endMs) return
      const next = Math.max(0, Math.ceil((endMs - Date.now()) / 1000))
      setTimeLeftSeconds(next)
    }, 1000)

    return () => window.clearInterval(interval)
  }, [enabled, timerEpoch])

  const getElapsedSeconds = useCallback(() => {
    if (!startedAtRef.current) return 0
    return Math.max(0, Math.round((Date.now() - startedAtRef.current) / 1000))
  }, [])

  const isRunning = enabled && durationSeconds > 0 && timeLeftSeconds > 0

  return { timeLeftSeconds, isRunning, getElapsedSeconds }
}
