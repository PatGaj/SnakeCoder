'use client'

import React from 'react'
import { tv } from 'tailwind-variants'
import { usePathname } from 'next/navigation'

import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

const breadcrumbStyles = tv({
  slots: {
    nav: 'hidden items-center gap-2 text-sm text-snowWhite-200 pb-4 lg:flex',
    item: 'inline-flex items-center gap-2',
    link: 'text-primary-100 hover:text-secondary-400 transition-colors',
    current: 'text-snowWhite-50 font-semibold',
    separator: 'text-primary-300/70',
  },
})

type BreadcrumbProps = {
  className?: string
  items?: Array<{
    href?: string
    label: React.ReactNode
  }>
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ className, items: customItems }) => {
  const styles = breadcrumbStyles()
  const pathname = usePathname() || '/'

  const cleanPath = pathname.split('?')[0].split('#')[0]
  const segments = cleanPath.split('/').filter(Boolean)

  const pathItems = segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/')
    const label = decodeURIComponent(segment)

    return { href, label }
  })

  const items = customItems ?? pathItems
  const useIntlLink = customItems != null
  if (items.length === 0) return null

  const lastIndex = items.length - 1

  return (
    <nav aria-label="Breadcrumb" className={cn(styles.nav(), className)}>
      {items.map((item, index) => {
        const isLast = index === lastIndex
        return (
          <span key={item.href ?? `${index}`} className={styles.item()}>
            {isLast ? (
              <span className={styles.current()} aria-current="page">
                {item.label}
              </span>
            ) : item.href ? (
              useIntlLink ? (
                <Link className={styles.link()} href={item.href}>
                  {item.label}
                </Link>
              ) : (
                <a className={styles.link()} href={item.href}>
                  {item.label}
                </a>
              )
            ) : (
              <span className={styles.link()}>{item.label}</span>
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
