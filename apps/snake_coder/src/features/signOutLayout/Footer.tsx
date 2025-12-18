import { useTranslations } from 'next-intl'

const Footer = () => {
  const t = useTranslations('signOutLayout')

  return (
    <footer className="mt-12 w-full border-t border-primary-800/70 bg-primary-950/70 py-6">
      <div className="mx-auto flex w-full max-w-[1920px] flex-wrap items-center justify-between gap-3 px-6 text-sm text-primary-200 md:px-12">
        <span>© {new Date().getFullYear()} SnakeCoder</span>
        <div className="flex flex-wrap items-center gap-4 text-xs text-primary-300">
          <span>{t('missions')}</span>
          <span>{t('feedback')}</span>
          <span>{t('noLongCourses')}</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
