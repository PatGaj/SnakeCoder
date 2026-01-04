'use client'

import toast from 'react-hot-toast'
import { useTranslations } from 'next-intl'

import { useRouter } from '@/i18n/navigation'

import { ArticleContent, ArticleHeader, ArticleToc } from './components'
import useArticle from './useArticle'

export type ArticleProps = {
  id: string
}

const Article: React.FC<ArticleProps> = ({ id }) => {
  const t = useTranslations('article')
  const router = useRouter()

  const { header, toc, content } = useArticle(id)

  return (
    <main className="mx-auto max-w-400 px-6 pb-10 pt-20 space-y-8 md:px-12">
      <ArticleHeader
        header={header}
        onBack={() => router.push('/missions')}
        onMarkRead={() => {
          toast.success(t('toasts.markRead'))
          router.push('/missions')
        }}
      />

      <section className="grid gap-6 lg:grid-cols-[0.35fr_0.65fr]">
        <ArticleToc items={toc} />
        <ArticleContent content={content} />
      </section>
    </main>
  )
}

export default Article
