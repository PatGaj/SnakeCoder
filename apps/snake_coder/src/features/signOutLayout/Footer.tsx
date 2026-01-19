import { useTranslations } from 'next-intl'

const Footer = () => {
  const t = useTranslations('signOutLayout')

  return (
    <footer className="w-full border-t border-primary-800/70 bg-primary-950/70 py-3">
      <div className="mx-auto flex w-full max-w-480 flex-wrap items-center justify-center gap-3 px-6 text-center text-sm text-primary-200 md:px-12 lg:justify-between lg:text-left">
        <span>© 2026 SnakeCoder</span>
        <div className="hidden flex-wrap items-center gap-4 text-xs text-primary-300 lg:flex">
          <span>{t('missions')}</span>
          <span>{t('feedback')}</span>
          <span>{t('noLongCourses')}</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
