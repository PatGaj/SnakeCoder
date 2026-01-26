'use client'

import React from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import toast from 'react-hot-toast'

import { getSessionId } from '@/lib/analytics'
import { useRouter } from '@/i18n/navigation'

import type { ArticleContentData, ArticleHeaderData, ArticleTocItem } from './components'

export type UseArticleData = {
  header?: ArticleHeaderData
  toc: ArticleTocItem[]
  content: ArticleContentData
  isLoading: boolean
  isError: boolean
  errorLabel: string
  onBack: () => void
  onMarkRead: () => void
  markReadPending: boolean
}

const buildToc = (content: ArticleContentData): ArticleTocItem[] => {
  return content.blocks
    .filter((block) => block.type === 'heading')
    .map((block) => ({ id: block.id, label: block.text, level: block.level }))
}

type ArticleApiResponse = {
  header: ArticleHeaderData
  content: ArticleContentData
}

const fetchArticle = async (id: string): Promise<ArticleApiResponse> => {
  const response = await fetch(`/api/missions/article/${encodeURIComponent(id)}`, { method: 'GET' })
  if (!response.ok) {
    throw new Error('Failed to fetch article')
  }
  return response.json() as Promise<ArticleApiResponse>
}

const markRead = async (id: string, payload: { timeSpentSeconds?: number; sessionId?: string }) => {
  const response = await fetch(`/api/missions/article/${encodeURIComponent(id)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    throw new Error('Failed to mark article as read')
  }
  return response.json() as Promise<{ ok: true }>
}

const useArticle = (id: string): UseArticleData => {
  const t = useTranslations('article')
  const router = useRouter()
  const queryClient = useQueryClient()
  const startedAtRef = React.useRef<number | null>(null)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['article', id],
    queryFn: () => fetchArticle(id),
    enabled: Boolean(id),
  })

  React.useEffect(() => {
    startedAtRef.current = null
  }, [id])

  React.useEffect(() => {
    if (!data || startedAtRef.current) return
    startedAtRef.current = Date.now()
  }, [data])

  const mutation = useMutation({
    mutationFn: (payload: { timeSpentSeconds?: number; sessionId?: string }) => markRead(id, payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['missions'] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
        queryClient.invalidateQueries({ queryKey: ['user'] }),
        queryClient.invalidateQueries({ queryKey: ['userStats'] }),
        queryClient.invalidateQueries({ queryKey: ['modules'] }),
      ])
      toast.success(t('toasts.markRead'))
      router.push('/missions')
    },
    onError: () => {
      toast.error(t('toasts.markReadError'))
    },
  })

  const header = data?.header
  const content = data?.content ?? { blocks: [], summary: [] }
  const toc = header ? buildToc(content) : []

  return {
    header,
    toc,
    content,
    isLoading,
    isError,
    errorLabel: t('error'),
    onBack: () => router.push('/missions'),
    onMarkRead: () => {
      const timeSpentSeconds =
        startedAtRef.current != null ? Math.max(0, Math.round((Date.now() - startedAtRef.current) / 1000)) : 0
      void mutation.mutateAsync({
        timeSpentSeconds,
        sessionId: getSessionId() ?? undefined,
      })
    },
    markReadPending: mutation.isPending,
  }
}

export default useArticle
