import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'

import { Prisma } from '@/generated/prisma/client'

import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

type AnalyticsPayload = {
  event?: unknown
  sessionId?: unknown
  payload?: unknown
}

// Normalizes a string input with length limit; returns null for empty/invalid values.
const clampString = (value: unknown, max = 200) => {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  if (!trimmed) return null
  return trimmed.length > max ? trimmed.slice(0, max) : trimmed
}

// Logs a single analytics event for the authenticated user.
export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Parse payload defensively to avoid failing the request on malformed JSON.
  const body = (await req.json().catch(() => null)) as AnalyticsPayload | null
  const event = clampString(body?.event, 80)

  if (!event) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const sessionId = clampString(body?.sessionId, 120)
  // Store JSON null explicitly to satisfy Prisma JSON input typing.
  const payload =
    body?.payload === null || body?.payload === undefined
      ? Prisma.JsonNull
      : (body.payload as Prisma.InputJsonValue)

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
