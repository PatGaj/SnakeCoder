import React from 'react'
import clsx from 'clsx'

export type LastResultTileProps = {
  title: string
  value: string
  hint: string
  icon?: React.ReactNode
  className?: string
}

const LastResultTile: React.FC<LastResultTileProps> = ({ title, value, hint, icon, className }) => {
  return (
    <div className={clsx('rounded-2xl border border-primary-800/70 bg-primary-950/55 p-4', className)}>
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-snowWhite-200/70">{title}</p>
      <p className="mt-2 inline-flex items-center gap-2 text-2xl font-semibold text-snowWhite-50">
        {icon}
        {value}
      </p>
      <p className="mt-1 text-xs text-snowWhite-300">{hint}</p>
    </div>
  )
}

export default LastResultTile
