import React from 'react'
import clsx from 'clsx'

type HeroPointProps = {
  icon: React.ReactNode
  title: string
  desc: string
  className?: string
}

const HeroPoint: React.FC<HeroPointProps> = ({ icon, title, desc, className }) => {
  return (
    <li
      className={clsx(
        'flex items-start gap-3 rounded-xl border border-primary-800/70 bg-primary-950/40 px-4 py-3',
        className
      )}
    >
      {icon}
      <div className="space-y-0.5">
        <p className="text-sm font-semibold text-snowWhite-50">{title}</p>
        <p className="text-xs text-snowWhite-300">{desc}</p>
      </div>
    </li>
  )
}

export default HeroPoint
