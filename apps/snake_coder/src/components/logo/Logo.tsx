import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'

const Logo = () => {
  const t = useTranslations('logo')

  return (
    <div>
      <Link href="/landing" className="group flex items-center gap-3 transition-transform hover:-translate-y-0.5">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-linear-to-br from-secondary-500 to-primary-600 text-lg font-extrabold text-nightBlack-900 shadow-[0_12px_30px_#0b1e488c]">
          SC
        </span>
        <div className="flex flex-col leading-tight">
          <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-secondary-300">SnakeCoder</span>
          <span className="text-base font-semibold text-snowWhite-50 transition-colors group-hover:text-secondary-100">
            {t('banerText')}
          </span>
        </div>
      </Link>
    </div>
  )
}

export default Logo
