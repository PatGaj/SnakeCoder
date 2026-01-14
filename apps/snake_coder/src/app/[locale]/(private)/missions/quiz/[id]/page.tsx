import { Quiz } from '@/features/quiz'

type QuizPageProps = {
  params: Promise<{
    locale: string
    id: string
  }>
}

const QuizPage = async ({ params }: QuizPageProps) => {
  const { id } = await params

  return <Quiz id={id} />
}

export default QuizPage
