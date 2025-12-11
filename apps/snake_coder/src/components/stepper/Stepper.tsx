import React from 'react'
import { FaCheck } from 'react-icons/fa'
import { tv, type VariantProps } from 'tailwind-variants'

import { cn } from '@/lib/utils'

const stepperStyles = tv({
  slots: {
    root: 'relative w-full px-1',
    line: 'absolute left-0 right-0 top-1/2 -translate-y-1/2 rounded-full border',
    list: 'relative flex items-center justify-between gap-4',
    item: 'relative z-10 flex flex-col items-center gap-2 text-center',
    circle: 'grid place-items-center rounded-full border font-semibold transition-colors duration-200',
  },
  variants: {
    variant: {
      primary: {
        line: 'h-1 border-primary-800/70 bg-primary-900/70',
        circle:
          'bg-primary-900 border-primary-500/80 text-snowWhite-50 shadow-[0_5px_20px_#080e2e]',
      },
      secondary: {
        line: 'h-1 border-secondary-500/70 bg-secondary-500/25',
        circle:
          'bg-secondary-500 border-secondary-600 text-nightBlack-900 shadow-[0_5px_20px_#5f5e20]',
      },
      muted: {
        line: 'h-1 border-primary-800/80 bg-primary-900/80',
        circle: 'bg-primary-950 border-primary-800 text-snowWhite-200 shadow-[0_5px_30px_#01011f]',
      },
    },
    size: {
      sm: {
        line: 'h-2 mx-2',
        list: 'gap-3',
        circle: 'h-9 w-9 text-[11px]',
      },
      md: {
        line: 'h-2 mx-2',
        list: 'gap-4',
        circle: 'h-11 w-11 text-xs',
      },
      lg: {
        line: 'h-3 mx-2',
        list: 'gap-5',
        circle: 'h-12 w-12 text-sm',
      },
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
})

type StepItem = {
  value: number
}

type StepperProps = VariantProps<typeof stepperStyles> & {
  steps: StepItem[]
  className?: string
  showPercent?: boolean
}

const Stepper: React.FC<StepperProps> = ({ steps, variant, size, className, showPercent = true }) => {
  const styles = stepperStyles({ variant, size })
  const safeSteps = steps.map((step) => ({
    ...step,
    value: Math.max(0, Math.min(100, step.value)),
  }))

  return (
    <div className={cn(styles.root(), className)}>
      <hr className={styles.line()} />
      <div className={styles.list()}>
        {safeSteps.map((step, index) => (
          <div key={index} className={styles.item()}>
            <div className={styles.circle()}>
              {step.value >= 100 ? (
                <FaCheck className="text-[13px]" />
              ) : (
                showPercent && <span>{Math.min(step.value, 99)}%</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

Stepper.displayName = 'Stepper'

export default Stepper
