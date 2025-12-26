'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { tv, type VariantProps } from 'tailwind-variants'

import { cn } from '@/lib/utils'

const TOOLTIP_OFFSET_PX = 10

const tooltipStyles = tv({
  slots: {
    wrapper: 'relative inline-flex',
    bubble:
      'fixed z-[9999] whitespace-nowrap rounded-md border px-3 py-1.5 text-xs font-semibold shadow-[0_16px_34px_#00000076] backdrop-blur-sm',
    arrow: 'absolute h-2 w-2 rotate-45 border',
  },
  variants: {
    side: {
      top: { arrow: 'left-1/2 top-full -translate-x-1/2 -translate-y-1/2' },
      bottom: { arrow: 'left-1/2 bottom-full -translate-x-1/2 translate-y-1/2' },
      left: { arrow: 'left-full top-1/2 -translate-x-1/2 -translate-y-1/2' },
      right: { arrow: 'right-full top-1/2 translate-x-1/2 -translate-y-1/2' },
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
  disabled?: boolean
  className?: string
  contentClassName?: string
}

const Tooltip: React.FC<TooltipProps> = ({ content, children, disabled, side, variant, className, contentClassName }) => {
  const styles = tooltipStyles({ side, variant })
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLSpanElement | null>(null)
  const [coords, setCoords] = useState<{ top: number; left: number; transform: string } | null>(null)

  const updatePosition = useMemo(() => {
    const effectiveSide = side ?? 'top'
    return () => {
      const el = wrapperRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      if (effectiveSide === 'top') {
        setCoords({ top: rect.top - TOOLTIP_OFFSET_PX, left: centerX, transform: 'translate(-50%, -100%)' })
        return
      }
      if (effectiveSide === 'bottom') {
        setCoords({ top: rect.bottom + TOOLTIP_OFFSET_PX, left: centerX, transform: 'translate(-50%, 0)' })
        return
      }
      if (effectiveSide === 'left') {
        setCoords({ top: centerY, left: rect.left - TOOLTIP_OFFSET_PX, transform: 'translate(-100%, -50%)' })
        return
      }
      setCoords({ top: centerY, left: rect.right + TOOLTIP_OFFSET_PX, transform: 'translate(0, -50%)' })
    }
  }, [side])

  useEffect(() => {
    if (!open) return
    updatePosition()
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [open, updatePosition])

  if (disabled) {
    return <span className={cn(styles.wrapper(), className)}>{children}</span>
  }

  return (
    <span
      ref={wrapperRef}
      className={cn(styles.wrapper(), className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      {open &&
        coords &&
        createPortal(
          <span
            className={cn(styles.bubble(), contentClassName)}
            style={{ top: coords.top, left: coords.left, transform: coords.transform }}
            role="tooltip"
          >
            {content}
            <span className={styles.arrow()} aria-hidden />
          </span>,
          document.body
        )}
    </span>
  )
}

Tooltip.displayName = 'Tooltip'

export default Tooltip
