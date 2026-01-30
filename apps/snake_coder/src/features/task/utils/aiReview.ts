import type { AiReviewResponse } from '../types'

type Translator = (key: string, values?: Record<string, string | number | Date>) => string

export const formatAiReview = (review: AiReviewResponse, t: Translator) => {
  const blocks: string[] = [`${t('aiReview.labels.grade')}: ${review.grade}`]

  if (review.summary) {
    blocks.push(`${t('aiReview.labels.summary')}: ${review.summary}`)
  }

  if (review.strengths.length) {
    blocks.push(`${t('aiReview.labels.strengths')}:\n- ${review.strengths.join('\n- ')}`)
  }

  if (review.improvements.length) {
    blocks.push(`${t('aiReview.labels.improvements')}:\n- ${review.improvements.join('\n- ')}`)
  }

  if (review.nextSteps.length) {
    blocks.push(`${t('aiReview.labels.nextSteps')}:\n- ${review.nextSteps.join('\n- ')}`)
  }

  if (Number.isFinite(review.remaining) && Number.isFinite(review.limit)) {
    blocks.push(`${t('aiReview.labels.remaining')}: ${review.remaining}/${review.limit}`)
  }

  return blocks.join('\n\n')
}
