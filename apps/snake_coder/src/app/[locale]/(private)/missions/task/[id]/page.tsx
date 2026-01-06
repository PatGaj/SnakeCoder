import { Task } from '@/features/task'

type TaskPageProps = {
  params: Promise<{
    locale: string
    id: string
  }>
}

const TaskPage = async ({ params }: TaskPageProps) => {
  const { id } = await params

  return <Task id={id} />
}

export default TaskPage
