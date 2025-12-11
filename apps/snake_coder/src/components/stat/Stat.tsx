import React from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

import { cn } from '@/lib/utils'

const statStyles = tv({
  slots: {
    card: 'rounded-xl border p-4 shadow-[0_18px_42px_#111111ac]',
    label: 'text-xs uppercase tracking-wide text-snowWhite-300',
    value: 'text-2xl font-semibold text-snowWhite-50',
    helper: 'text-xs text-snowWhite-300',
    badge: 'inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold uppercase tracking-wide',
  },
  variants: {
    variant: {
      primary: { card: 'border-primary-800/80 bg-primary-950/70' },
      secondary: { card: 'border-secondary-500/70 bg-secondary-500/10' },
      success: { card: 'border-jadeGreen-500/70 bg-jadeGreen-800/30' },
    },
    trend: {
      up: { badge: 'bg-jadeGreen-600/90 text-snowWhite-50' },
      down: { badge: 'bg-chiliRed-700 text-snowWhite-50' },
      neutral: { badge: 'bg-primary-800 text-snowWhite-200' },
    },
  },
  defaultVariants: {
    variant: 'primary',
    trend: 'neutral',
  },
})

type StatProps = VariantProps<typeof statStyles> & {
  label: React.ReactNode
  value: React.ReactNode
  helper?: React.ReactNode
  delta?: React.ReactNode
  className?: string
}

const Stat: React.FC<StatProps> = ({ label, value, helper, delta, variant, trend, className }) => {
  const styles = statStyles({ variant, trend })
  return (
    <div className={cn(styles.card(), className)}>
      <div className="flex items-start justify-between">
        <div>
          <div className={styles.label()}>{label}</div>
          <div className={styles.value()}>{value}</div>
        </div>
        {delta && <span className={styles.badge()}>{delta}</span>}
      </div>
      {helper && <div className={styles.helper()}>{helper}</div>}
    </div>
  )
}

Stat.displayName = 'Stat'

export default Stat
