import clsx from 'clsx'
import React from 'react'
import { tv, type VariantProps } from 'tailwind-variants'
import { RiArrowDownSLine } from 'react-icons/ri'

import { cn } from '@/lib/utils'

const selectStyles = tv({
  base: clsx(
    'w-full border transition-colors duration-150',
    'text-snowWhite-50 placeholder:text-snowWhite-300/70',
    'focus:outline-none focus:ring-2',
    'focus:ring-secondary-400/70 focus:ring-offset-2 focus:ring-offset-primary-950',
    'disabled:cursor-not-allowed disabled:opacity-60',
    'shadow-[0_10px_20px_#070b2e94]',
    'appearance-none'
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

type SelectVariants = VariantProps<typeof selectStyles>

type NativeSelectProps = Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'>

export type SelectOption = {
  value: string
  label: React.ReactNode
  disabled?: boolean
}

export type SelectProps = NativeSelectProps &
  SelectVariants & {
    title?: React.ReactNode
    destructive?: boolean
    destructiveText?: React.ReactNode
    options?: SelectOption[]
  }

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
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
      options,
      children,
      ...props
    },
    ref
  ) => {
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
          <select
            ref={ref}
            disabled={disabled}
            aria-invalid={destructive || undefined}
            className={cn(selectStyles({ variant, size, round, destructive }), 'pr-10', className)}
            {...props}
          >
            {options
              ? options.map((option) => (
                  <option key={option.value} value={option.value} disabled={option.disabled}>
                    {option.label}
                  </option>
                ))
              : children}
          </select>
          <RiArrowDownSLine
            size={18}
            className={clsx('pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-snowWhite-200', {
              'opacity-60': disabled,
            })}
          />
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

Select.displayName = 'Select'

export default Select
