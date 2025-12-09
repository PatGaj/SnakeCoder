import React from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

import { cn } from '@/lib/utils'

const badgeStyles = tv({
  base: 'inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wide',
  variants: {
    variant: {
      primary: 'bg-primary-900 border-primary-600 text-snowWhite-50',
      secondary: 'bg-secondary-500 text-nightBlack-900 border-secondary-600 shadow-[0_5px_15px_#fffb2da6]',
      success: 'bg-jadeGreen-600/90 border-jadeGreen-500 text-snowWhite-50',
      warning: 'bg-mangoYellow-600 border-mangoYellow-700 text-nightBlack-900',
      danger: 'bg-chiliRed-700 border-chiliRed-800 text-snowWhite-50',
      muted: 'bg-primary-900/70 border-primary-800 text-snowWhite-200',
      outline: 'bg-transparent border-primary-200 text-primary-100',
    },
    size: {
      sm: 'text-[10px] px-2 py-0.5',
      md: '',
      lg: 'text-[12px] px-3.5 py-1.5',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
})

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeStyles>

const Badge: React.FC<BadgeProps> = ({ className, variant, size, ...props }) => {
  return <span className={cn(badgeStyles({ variant, size }), className)} {...props} />
}

Badge.displayName = 'Badge'

export default Badge
