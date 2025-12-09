import React from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

import { cn } from '@/lib/utils'

const separatorStyles = tv({
  base: 'shrink-0 bg-primary-800/70',
  variants: {
    orientation: {
      horizontal: 'h-px w-full',
      vertical: 'w-px h-full',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
})

type SeparatorProps = React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof separatorStyles>

const Separator: React.FC<SeparatorProps> = ({ orientation, className, ...props }) => (
  <div className={cn(separatorStyles({ orientation }), className)} {...props} />
)

Separator.displayName = 'Separator'

export default Separator
