import { Article } from '@/features/article'

type ArticlePageProps = {
  params: {
    id: string
  }
}

const ArticlePage = ({ params }: ArticlePageProps) => {
  return <Article id={params.id} />
}

export default ArticlePage

