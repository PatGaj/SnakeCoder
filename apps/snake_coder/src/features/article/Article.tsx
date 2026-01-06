'use client'

import { ArticleContent, ArticleHeader, ArticleToc } from './components'
import useArticle from './useArticle'

export type ArticleProps = {
  id: string
}

const Article: React.FC<ArticleProps> = ({ id }) => {
  const { header, toc, content, isError, errorLabel, onBack, onMarkRead, markReadPending } = useArticle(id)

  if (!header) {
    if (isError) {
      return (
        <main className="mx-auto max-w-400 px-6 pb-10 pt-20 md:px-12">
          <div className="text-sm text-snowWhite-300">{errorLabel}</div>
        </main>
      )
    }
    return null
  }

  return (
    <main className="mx-auto max-w-400 px-6 pb-10 pt-20 space-y-8 md:px-12">
      <ArticleHeader
        header={header}
        onBack={onBack}
        onMarkRead={onMarkRead}
        markReadLoading={markReadPending}
      />

      <section className="grid gap-6 lg:grid-cols-[0.35fr_0.65fr]">
        <ArticleToc items={toc} />
        <ArticleContent content={content} />
      </section>
    </main>
  )
}

export default Article
