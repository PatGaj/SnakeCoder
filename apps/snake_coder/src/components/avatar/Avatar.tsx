import React from 'react'
import { tv, type VariantProps } from 'tailwind-variants'
import { cn } from '@/lib/utils'

const avatarStyles = tv({
  slots: {
    root:
      'relative inline-flex items-center justify-center overflow-hidden rounded-full border ' +
      'cursor-pointer transition duration-150 ease-out ' +
      'hover:brightness-120 ',
    image: 'absolute inset-0 h-full w-full object-cover',
    icon: 'flex items-center justify-center font-semibold uppercase',
  },
  variants: {
    size: {
      xs: { root: 'h-8 w-8 text-xs', icon: 'text-[11px]' },
      sm: { root: 'h-10 w-10 text-sm', icon: 'text-xs' },
      md: { root: 'h-12 w-12 text-base', icon: 'text-sm' },
      lg: { root: 'h-14 w-14 text-lg', icon: 'text-base' },
    },
    tone: {
      primary: {
        root: 'bg-primary-800/80 border-primary-700',
        icon: 'text-snowWhite-50',
      },
      secondary: {
        root: 'bg-secondary-500 border-secondary-700',
        icon: 'text-nightBlack-900',
      },
      muted: {
        root: 'bg-primary-900/80 border-primary-800',
        icon: 'text-snowWhite-200',
      },
    },
  },
  defaultVariants: {
    size: 'md',
    tone: 'secondary',
  },
})
type AvatarProps = VariantProps<typeof avatarStyles> & {
  src?: string | null
  alt?: string
  userName?: string
  onClick?: React.MouseEventHandler<HTMLSpanElement>
  className?: string
}

const Avatar: React.FC<AvatarProps> = ({ src, alt = 'avatar', userName, size, tone, className, onClick }) => {
  const styles = avatarStyles({ size, tone })
  const firstName = userName?.split(' ')[0][0].toUpperCase()

  return (
    <span className={cn(styles.root(), className)} onClick={onClick}>
      {src ? (
        <img src={src} alt={alt} className={styles.image()} />
      ) : (
        <span className={styles.icon()}>
          {firstName}
        </span>
      )}
    </span>
  )
}

Avatar.displayName = 'Avatar'

export default Avatar
