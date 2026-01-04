import type React from 'react'
import clsx from 'clsx'

import { Tooltip } from '@/components'
import { Link } from '@/i18n/navigation'

type SideBarNavItemProps = {
  href: string
  icon: React.ReactNode
  label: string
  collapsed: boolean
  active?: boolean
}

const SideBarNavItem: React.FC<SideBarNavItemProps> = ({ href, icon, label, collapsed, active }) => {
  return (
    <Tooltip content={label} side="right" variant="muted" disabled={!collapsed} className="w-full">
      <Link
        href={href}
        className={clsx(
          'relative group flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-sm font-semibold transition',
          'border-transparent text-snowWhite-200 hover:bg-snowWhite-50/5',
          { 'justify-center': collapsed },
          {
            'bg-primary-900/65 border-secondary-500/25 shadow-[0_14px_34px_#0000005c] hover:bg-primary-900/70 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:rounded-r before:bg-secondary-500':
              active,
          }
        )}
      >
        <span className="text-secondary-300 transition group-hover:text-secondary-200">{icon}</span>
        <span className={clsx('truncate', { hidden: collapsed })}>{label}</span>
      </Link>
    </Tooltip>
  )
}

export default SideBarNavItem
