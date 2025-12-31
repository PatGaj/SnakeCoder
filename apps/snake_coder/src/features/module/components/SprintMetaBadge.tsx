import React from 'react'
import type { IconType } from 'react-icons'
import { RiCheckboxCircleLine } from 'react-icons/ri'

import { Badge } from '@/components'

export type SprintMetaBadgeProps = {
  done: boolean
  todoIcon: IconType
  children: React.ReactNode
}

const SprintMetaBadge: React.FC<SprintMetaBadgeProps> = ({ done, todoIcon: TodoIcon, children }) => {
  return (
    <Badge variant={done ? 'success' : 'muted'} className="min-w-52 flex-1 justify-center px-3 py-2">
      <span className="inline-flex items-center gap-2">
        {done ? (
          <RiCheckboxCircleLine size={16} className="text-secondary-300" />
        ) : (
          <TodoIcon size={16} className="text-secondary-300" />
        )}
        {children}
      </span>
    </Badge>
  )
}

export default SprintMetaBadge

