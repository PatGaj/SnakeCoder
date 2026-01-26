import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'

import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

type AnalyticsPayload = {
  event?: unknown
  sessionId?: unknown
  payload?: unknown
}

const clampString = (value: unknown, max = 200) => {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  if (!trimmed) return null
  return trimmed.length > max ? trimmed.slice(0, max) : trimmed
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = (await req.json().catch(() => null)) as AnalyticsPayload | null
  const event = clampString(body?.event, 80)

  if (!event) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const sessionId = clampString(body?.sessionId, 120)
  const payload = typeof body?.payload === 'object' ? body?.payload : null

  await prisma.analyticsLog.create({
    data: {
      event,
      userId,
      sessionId,
      payload,
    },
  })

  return NextResponse.json({ ok: true })
}
