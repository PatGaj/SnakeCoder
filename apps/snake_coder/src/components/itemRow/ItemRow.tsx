import type React from 'react'
import clsx from 'clsx'

export type ItemRowProps = {
  icon: React.ReactNode
  label: string
  right: React.ReactNode
  className?: string
}

const ItemRow: React.FC<ItemRowProps> = ({ icon, label, right, className }) => {
  return (
    <div
      className={clsx(
        'flex items-center justify-between rounded-xl border border-primary-800/70 bg-primary-950/60 px-3 py-2',
        className
      )}
    >
      <span className="inline-flex items-center gap-2 text-sm text-snowWhite-200">
        {icon}
        {label}
      </span>
      {right}
    </div>
  )
}

export default ItemRow

