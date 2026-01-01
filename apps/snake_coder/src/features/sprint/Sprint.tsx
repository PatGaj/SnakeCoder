'use client'

import { useTranslations } from 'next-intl'
import React from 'react'

import { Breadcrumb } from '@/components'
import { useRouter } from '@/i18n/navigation'
import useModule from '@/features/module/useModule'

import { KanbanColumn, TaskCard, TaskModal, type TaskCardData } from './components'
import useSprint from './useSprint'

export type SprintProps = {
  moduleId: string
  sprintId: string
}

const Sprint: React.FC<SprintProps> = ({ moduleId, sprintId }) => {
  const t = useTranslations('sprint')
  const router = useRouter()
  const { module: moduleData, sprints } = useModule(moduleId)
  const { header, columns, hasTasks } = useSprint({ moduleId, sprintId })
  const [selectedTask, setSelectedTask] = React.useState<TaskCardData | null>(null)

  const sprintTitle = sprints.find((sprint) => sprint.id === sprintId)?.title ?? sprintId

  return (
    <main className="mx-auto flex h-screen max-w-400 flex-col overflow-hidden px-6 py-10 md:px-12">
      <header className="shrink-0 space-y-2">
        <Breadcrumb
          items={[
            { href: '/modules', label: 'Modules' },
            { href: `/modules/${moduleId}`, label: `Module-${moduleData.title}` },
            { label: `Sprint-${sprintTitle}` },
          ]}
        />
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary-300">{t('badge')}</p>
        <h1 className="text-3xl font-semibold text-snowWhite-50">{header.title}</h1>
        <p className="max-w-2xl text-sm text-snowWhite-300 md:text-base">{header.desc}</p>
      </header>

      {!hasTasks ? (
        <div className="mt-8 rounded-3xl border border-primary-800/70 bg-white/5 p-6 text-snowWhite-50 backdrop-blur-md">
          <p className="text-sm text-snowWhite-300">{t('empty')}</p>
        </div>
      ) : (
        <section className="mt-8 grid flex-1 min-h-0 gap-6 overflow-hidden lg:grid-cols-3">
          {columns.map((column) => (
            <KanbanColumn key={column.id} title={column.title} tone={column.tone} count={column.count}>
              {column.tasks.map((task) => (
                <TaskCard key={task.id} task={task} onOpen={() => setSelectedTask(task)} />
              ))}
            </KanbanColumn>
          ))}
        </section>
      )}

      <TaskModal
        task={selectedTask}
        open={Boolean(selectedTask)}
        onClose={() => setSelectedTask(null)}
        onGoToTask={(route) => router.push(route)}
      />
    </main>
  )
}

export default Sprint
