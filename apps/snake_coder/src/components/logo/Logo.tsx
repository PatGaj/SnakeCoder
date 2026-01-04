import type React from 'react'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'

type LogoProps = {
  collapsed?: boolean
}

const Logo: React.FC<LogoProps> = ({ collapsed = false }) => {
  const t = useTranslations('logo')

  if (collapsed) {
    return (
      <Link
        href="/landing"
        className="grid h-11 w-11 place-items-center rounded-xl bg-linear-to-br from-secondary-500 to-primary-600 text-lg font-extrabold text-nightBlack-900 shadow-[0_12px_30px_#0b1e488c]"
        aria-label="SnakeCoder"
      >
        SC
      </Link>
    )
  }

  return (
    <div>
      <Link
        href="/landing"
        className="group flex min-w-0 items-center gap-3 transition-transform hover:-translate-y-0.5"
      >
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-linear-to-br from-secondary-500 to-primary-600 text-lg font-extrabold text-nightBlack-900 shadow-[0_12px_30px_#0b1e488c]">
          SC
        </span>
        <div className="flex min-w-0 flex-col leading-tight">
          <span className="truncate text-[10px] font-semibold uppercase tracking-[0.32em] text-secondary-300">
            SnakeCoder
          </span>
          <span className="truncate text-base font-semibold text-snowWhite-50 transition-colors group-hover:text-secondary-100">
            {t('banerText')}
          </span>
        </div>
      </Link>
    </div>
  )
}

export default Logo
