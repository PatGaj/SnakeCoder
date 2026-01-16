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
          'inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-snowWhite-50 shadow-[0_18px_48px_#0000005c] whitespace-nowrap lg:gap-3',
          className
        )}
      >
        <span className={clsx('hidden h-8 w-8 place-items-center rounded-xl lg:grid', iconWrapperClassName)}>
          {icon}
        </span>
        <span className="flex flex-col leading-tight whitespace-nowrap">
          <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-snowWhite-200/70">
            {label}
          </span>
          <span className="text-xs font-semibold">{value}</span>
        </span>
      </span>
    </Tooltip>
  )
}

export default StatTopBarItem
