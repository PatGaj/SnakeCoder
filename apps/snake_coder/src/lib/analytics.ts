const SESSION_ID_KEY = 'snakecoder.sessionId'
const SESSION_START_KEY = 'snakecoder.sessionStartLogged'

const createSessionId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export const getSessionId = (): string | null => {
  if (typeof window === 'undefined') return null

  const stored = window.sessionStorage.getItem(SESSION_ID_KEY)
  if (stored) return stored

  const next = createSessionId()
  window.sessionStorage.setItem(SESSION_ID_KEY, next)
  return next
}

export const logAnalyticsEvent = async (
  event: string,
  payload?: Record<string, unknown>,
  sessionIdOverride?: string | null
) => {
  const sessionId = sessionIdOverride ?? getSessionId()
  if (!sessionId) return

  try {
    await fetch('/api/analytics/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, sessionId, payload }),
      keepalive: true,
    })
  } catch {
    // Best-effort logging; ignore failures.
  }
}

export const ensureSessionStartLogged = (path: string) => {
  if (typeof window === 'undefined') return null

  const sessionId = getSessionId()
  if (!sessionId) return null

  if (window.sessionStorage.getItem(SESSION_START_KEY)) return sessionId

  window.sessionStorage.setItem(SESSION_START_KEY, '1')
  void logAnalyticsEvent('session_start', { path }, sessionId)
  return sessionId
}
