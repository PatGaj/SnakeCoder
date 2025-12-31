'use client'

import { useRouter } from '@/i18n/navigation'

import { ModuleHeader, SprintTabsCard } from './components'
import useModule from './useModule'

export type ModuleProps = {
  id: string
}

const Module: React.FC<ModuleProps> = ({ id }) => {
  const router = useRouter()
  const { module: moduleData, sprints } = useModule(id)

  return (
    <main className="mx-auto max-w-400 px-6 py-10 space-y-30 md:px-12">
      <ModuleHeader module={moduleData} />
      <SprintTabsCard sprints={sprints} onOpen={(route) => router.push(route)} />
    </main>
  )
}

export default Module
