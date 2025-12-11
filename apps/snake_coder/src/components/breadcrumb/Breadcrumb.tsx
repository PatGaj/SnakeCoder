'use client'

import React from 'react'
import { tv } from 'tailwind-variants'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'

const breadcrumbStyles = tv({
  slots: {
    nav: 'flex items-center gap-2 text-sm text-snowWhite-200',
    item: 'inline-flex items-center gap-2',
    link: 'text-primary-100 hover:text-secondary-400 transition-colors',
    current: 'text-snowWhite-50 font-semibold',
    separator: 'text-primary-300/70',
  },
})

type BreadcrumbProps = {
  className?: string
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ className }) => {
  const styles = breadcrumbStyles()
  const pathname = usePathname() || '/'

  const cleanPath = pathname.split('?')[0].split('#')[0]
  const segments = cleanPath.split('/').filter(Boolean)

  const items = segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/')
    const label = decodeURIComponent(segment)

    return { href, label }
  })

  const lastIndex = items.length - 1

  return (
    <nav aria-label="Breadcrumb" className={cn(styles.nav(), className)}>
      {items.map((item, index) => {
        const isLast = index === lastIndex
        return (
          <span key={item.href} className={styles.item()}>
            {isLast ? (
              <span className={styles.current()} aria-current="page">
                {item.label}
              </span>
            ) : (
              <a className={styles.link()} href={item.href}>
                {item.label}
              </a>
            )}
            {!isLast && <span className={styles.separator()}>/</span>}
          </span>
        )
      })}
    </nav>
  )
}

Breadcrumb.displayName = 'Breadcrumb'

export default Breadcrumb
