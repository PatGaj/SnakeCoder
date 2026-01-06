import { Article } from '@/features/article'

type ArticlePageProps = {
  params: Promise<{
    locale: string
    id: string
  }>
}

const ArticlePage = async ({ params }: ArticlePageProps) => {
  const { id } = await params

  return <Article id={id} />
}

export default ArticlePage
