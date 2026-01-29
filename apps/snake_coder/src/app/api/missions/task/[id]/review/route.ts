import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import OpenAI, { APIError } from 'openai'

import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { PUBLIC_MODULE_CODES_LIST } from '@/lib/moduleAccess'

type Params = {
  params: Promise<{
    id: string
  }>
}

type ReviewPayload = {
  source?: string
  locale?: string
}

type ReviewResult = {
  grade: string
  summary: string
  strengths: string[]
  improvements: string[]
  nextSteps: string[]
}

type ReviewResponse = ReviewResult & {
  remaining: number
  limit: number
}

const REVIEW_LIMIT_PER_DAY = 3
const OPENAI_TIMEOUT_MS = 120_000
const OPENAI_MODEL = process.env.OPENAI_REVIEW_MODEL

const ALLOWED_GRADES = ['A', 'A-', 'B+', 'B', 'C+', 'C', 'D', 'E'] as const
const SUPPORTED_LOCALES = ['pl', 'en'] as const

// Returns today's midnight for per-day quotas.
const startOfToday = () => {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return now
}

// Ensures the locale is one of the supported languages.
const normalizeLocale = (value?: string | null) => {
  if (!value) return null
  const lower = value.toLowerCase()
  return (SUPPORTED_LOCALES as readonly string[]).includes(lower) ? lower : null
}

// Infers locale from the Accept-Language header.
const localeFromHeaders = (req: Request) => {
  const header = req.headers.get('accept-language') || ''
  const lower = header.toLowerCase()
  if (lower.includes('pl')) return 'pl'
  if (lower.includes('en')) return 'en'
  return null
}

// Extracts model output text from OpenAI Responses API payloads.
const extractOutputText = (payload: unknown) => {
  if (!payload || typeof payload !== 'object') return ''

  const maybeOutputText = (payload as { output_text?: unknown }).output_text
  if (typeof maybeOutputText === 'string') return maybeOutputText

  const output = (payload as { output?: Array<{ type?: string; content?: Array<{ type?: string; text?: string }> }> })
    .output

  if (!Array.isArray(output)) return ''

  for (const entry of output) {
    if (entry?.type !== 'message' || !Array.isArray(entry.content)) continue
    for (const chunk of entry.content) {
      if ((chunk?.type === 'output_text' || chunk?.type === 'text') && typeof chunk.text === 'string') {
        return chunk.text
      }
    }
  }

  return ''
}

// Logs OpenAI errors with useful context for debugging.
const logOpenAiError = (error: unknown) => {
  if (error instanceof APIError) {
    console.error('[ai-review] OpenAI API error', {
      status: error.status,
      type: error.type,
      code: error.code,
      param: error.param,
      requestId: error.requestID,
      message: error.message,
    })

    if (error.error) {
      console.error('[ai-review] OpenAI API error body', error.error)
    }

    return
  }

  if (error instanceof Error) {
    console.error('[ai-review] OpenAI error', { name: error.name, message: error.message })
    return
  }

  console.error('[ai-review] OpenAI error', error)
}

// Safely parses JSON-like text returned by the model.
const parseJsonFromText = (text: string) => {
  const trimmed = text.trim()
  if (!trimmed) return null

  const withoutFences = trimmed.replace(/^```json\s*/i, '').replace(/```$/, '').trim()
  const match = withoutFences.match(/\{[\s\S]*\}/)
  if (!match) return null

  try {
    return JSON.parse(match[0]) as Record<string, unknown>
  } catch {
    return null
  }
}

// Normalizes whitespace and ensures a string output.
const normalizeText = (value: unknown) => {
  if (typeof value !== 'string') return ''
  return value
    .replace(/\\r\\n|\\n|\\r|\\t/g, ' ')
    .replace(/\r\n|\n|\r|\t/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

// Normalizes string lists, trimming empty entries and limiting length.
const normalizeList = (value: unknown, maxItems = 5) => {
  if (!Array.isArray(value)) return []
  return value
    .map((item) => normalizeText(item))
    .filter(Boolean)
    .slice(0, maxItems)
}

// Validates and normalizes the JSON review returned by the model.
const normalizeReview = (payload: Record<string, unknown> | null): ReviewResult | null => {
  if (!payload) return null

  const gradeRaw = typeof payload.grade === 'string' ? payload.grade.trim().toUpperCase() : ''
  const grade = ALLOWED_GRADES.includes(gradeRaw as (typeof ALLOWED_GRADES)[number]) ? gradeRaw : ''

  if (!grade) return null

  const summary = normalizeText(payload.summary)
  const strengths = normalizeList(payload.strengths)
  const improvements = normalizeList(payload.improvements)
  const nextSteps = normalizeList(payload.nextSteps ?? payload.next_steps)

  return {
    grade,
    summary,
    strengths,
    improvements,
    nextSteps,
  }
}

// Builds a plain-text feedback summary stored in the DB.
const buildFeedback = (review: ReviewResult) => {
  const blocks: string[] = [`Grade: ${review.grade}`]

  if (review.summary) {
    blocks.push(`Summary: ${review.summary}`)
  }

  if (review.strengths.length) {
    blocks.push(`Strengths:\n- ${review.strengths.join('\n- ')}`)
  }

  if (review.improvements.length) {
    blocks.push(`Improvements:\n- ${review.improvements.join('\n- ')}`)
  }

  if (review.nextSteps.length) {
    blocks.push(`Next steps:\n- ${review.nextSteps.join('\n- ')}`)
  }

  return blocks.join('\n\n')
}

// Converts letter grades into numeric values for averages.
const gradeValue = (grade: string): number | null => {
  switch (grade) {
    case 'A':
      return 5
    case 'A-':
      return 4.5
    case 'B+':
      return 4
    case 'B':
      return 3.5
    case 'C+':
      return 3
    case 'C':
      return 2.5
    case 'D':
      return 2
    case 'E':
      return 1
    default:
      return null
  }
}

// Computes the average grade across all reviewed tasks.
const computeGradeAvg = (grades: string[]) => {
  const values = grades.map(gradeValue).filter((value): value is number => typeof value === 'number')
  if (!values.length) return null

  const sum = values.reduce((total, value) => total + value, 0)
  return Math.round((sum / values.length) * 100) / 100
}

// Builds the prompt sent to the model using mission context + user code.
const buildPrompt = (params: {
  title: string
  description: string
  requirements: string[]
  hints: string[]
  language: string
  code: string
}) => {
  const { title, description, requirements, hints, language, code } = params

  return [
    `Task title: ${title}`,
    `Description: ${description}`,
    `Requirements: ${requirements.length ? requirements.join('; ') : 'None'}`,
    `Hints: ${hints.length ? hints.join('; ') : 'None'}`,
    `Language: ${language}`,
    'User code:',
    code,
  ].join('\n')
}

// Requests a structured review from the OpenAI model.
const requestReview = async (params: {
  title: string
  description: string
  requirements: string[]
  hints: string[]
  language: string
  code: string
  locale: string
}): Promise<ReviewResult | null> => {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('Missing OpenAI API key')
  }

  const openai = new OpenAI({
    apiKey,
    timeout: OPENAI_TIMEOUT_MS,
  })

  const responseLanguage = params.locale === 'pl' ? 'Polish' : 'English'
  const systemPrompt = [
    'You are a senior Python code reviewer.',
    `Respond in ${responseLanguage}.`,
    'Focus on correctness vs task requirements, code style, readability, naming, structure, formatting, and Python idioms.',
    'Do not provide step-by-step guidance, hints, or solutions.',
    'Do not include code snippets.',
    'Do not suggest writing unit tests or unrelated best practices.',
    'If the task description/requirements mention a required function name (e.g., solve), do not suggest renaming it.',
    'Only describe what the user did well, what is incorrect, and what could be improved in general terms.',
    'Be friendly and beginner-friendly.',
  ].join(' ')
  const userPrompt = ['Return JSON only.', buildPrompt(params)].join('\n')

  let response: Awaited<ReturnType<typeof openai.responses.create>> | null = null

  try {
    response = await openai.responses.create({
      model: OPENAI_MODEL,
      temperature: 0.2,
      max_output_tokens: 700,
      instructions:
        systemPrompt +
        '\nReturn ONLY JSON with keys: grade, summary, strengths, improvements, nextSteps. The grade must be one of A, A-, B+, B, C+, C, D, E.' +
          '\nGuidelines:' +
          `\n- summary: 2-3 sentences (what is correct/incorrect and overall quality). End with "${params.locale === 'pl' ? 'Dobra robota.' : 'Good job.'}" if there is at least one strength. Keep it on a single line.` +
          '\n- strengths: 2-4 items, each 1-2 sentences highlighting concrete positives found in the code.' +
          '\n- improvements: 2-4 items describing concrete issues or gaps relative to the task (no instructions or code).' +
          '\n- nextSteps: always return an empty array.' +
          '\nDo not include newline characters in any string; keep every item as single-line text.',
      input: userPrompt,
      text: { format: { type: 'json_object' }, verbosity: 'medium' },
    })
  } catch (error) {
    logOpenAiError(error)
    return null
  }

  const outputText = response?.output_text || extractOutputText(response)
  const parsed = parseJsonFromText(outputText)
  return normalizeReview(parsed)
}

// Generates and stores an AI review, enforcing daily limits.
export async function POST(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const body = (await req.json().catch(() => null)) as ReviewPayload | null
  const source = typeof body?.source === 'string' ? body.source.trim() : ''
  const locale = normalizeLocale(body?.locale) ?? localeFromHeaders(req) ?? 'pl'

  if (!source) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const mission = await prisma.mission.findFirst({
    where: {
      id,
      type: { in: ['TASK', 'BUGFIX'] },
      module: {
        isBuilding: false,
        OR: [
          {
            access: {
              some: { userId, hasAccess: true },
            },
          },
          { code: { in: PUBLIC_MODULE_CODES_LIST } },
        ],
      },
    },
    select: {
      id: true,
      type: true,
      title: true,
      description: true,
      requirements: true,
      hints: true,
      task: {
        select: {
          language: true,
        },
      },
    },
  })

  if (!mission?.task) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  if (mission.type !== 'TASK') {
    return NextResponse.json({ error: 'Review unavailable for this mission' }, { status: 403 })
  }

  const todayStart = startOfToday()
  const reviewCountToday = await prisma.taskReview.count({
    where: {
      userId,
      createdAt: { gte: todayStart },
    },
  })

  if (reviewCountToday >= REVIEW_LIMIT_PER_DAY) {
    return NextResponse.json(
      { error: 'Daily limit reached', remaining: 0, limit: REVIEW_LIMIT_PER_DAY },
      { status: 429 }
    )
  }

  let review: ReviewResult | null = null

  try {
    review = await requestReview({
      title: mission.title,
      description: mission.description,
      requirements: mission.requirements,
      hints: mission.hints,
      language: mission.task.language,
      code: source,
      locale,
    })
  } catch {
    review = null
  }

  if (!review) {
    return NextResponse.json({ error: 'Review failed' }, { status: 502 })
  }

  const feedback = buildFeedback(review)
  const remaining = Math.max(0, REVIEW_LIMIT_PER_DAY - (reviewCountToday + 1))
  const now = new Date()

  await prisma.$transaction(async (tx) => {
    await tx.taskReview.create({
      data: {
        userId,
        taskId: mission.id,
        code: source,
        grade: review.grade,
        feedback,
        model: OPENAI_MODEL,
      },
    })

    await tx.userMissionProgress.upsert({
      where: { userId_missionId: { userId, missionId: mission.id } },
      update: {
        grade: review.grade,
        lastOpenedAt: now,
      },
      create: {
        userId,
        missionId: mission.id,
        status: 'IN_PROGRESS',
        startedAt: now,
        lastOpenedAt: now,
        grade: review.grade,
      },
    })

    const graded = await tx.userMissionProgress.findMany({
      where: {
        userId,
        grade: { not: null },
        mission: { type: 'TASK' },
      },
      select: { grade: true },
    })

    const avg = computeGradeAvg(
      graded.map((entry) => entry.grade).filter((grade): grade is string => typeof grade === 'string' && grade.length > 0)
    )

    await tx.user.update({
      where: { id: userId },
      data: {
        gradeAvg: avg,
      },
    })
  })

  const responseBody: ReviewResponse = {
    ...review,
    remaining,
    limit: REVIEW_LIMIT_PER_DAY,
  }

  return NextResponse.json(responseBody)
}
