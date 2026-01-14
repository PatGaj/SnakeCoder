import { useLocale, useTranslations } from 'next-intl'
import { RiCalendar2Line, RiLockUnlockLine } from 'react-icons/ri'

import { Badge, Box, Separator } from '@/components'

export type ProfileUnlockedModuleData = {
  id: string
  code: string
  title: string
  unlockedAt: string | null
  completedAt?: string | null
}

export type ProfileUnlockedModulesCardProps = {
  modules: ProfileUnlockedModuleData[]
}

const formatDate = (locale: string, value: string | null) => {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return new Intl.DateTimeFormat(locale, { year: 'numeric', month: '2-digit', day: '2-digit' }).format(date)
}

const ProfileUnlockedModulesCard: React.FC<ProfileUnlockedModulesCardProps> = ({ modules }) => {
  const t = useTranslations('profile')
  const locale = useLocale()

  return (
    <Box variant="glass" size="lg" round="2xl" className="relative w-full overflow-hidden border-primary-800/70">
      <div className="pointer-events-none absolute -left-10 -top-14 h-56 w-56 rounded-full bg-secondary-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-14 -bottom-14 h-56 w-56 rounded-full bg-aquaBlue-500/10 blur-3xl" />

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary-300">{t('sections.modules')}</p>
          <p className="text-sm text-snowWhite-300">{t('modules.subtitle')}</p>
        </div>
        <Badge variant="muted" size="sm" className="px-3 py-1">
          <span className="inline-flex items-center gap-2 text-snowWhite-200">
            <RiLockUnlockLine size={16} className="text-secondary-300" />
            {t('modules.count', { count: modules.length })}
          </span>
        </Badge>
      </div>

      <Separator className="my-4 bg-primary-800/70" />

      {modules.length === 0 ? (
        <p className="text-sm text-snowWhite-300">{t('modules.empty')}</p>
      ) : (
        <div className="space-y-3">
          {modules.map((module) => {
            const unlockedAt = formatDate(locale, module.unlockedAt)
            const completedAt = formatDate(locale, module.completedAt ?? null)

            return (
              <div
                key={module.id}
                className="flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-primary-800/70 bg-primary-950/40 px-4 py-3"
              >
                <div className="min-w-0 space-y-1">
                  <p className="text-sm font-semibold text-snowWhite-50">
                    <span className="text-secondary-300">{module.code}</span> — {module.title}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-snowWhite-300">
                    <span className="inline-flex items-center gap-2">
                      <RiCalendar2Line size={14} className="text-secondary-300" />
                      {t('modules.unlockedAt', { date: unlockedAt ?? '—' })}
                    </span>
                    {completedAt && (
                      <span className="inline-flex items-center gap-2">
                        <span className="h-1 w-1 rounded-full bg-primary-700" />
                        {t('modules.completedAt', { date: completedAt })}
                      </span>
                    )}
                  </div>
                </div>

                <Badge variant="muted" size="sm" className="px-3 py-1">
                  {module.code}
                </Badge>
              </div>
            )
          })}
        </div>
      )}
    </Box>
  )
}

export default ProfileUnlockedModulesCard

