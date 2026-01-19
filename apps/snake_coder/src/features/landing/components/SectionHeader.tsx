import React from 'react'
import clsx from 'clsx'

import { cn } from '@/lib/utils'

type SectionHeaderProps = {
  title: React.ReactNode
  subtitle?: React.ReactNode
  align?: 'left' | 'center'
  className?: string
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, align = 'left', className }) => {
  return (
    <div
      className={cn(
        clsx('space-y-3', {
          'text-center': align === 'center',
          'text-center md:text-left': align !== 'center',
        }),
        className
      )}
    >
      <h2 className="text-2xl font-semibold text-snowWhite-50 md:text-3xl">{title}</h2>
      {subtitle && (
        <p
          className={clsx('text-sm text-snowWhite-300 md:text-base', {
            'mx-auto max-w-2xl': align === 'center',
            'mx-auto md:mx-0': align !== 'center',
          })}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}

export default SectionHeader
