import React, { useState } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

import { cn } from '@/lib/utils'

const tooltipStyles = tv({
  slots: {
    wrapper: 'relative inline-flex',
    bubble:
      'absolute z-30 whitespace-nowrap rounded-md border px-3 py-1.5 text-xs font-semibold shadow-[0_16px_34px_#00000076] backdrop-blur-sm',
    arrow: 'absolute h-2 w-2 rotate-45 border',
  },
  variants: {
    side: {
      top: { bubble: 'bottom-full left-1/2 mb-2 -translate-x-1/2', arrow: 'top-[calc(100%-4px)] left-1/2 -translate-x-1/2' },
      bottom: { bubble: 'top-full left-1/2 mt-2 -translate-x-1/2', arrow: 'bottom-[calc(100%-4px)] left-1/2 -translate-x-1/2' },
      left: { bubble: 'right-full top-1/2 mr-2 -translate-y-1/2', arrow: 'left-[calc(100%-4px)] top-1/2 -translate-y-1/2' },
      right: { bubble: 'left-full top-1/2 ml-2 -translate-y-1/2', arrow: 'right-[calc(100%-4px)] top-1/2 -translate-y-1/2' },
    },
    variant: {
      primary: {
        bubble: 'border-primary-700/80 bg-primary-900/90 text-snowWhite-50',
        arrow: 'border-primary-700/80 bg-primary-900/90',
      },
      secondary: {
        bubble: 'border-secondary-500/80 bg-secondary-500 text-nightBlack-900',
        arrow: 'border-secondary-600 bg-secondary-500',
      },
      muted: {
        bubble: 'border-primary-800/70 bg-primary-950/90 text-snowWhite-200',
        arrow: 'border-primary-800/70 bg-primary-950/90',
      },
    },
  },
  defaultVariants: {
    side: 'top',
    variant: 'primary',
  },
})

type TooltipProps = VariantProps<typeof tooltipStyles> & {
  content: React.ReactNode
  children: React.ReactNode
  className?: string
  contentClassName?: string
}

const Tooltip: React.FC<TooltipProps> = ({ content, children, side, variant, className, contentClassName }) => {
  const styles = tooltipStyles({ side, variant })
  const [open, setOpen] = useState(false)

  return (
    <span
      className={cn(styles.wrapper(), className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      {open && (
        <span className={cn(styles.bubble(), contentClassName)} role="tooltip">
          {content}
          <span className={styles.arrow()} aria-hidden />
        </span>
      )}
    </span>
  )
}

Tooltip.displayName = 'Tooltip'

export default Tooltip
