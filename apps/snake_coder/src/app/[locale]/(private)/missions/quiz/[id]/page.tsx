import { Quiz } from '@/features/quiz'

type QuizPageProps = {
  params: {
    id: string
  }
}

const QuizPage = ({ params }: QuizPageProps) => {
  return <Quiz id={params.id} />
}

export default QuizPage
