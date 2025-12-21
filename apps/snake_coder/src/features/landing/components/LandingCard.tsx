import React from 'react'
import clsx from 'clsx'

import { Box } from '@/components'

type LandingCardProps = {
  icon: React.ReactNode
  title: string
  desc: string
  right?: React.ReactNode
  bodyClassName?: string
  className?: string
}

const LandingCard: React.FC<LandingCardProps> = ({ icon, title, desc, right, bodyClassName, className }) => {
  return (
    <Box variant="glass" size="lg" round="2xl" className={clsx('w-full border-primary-800/70', className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="rounded-xl border border-primary-800/70 bg-primary-950/60 p-2">{icon}</div>
          <div className={clsx('space-y-1', bodyClassName)}>
            <p className="text-sm font-semibold text-snowWhite-50">{title}</p>
            <p className="text-xs text-snowWhite-300">{desc}</p>
          </div>
        </div>
        {right && <span className="text-sm font-semibold text-primary-200">{right}</span>}
      </div>
    </Box>
  )
}

export default LandingCard

