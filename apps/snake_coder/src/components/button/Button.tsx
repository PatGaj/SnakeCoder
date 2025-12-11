'use client'

import React from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

import { cn } from '@/lib/utils'
import clsx from 'clsx'

const buttonStyles = tv({
  base: clsx(
    'flex items-center justify-center gap-x-2',
    'border-2 cursor-pointer font-semibold',
    'transition-all duration-200',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-0',
    'active:translate-y-px active:opacity-85'
  ),
  variants: {
    variant: {
      primary: clsx(
        'bg-primary-600 text-snowWhite-50 border-primary-700 shadow-[0_5px_10px_#12305e92]',
        'hover:-translate-y-px hover:shadow-[0_7px_12px_#20488392]'
      ),
      glow: clsx(
        'bg-secondary-500 text-nightBlack-900 border-secondary-600 shadow-[0_5px_10px_#a3954292]',
        'hover:-translate-y-px hover:shadow-[0_7px_12px_#f8dd4684]'
      ),
      outline: 'bg-primary-950 text-primary-50 border-primary-200 hover:-translate-y-px',
      muted: 'bg-snowWhite-50/10 text-snowWhite-50 border-snowWhite-50/10 hover:bg-snowWhite-50/14',
      gradient: clsx(
        'bg-gradient-to-r border-1 from-primary-500 via-aquaBlue-500 to-secondary-500 text-nightBlack-900 shadow-[0_14px_32px_#20488392]',
        'hover:-translate-y-px'
      ),
      ghost: 'bg-transparent text-snowWhite-100 border-transparent hover:bg-snowWhite-50/5',
    },
    size: {
      sm: 'h-9 px-3 text-xs',
      md: 'h-10 px-4 text-sm',
      lg: 'h-11 px-5 text-base',
      xl: 'h-12 px-6 text-base',
    },
    round: {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      pill: 'rounded-full',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
    round: 'md',
  },
})

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonStyles> & {
    leftIcon?: React.ReactNode
    rightIcon?: React.ReactNode
    loading?: boolean
    edgeIcons?: boolean
  }

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, round, leftIcon, rightIcon, loading, edgeIcons, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonStyles({ variant, size, round }), loading && 'cursor-wait opacity-80', className)}
        disabled={loading}
        {...props}
      >
        {loading && (
          <span className="absolute h-4 w-4 animate-spin rounded-full border-2 border-current border-b-transparent border-t-transparent" />
        )}
        {leftIcon && <span className={clsx('text-current', { invisible: loading })}>{leftIcon}</span>}
        <span className={clsx({ invisible: loading, 'w-full': edgeIcons })}>{children}</span>
        {rightIcon && <span className={clsx('text-current', { invisible: loading })}>{rightIcon}</span>}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
