import { Task } from '@/features/task'

type TaskPageProps = {
  params: {
    id: string
  }
}

const TaskPage = ({ params }: TaskPageProps) => {
  return <Task id={params.id} />
}

export default TaskPage
