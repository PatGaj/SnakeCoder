'use client'

import { Breadcrumb } from '@/components'
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
      <div className="space-y-4">
        <Breadcrumb
          items={[
            { href: '/modules', label: 'Modules' },
            { label: `Module-${moduleData.title}` },
          ]}
        />
        <ModuleHeader module={moduleData} />
      </div>
      <SprintTabsCard sprints={sprints} onOpen={(route) => router.push(route)} />
    </main>
  )
}

export default Module
