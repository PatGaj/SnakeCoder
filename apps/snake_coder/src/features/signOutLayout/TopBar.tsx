'use client'

import { useTranslations } from 'next-intl'

import { Button } from '@/components'
import Logo from '@/components/logo/Logo'
import { usePathname, useRouter } from '@/i18n/navigation'
import { normalizeUrlPath } from '@/lib/normalize'

const TopBar = () => {
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations('signOutLayout')

  const normalizedPath = normalizeUrlPath(pathname || '/')
  const isLoginPage = normalizedPath === '/login'

  return (
    <header className="sticky top-0 z-30 w-full border-b border-primary-800/60 bg-primary-950/75 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[1920px] flex-wrap items-center gap-3 px-6 py-4 md:flex-nowrap md:gap-5 md:px-12">
        <Logo />
        <Button
          variant={isLoginPage ? 'gradient' : 'glow'}
          size="sm"
          round="lg"
          className="ml-auto min-w-[120px] md:ml-auto"
          disabled={isLoginPage}
          onClick={() => {
            if (!isLoginPage) router.push('/login')
          }}
        >
          {t('login')}
        </Button>
      </div>
    </header>
  )
}

export default TopBar
