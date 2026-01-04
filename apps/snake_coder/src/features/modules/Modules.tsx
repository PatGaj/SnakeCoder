'use client'

import { useTranslations } from 'next-intl'

import { useRouter } from '@/i18n/navigation'

import ModuleCard from './moduleCard'
import useModules from './useModules'

const Modules = () => {
  const t = useTranslations('modules')
  const router = useRouter()
  const { modules } = useModules()
  const certificationModules = modules.filter((module) => module.category === 'certifications')
  const libraryModules = modules.filter((module) => module.category === 'libraries')

  return (
    <main className="mx-auto max-w-400 px-6 py-10 space-y-8 md:px-12">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary-300">{t('badge')}</p>
        <h1 className="text-3xl font-semibold text-snowWhite-50">{t('title')}</h1>
        <p className="max-w-2xl text-sm text-snowWhite-300 md:text-base">{t('subtitle')}</p>
      </header>

      <section className="space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary-300">{t('sections.certifications.title')}</p>
          <p className="max-w-2xl text-sm text-snowWhite-300 md:text-base">{t('sections.certifications.subtitle')}</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {certificationModules.map((module) => (
            <ModuleCard key={module.id} module={module} onOpen={() => router.push(module.route)} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary-300">{t('sections.libraries.title')}</p>
          <p className="max-w-2xl text-sm text-snowWhite-300 md:text-base">{t('sections.libraries.subtitle')}</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {libraryModules.map((module) => (
            <ModuleCard key={module.id} module={module} onOpen={() => router.push(module.route)} />
          ))}
        </div>
      </section>
    </main>
  )
}
export default Modules
