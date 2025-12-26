import type React from 'react'
import clsx from 'clsx'

import { Tooltip } from '@/components'

type SideBarToggleProps = {
  toggled: boolean
  label: string
  onToggle: () => void
  icon: React.ReactNode
}

const SideBarToggle: React.FC<SideBarToggleProps> = ({ toggled, label, onToggle, icon }) => {
  return (
    <Tooltip content={label} side="right" variant="muted">
      <button
        type="button"
        className={clsx(
          'h-8 w-8 place-items-center rounded-r-xl cursor-pointer border transition duration-300 shadow-[0_14px_30px_#00000070]',
          'border-primary-800/70 bg-secondary-500 text-primary-800 hover:bg-secondary-600',
          {
            'w-6!': !toggled,
          }
        )}
        onClick={onToggle}
      >
        <div className={clsx('transition duration-700', { 'rotate-180': !toggled })}>{icon}</div>
      </button>
    </Tooltip>
  )
}

export default SideBarToggle
