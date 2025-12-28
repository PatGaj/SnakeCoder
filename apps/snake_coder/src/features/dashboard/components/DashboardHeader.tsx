import { useTranslations } from 'next-intl'

import { Badge } from '@/components'

export type DashboardHeaderProps = {
  name: string
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ name }) => {
  const t = useTranslations('dashboard')

  return (
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="secondary" className="px-3 py-1 text-nightBlack-900">
            {t('badge')}
          </Badge>
          <span className="text-sm text-snowWhite-300">{t('hint')}</span>
        </div>
        <h1 className="text-2xl font-semibold text-snowWhite-50 md:text-3xl">{t('title', { name })}</h1>
        <p className="max-w-2xl text-sm text-snowWhite-300 md:text-base">{t('subtitle')}</p>
      </div>
    </header>
  )
}

export default DashboardHeader
