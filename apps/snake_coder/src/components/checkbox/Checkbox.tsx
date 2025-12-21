import clsx from 'clsx'
import React from 'react'
import { tv, type VariantProps } from 'tailwind-variants'
import { FaCheck } from 'react-icons/fa'

import { cn } from '@/lib/utils'

const checkboxStyles = tv({
  slots: {
    box: clsx(
      'peer cursor-pointer shrink-0 appearance-none relative',
      'border bg-transparent',
      'transition-colors',
      'focus-visible:outline-none focus-visible:ring-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'checked:border-transparent'
    ),
    icon: clsx(
      'pointer-events-none absolute text-nightBlack-500',
      'opacity-0 scale-75 transition-all duration-150',
      'peer-checked:opacity-100 peer-checked:scale-100'
    ),
  },
  variants: {
    variant: {
      default: {
        box: 'checked:bg-primary-500 checked:text-snowWhite-200',
        icon: 'text-snowWhite-200',
      },
      second: {
        box: 'checked:bg-secondary-500 checked:text-nightBlack-800',
        icon: 'text-nightBlack-800',
      },
    },
    size: {
      xs: { box: 'h-3 w-3', icon: 'text-[8px]' },
      sm: { box: 'h-4 w-4', icon: 'text-[9px]' },
      md: { box: 'h-5 w-5', icon: 'text-[10px]' },
      lg: { box: 'h-6 w-6', icon: 'text-[11px]' },
      xl: { box: 'h-7 w-7', icon: 'text-[12px]' },
    },
    round: {
      xs: { box: 'rounded-xs', icon: '' },
      sm: { box: 'rounded-sm', icon: '' },
      md: { box: 'rounded-md', icon: '' },
      lg: { box: 'rounded-lg', icon: '' },
      xl: { box: 'rounded-xl', icon: '' },
      full: { box: 'rounded-full', icon: '' },
    },
    destructive: {
      true: {},
      false: {},
    },
  },
  compoundVariants: [
    {
      destructive: true,
      class: {
        box: clsx(
          'border-red-500 text-red-600',
          'focus-visible:ring-red-500',
          'checked:bg-red-500 checked:text-snowWhite-200'
        ),
        icon: 'text-snowWhite-200',
      },
    },
  ],
  defaultVariants: {
    variant: 'default',
    size: 'md',
    round: 'md',
    destructive: false,
  },
})

type CheckboxVariants = VariantProps<typeof checkboxStyles>

type CheckboxProps = CheckboxVariants & {
  label?: React.ReactNode
  destructiveText?: React.ReactNode
  className?: string
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, variant, size, round, destructive = false, destructiveText, disabled, ...props }, ref) => {
    const styles = checkboxStyles({ variant, size, round, destructive })

    return (
      <label className="flex flex-col gap-1 select-none">
        <span className="flex items-center gap-2">
          <span className="relative flex items-center justify-center">
            <input
              type="checkbox"
              ref={ref}
              disabled={disabled}
              aria-invalid={destructive || undefined}
              className={cn(styles.box(), className)}
              {...props}
            />
            <FaCheck className={styles.icon()} />
          </span>
          {label && (
            <span
              className={clsx('text-sm leading-none', {
                'text-red-600': destructive,
                'opacity-60': disabled,
              })}
            >
              {label}
            </span>
          )}
        </span>
        {destructiveText !== undefined && (
          <span className={clsx('min-h-4 text-xs text-red-600', { invisible: !destructive })}>
            {destructiveText || '\u00A0'}
          </span>
        )}
      </label>
    )
  }
)

Checkbox.displayName = 'Checkbox'

export default Checkbox
