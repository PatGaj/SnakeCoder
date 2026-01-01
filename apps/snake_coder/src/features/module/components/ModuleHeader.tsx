import Image from 'next/image'
import { useTranslations } from 'next-intl'

import { Box } from '@/components'

export type ModuleHeaderData = {
  id: string
  title: string
  desc: string
  status: 'available' | 'locked' | 'building' | 'completed'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  progressPercent: number
  sprintsDone: number
  sprintsTotal: number
}

export type ModuleHeaderProps = {
  module: ModuleHeaderData
}

const ModuleHeader: React.FC<ModuleHeaderProps> = ({ module }) => {
  const t = useTranslations('module')
  const tModules = useTranslations('modules')

  return (
    <Box variant="glass" size="xl" round="3xl" className="w-full border-primary-800/70">
      <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-stretch">
        <div className="min-w-0 space-y-2 lg:self-center">
          <p className="text-3xl font-semibold text-snowWhite-50">{module.title}</p>
          <p className="max-w-3xl text-sm text-snowWhite-300 md:text-base">{module.desc}</p>
          {module.sprintsTotal > 0 && (
            <p className="text-xs text-snowWhite-300">
              {t('header.progress', { done: module.sprintsDone, total: module.sprintsTotal })}
            </p>
          )}
        </div>
        <div className="relative w-full overflow-hidden rounded-2xl border border-primary-800/70 bg-primary-950/45 lg:self-stretch">
          <div className="relative h-44 w-full lg:h-full">
            <Image
              src="/images/python-image.png"
              alt={tModules('card.imageAlt')}
              fill
              sizes="(max-width: 1024px) 100vw, 320px"
              className="object-contain p-5 opacity-95"
              priority
            />
          </div>
        </div>
      </div>
    </Box>
  )
}

export default ModuleHeader
