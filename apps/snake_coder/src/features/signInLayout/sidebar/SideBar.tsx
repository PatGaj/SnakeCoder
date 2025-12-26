'use client'

import React from 'react'
import { signOut, useSession } from 'next-auth/react'
import { useLocale, useTranslations } from 'next-intl'
import clsx from 'clsx'
import {
  RiArrowRightSLine,
  RiCodeBoxLine,
  RiFlagLine,
  RiHome4Line,
  RiLogoutBoxLine,
  RiRobot2Line,
  RiRoadMapLine,
  RiStarSmileLine,
  RiTrophyLine,
} from 'react-icons/ri'

import { Avatar, Button, Separator, Tooltip, Logo } from '@/components'
import { usePathname, useRouter } from '@/i18n/navigation'
import { normalizeUrlPath } from '@/lib/normalize'

import SideBarNavItem from './SideBarNavItem'
import SideBarToggle from './SideBarToggle'

const SideBar = () => {
  const [collapsed, setCollapsed] = React.useState<boolean>(false)

  const t = useTranslations('sidebar')
  const locale = useLocale()
  const rawPathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()

  const pathname = normalizeUrlPath(rawPathname || '/')

  const displayName = (() => {
    const possible = (session?.user as { nickName?: string } | null)?.nickName || session?.user?.name
    return possible || 'USER'
  })()

  const email = session?.user?.email

  return (
    <aside
      className={clsx(
        'h-screen sticky border-r border-primary-800/70 bg-primary-950/40',
        'transition-[width] duration-300',
        { 'w-70': !collapsed, 'w-21 duration-500 ease-out': collapsed }
      )}
    >
      <div className="absolute left-full top-4 z-60 ">
        <SideBarToggle
          toggled={collapsed}
          onToggle={() => setCollapsed((prev) => !prev)}
          label={collapsed ? t('expand') : t('collapse')}
          icon={<RiArrowRightSLine size={25} />}
        />
      </div>
      <div className={clsx('flex h-full flex-col px-3 py-4', { 'overflow-hidden': !collapsed })}>
        <header className={clsx('flex', { 'justify-center': collapsed })}>
          <Logo collapsed={collapsed} />
        </header>
        <Separator className="my-4" />
        <nav className="flex flex-col gap-1">
          <SideBarNavItem
            href="/dashboard"
            icon={<RiHome4Line size={20} />}
            label={t('nav.dashboard')}
            collapsed={collapsed}
            active={pathname === '/dashboard' || pathname.startsWith('/dashboard/')}
          />
          <SideBarNavItem
            href="/modules"
            icon={<RiRoadMapLine size={20} />}
            label={t('nav.modules')}
            collapsed={collapsed}
            active={pathname === '/modules' || pathname.startsWith('/modules/')}
          />
          <SideBarNavItem
            href="/missions"
            icon={<RiFlagLine size={20} />}
            label={t('nav.missions')}
            collapsed={collapsed}
            active={pathname === '/missions' || pathname.startsWith('/missions/')}
          />
          <SideBarNavItem
            href="/daily"
            icon={<RiStarSmileLine size={20} />}
            label={t('nav.daily')}
            collapsed={collapsed}
            active={pathname === '/daily' || pathname.startsWith('/daily/')}
          />
          <SideBarNavItem
            href="/editor"
            icon={<RiCodeBoxLine size={20} />}
            label={t('nav.editor')}
            collapsed={collapsed}
            active={pathname === '/editor' || pathname.startsWith('/editor/')}
          />
          <SideBarNavItem
            href="/generator"
            icon={<RiRobot2Line size={20} />}
            label={t('nav.generator')}
            collapsed={collapsed}
            active={pathname === '/generator' || pathname.startsWith('/generator/')}
          />
          <SideBarNavItem
            href="/ranking"
            icon={<RiTrophyLine size={20} />}
            label={t('nav.ranking')}
            collapsed={collapsed}
            active={pathname === '/ranking' || pathname.startsWith('/ranking/')}
          />
        </nav>
        <div className="mt-auto">
          <Separator className="my-4" />
          <section className="mb-3">
            {collapsed ? (
              <Tooltip content={t('profile')} side="right" variant="muted">
                <Avatar size="md" tone="secondary" userName={displayName} src={session?.user?.image} />
              </Tooltip>
            ) : (
              <div
                className="flex w-full cursor-pointer items-center gap-3 rounded-2xl border border-primary-800/70 bg-primary-950/50 p-3 text-left hover:bg-snowWhite-50/5"
                onClick={() => router.push('/profile')}
              >
                <Avatar size="md" tone="secondary" userName={displayName} src={session?.user?.image} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-snowWhite-50">{displayName}</p>
                  {email && <p className="truncate text-xs text-snowWhite-300">{email}</p>}
                </div>
              </div>
            )}
          </section>
          <Tooltip content={t('logout')} side="right" variant="muted" className="w-full" disabled={!collapsed}>
            <Button
              type="button"
              variant="ghost"
              size="md"
              round="lg"
              className="w-full text-nowrap"
              leftIcon={<RiLogoutBoxLine size={18} />}
              onClick={async () => {
                await signOut({ callbackUrl: `/${locale}/login` })
              }}
            >
              {!collapsed && t('logout')}
            </Button>
          </Tooltip>
        </div>
      </div>
    </aside>
  )
}

export default SideBar
