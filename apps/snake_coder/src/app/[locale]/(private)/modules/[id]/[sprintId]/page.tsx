import { Sprint } from '@/features/sprint'

type SprintPageProps = {
  params: Promise<{
    locale: string
    id: string
    sprintId: string
  }>
}

const SprintPage = async ({ params }: SprintPageProps) => {
  const { id: moduleId, sprintId } = await params

  return <Sprint moduleId={moduleId} sprintId={sprintId} />
}

export default SprintPage
