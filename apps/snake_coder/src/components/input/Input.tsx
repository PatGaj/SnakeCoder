'use client'

import React from 'react'
import clsx from 'clsx'
import { tv, type VariantProps } from 'tailwind-variants'
import { RiEyeLine, RiEyeOffLine } from 'react-icons/ri'

import { cn } from '@/lib/utils'

const inputStyles = tv({
  base: clsx(
    'w-full border transition-colors duration-150',
    'text-snowWhite-50 placeholder:text-snowWhite-300/70',
    'focus:outline-none focus:ring-2',
    'focus:ring-secondary-400/70 focus:ring-offset-2 focus:ring-offset-primary-950',
    'disabled:cursor-not-allowed disabled:opacity-60',
    'shadow-[0_10px_20px_#070b2e94]'
  ),
  variants: {
    variant: {
      solid: 'bg-primary-950/80 border-primary-700/80',
      muted: 'bg-primary-900/70 border-primary-800 text-snowWhite-100',
      outline: 'bg-transparent border-primary-500/70 text-snowWhite-50',
      ghost: 'bg-transparent border-transparent text-snowWhite-100 focus:border-secondary-400',
    },
    size: {
      sm: 'h-9 px-3 text-xs',
      md: 'h-10 px-4 text-sm',
      lg: 'h-12 px-5 text-base',
    },
    round: {
      sm: 'rounded-[5px]',
      md: 'rounded-md',
      lg: 'rounded-lg',
      pill: 'rounded-full',
    },
    destructive: {
      true: '',
      false: '',
    },
  },
  compoundVariants: [
    {
      destructive: true,
      class: 'border-red-500 text-red-50 placeholder:text-red-300 focus:ring-red-500',
    },
  ],
  defaultVariants: {
    variant: 'solid',
    size: 'md',
    round: 'md',
    destructive: false,
  },
})

type InputVariants = VariantProps<typeof inputStyles>

type InputProps = React.InputHTMLAttributes<HTMLInputElement> &
  InputVariants & {
    title?: React.ReactNode
    destructive?: boolean
    destructiveText?: React.ReactNode
    showPasswordToggle?: boolean
    passwordToggleLabelShow?: string
    passwordToggleLabelHide?: string
  }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant,
      size,
      round,
      destructive = false,
      title,
      destructiveText,
      disabled,
      type,
      showPasswordToggle = true,
      passwordToggleLabelShow = 'Show password',
      passwordToggleLabelHide = 'Hide password',
      ...props
    },
    ref
  ) => {
    const [passwordVisible, setPasswordVisible] = React.useState(false)
    const canTogglePassword = type === 'password' && showPasswordToggle
    const resolvedType = canTogglePassword ? (passwordVisible ? 'text' : 'password') : type

    return (
      <label className="flex flex-col select-none">
        {title && (
          <span
            className={clsx('text-xs text-snowWhite-200 pl-2 font-semibold', {
              'text-red-500': destructive,
              'opacity-60': disabled,
            })}
          >
            {title}
          </span>
        )}
        <div className="relative">
          <input
            ref={ref}
            type={resolvedType}
            disabled={disabled}
            className={cn(
              inputStyles({ variant, size, round, destructive }),
              clsx({ 'pr-10': canTogglePassword }),
              className
            )}
            {...props}
          />
          {canTogglePassword && (
            <button
              type="button"
              disabled={disabled}
              aria-label={passwordVisible ? passwordToggleLabelHide : passwordToggleLabelShow}
              className={clsx(
                'absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer',
                'text-snowWhite-200 hover:text-snowWhite-50',
                { 'opacity-60': disabled }
              )}
              onClick={() => setPasswordVisible((prev) => !prev)}
            >
              {passwordVisible ? <RiEyeLine size={18} /> : <RiEyeOffLine size={18} />}
            </button>
          )}
        </div>
        {destructiveText !== undefined && (
          <span className={clsx('min-h-4 pl-2 pt-1 text-xs text-red-500', { invisible: !destructive })}>
            {destructiveText || '\u00A0'}
          </span>
        )}
      </label>
    )
  }
)

Input.displayName = 'Input'

export default Input
