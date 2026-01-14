import type React from 'react'
import clsx from 'clsx'

import { Tooltip } from '@/components'

type StatTopBarItemProps = {
  tooltip: string
  label: string
  value: string
  icon: React.ReactNode
  className?: string
  iconWrapperClassName?: string
}

const StatTopBarItem: React.FC<StatTopBarItemProps> = ({
  tooltip,
  label,
  value,
  icon,
  className,
  iconWrapperClassName,
}) => {
  return (
    <Tooltip content={tooltip} side="bottom" variant="muted" className="shrink-0">
      <span
        className={clsx(
          'inline-flex items-center gap-3 rounded-2xl border px-3 py-2 text-snowWhite-50 shadow-[0_18px_48px_#0000005c] whitespace-nowrap',
          className
        )}
      >
        <span className={clsx('grid h-9 w-9 place-items-center rounded-xl', iconWrapperClassName)}>{icon}</span>
        <span className="flex flex-col leading-tight whitespace-nowrap">
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-snowWhite-200/70">{label}</span>
          <span className="text-sm font-semibold whitespace-nowrap">{value}</span>
        </span>
      </span>
    </Tooltip>
  )
}

export default StatTopBarItem
