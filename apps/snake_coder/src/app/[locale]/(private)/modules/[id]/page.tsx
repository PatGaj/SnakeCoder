import { Module } from '@/features/module'

type ModulePageProps = {
  params: Promise<{
    locale: string
    id: string
  }>
}

const ModulePage = async ({ params }: ModulePageProps) => {
  const { id } = await params

  return <Module id={id} />
}

export default ModulePage
