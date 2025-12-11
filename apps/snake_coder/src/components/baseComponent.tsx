import React from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

import { cn } from '@/lib/utils'

const ComponentStyles = tv({
  base: 'border',
  variants: {
    variant: {
      default: '',
      second: '',
    },
    size: {
      xs: '',
      sm: '',
      md: '',
      lg: '',
      xl: '',
    },
    round: {
      xs: '',
      sm: '',
      md: '',
      lg: '',
      xl: '',
      full: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
    round: 'md',
  },
})

type ComponentProps = VariantProps<typeof ComponentStyles> & {
  children: React.ReactNode
  className?: string
}

const Component: React.FC<ComponentProps> = ({ children, className, ...variants }) => {
  return <div className={cn(ComponentStyles(variants), className)}>{children}</div>
}

Component.displayName = 'Component'

export default Component
