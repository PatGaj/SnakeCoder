'use client'

import React from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

import { cn } from '@/lib/utils'

const trackStyles = tv({
  base: 'relative w-full overflow-hidden border bg-primary-950/70',
  variants: {
    variant: {
      primary: 'border-primary-800/70',
      secondary: 'border-secondary-500/70',
      success: 'border-jadeGreen-600/70',
      danger: 'border-chiliRed-700/70',
      muted: 'border-primary-800 bg-primary-900/70',
    },
    size: {
      sm: 'h-2',
      md: 'h-3',
      lg: 'h-4',
    },
    round: {
      sm: 'rounded-[5px]',
      md: 'rounded-md',
      lg: 'rounded-lg',
      full: 'rounded-full',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
    round: 'full',
  },
})

const indicatorStyles = tv({
  base: 'h-full w-full transition-[width] duration-200 ease-out',
  variants: {
    variant: {
      primary:
        'bg-linear-to-r from-primary-500 via-aquaBlue-500 to-aquaBlue-300',
      secondary: 'bg-secondary-500 text-nightBlack-900',
      success: 'bg-jadeGreen-500',
      danger: 'bg-chiliRed-600 ',
      muted: 'bg-primary-700/70',
    },
    round: {
      sm: 'rounded-[5px]',
      md: 'rounded-md',
      lg: 'rounded-lg',
      full: 'rounded-full',
    },
  },
  defaultVariants: {
    variant: 'primary',
    round: 'full',
  },
})

type ProgressbarProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof trackStyles> & {
    value: number
    max?: number
    label?: React.ReactNode
    showValue?: boolean
    indicatorClassName?: string
  }

const Progressbar: React.FC<ProgressbarProps> = ({
  value,
  max = 100,
  label,
  showValue = false,
  className,
  indicatorClassName,
  variant,
  size,
  round,
  ...props
}) => {
  const safeMax = Math.max(max, 1)
  const boundedValue = Math.min(Math.max(value, 0), safeMax)
  const percent = (boundedValue / safeMax) * 100

  return (
    <div className={cn('space-y-1', className)} {...props}>
      {(label || showValue) && (
        <div className="flex items-center justify-between text-xs text-snowWhite-200">
          {label && <span className="font-semibold text-snowWhite-50 pl-1">{label}</span>}
          {showValue && <span className="font-medium text-snowWhite-300">{Math.round(percent)}%</span>}
        </div>
      )}
      <div
        className={trackStyles({ variant, size, round })}
        role="progressbar"
        aria-valuenow={boundedValue}
        aria-valuemin={0}
        aria-valuemax={safeMax}
      >
        <div className={cn(indicatorStyles({ variant, round }), indicatorClassName)} style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}

Progressbar.displayName = 'Progressbar'

export default Progressbar
