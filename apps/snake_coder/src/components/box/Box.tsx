import React from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

import { cn } from '@/lib/utils'

const BoxStyles = tv({
  base: 'border-2 w-max h-max',
  variants: {
    variant: {
      default:
        'bg-linear-to-br from-primary-900 to-primary-800 border-primary-700/80 text-snowWhite-50 shadow-[4px_10px_10px_4px_#0a2147]',
      secondary: 'bg-primary-900 border-primary-800/90 text-snowWhite-50 shadow-[4px_10px_10px_4px_#061d44]',
      accent: 'bg-secondary-500 border-secondary-700 text-nightBlack-900 shadow-[3px_5px_25px_4px_#555235]',
      info: 'bg-aquaBlue-700/70 border-aquaBlue-500 text-snowWhite-50 shadow-[4px_10px_10px_4px_#061d44]',
      success: 'bg-jadeGreen-600/90 border-jadeGreen-500 text-snowWhite-50 shadow-[0_14px_34px_#104e20]',
      warning: 'bg-mangoYellow-600 border-mangoYellow-700 text-nightBlack-900 shadow-[0_14px_34px_#434702]',
      danger: 'bg-chiliRed-800/80 border-chiliRed-700 text-snowWhite-50 shadow-[0_14px_34px_#742108]',
      muted: 'bg-stoneGray-800/70 border-stoneGray-600 text-snowWhite-200',
      outline: 'bg-transparent border-primary-50 text-primary-100',
      ghost: 'bg-transparent border-transparent text-snowWhite-100',
      glass: 'bg-white/5 border-white/10 text-snowWhite-50 backdrop-blur-md shadow-[0_18px_48px_#061d44]',
    },
    size: {
      xs: 'p-1.5',
      sm: 'p-3',
      md: 'px-5 py-4',
      lg: 'px-7 py-5',
      xl: 'px-9 py-7',
    },
    round: {
      none: 'rounded-none',
      xs: 'rounded-xs',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      '2xl': 'rounded-2xl',
      '3xl': 'rounded-3xl',
      full: 'rounded-full',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
    round: 'lg',
  },
})

type BoxProps = VariantProps<typeof BoxStyles> & {
  children?: React.ReactNode
  className?: string
}

const Box: React.FC<BoxProps> = ({ children, className, ...variants }) => {
  return <div className={cn(BoxStyles(variants), className)}>{children}</div>
}

Box.displayName = 'Box'

export default Box
