import clsx from 'clsx'
import React from 'react'

import { Box } from '@/components'

export type KanbanColumnId = 'todo' | 'inProgress' | 'done'

export type KanbanColumnProps = {
  title: string
  tone: 'muted' | 'secondary' | 'success'
  children: React.ReactNode
  count: number
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ title, tone, count, children }) => {
  return (
    <Box
      variant="glass"
      size="lg"
      round="3xl"
      className={clsx(
        'flex h-full min-h-0 w-full flex-col border-primary-800/70',
        'transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-px',
        {
          'bg-primary-950/35 hover:border-primary-700/80 hover:shadow-[0_18px_40px_rgba(2,8,24,0.55)]':
            tone === 'muted',
          'border-secondary-500/25 bg-secondary-500/5 hover:border-secondary-400/45 hover:shadow-[0_18px_40px_rgba(42,117,255,0.25)]':
            tone === 'secondary',
          'border-jadeGreen-500/25 bg-jadeGreen-500/5 hover:border-jadeGreen-400/45 hover:shadow-[0_18px_40px_rgba(16,78,32,0.35)]':
            tone === 'success',
        }
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <p
          className={clsx('text-xs font-semibold uppercase tracking-[0.22em]', {
            'text-snowWhite-200': tone === 'muted',
            'text-secondary-300': tone === 'secondary',
            'text-jadeGreen-300': tone === 'success',
          })}
        >
          {title}
        </p>
        <span className="rounded-full border border-primary-800/70 bg-primary-950/45 px-2 py-0.5 text-[11px] font-semibold text-snowWhite-200">
          {count}
        </span>
      </div>
      <div className="mt-4 flex-1 min-h-0 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-primary-800/70 scrollbar-track-transparent">
        <div className="space-y-2 pb-1 lg:space-y-3">{children}</div>
      </div>
    </Box>
  )
}

export default KanbanColumn
