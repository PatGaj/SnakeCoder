import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import {
  RiArrowRightLine,
  RiBarChart2Line,
  RiCheckboxCircleLine,
  RiCoinsLine,
  RiInformationLine,
  RiLock2Line,
  RiToolsLine,
} from 'react-icons/ri'

import { Badge, Box, Button, Separator, Stepper } from '@/components'
import ModuleCardImage from './ModuleCardImage'

export type ModuleCardSprint = {
  id: string
  progressPercent: number
}

export type ModuleCardData = {
  id: string
  code: string
  title: string
  requirements: string[]
  desc: string
  progressPercent: number
  sprints: ModuleCardSprint[]
  sprintsDone: number
  sprintsTotal: number
  category: 'certifications' | 'libraries'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  locked: boolean
  building: boolean
  completed: boolean
  route: string
}

export type ModuleCardProps = {
  module: ModuleCardData
  onOpen: () => void
}

type AvailabilityKey = 'building' | 'locked' | 'completed' | 'available'

type CtaKey = 'building' | 'locked' | 'completed' | 'continue' | 'start'

type AvailabilityConfig = {
  variant: 'warning' | 'muted' | 'success' | 'secondary'
  icon: React.ReactNode
}

const availabilityConfigByKey: Record<AvailabilityKey, AvailabilityConfig> = {
  building: { variant: 'warning', icon: <RiToolsLine size={16} /> },
  locked: { variant: 'muted', icon: <RiLock2Line size={16} /> },
  completed: { variant: 'success', icon: <RiCheckboxCircleLine size={16} /> },
  available: { variant: 'secondary', icon: <RiCheckboxCircleLine size={16} /> },
}

const difficultyVariantByDifficulty: Record<ModuleCardData['difficulty'], 'success' | 'warning' | 'danger'> = {
  beginner: 'success',
  intermediate: 'warning',
  advanced: 'danger',
}

const ModuleCard: React.FC<ModuleCardProps> = ({ module, onOpen }) => {
  const t = useTranslations('modules')

  const ui = (() => {
    const availabilityKey: AvailabilityKey = module.building
      ? 'building'
      : module.locked
        ? 'locked'
        : module.completed
          ? 'completed'
          : 'available'

    const ctaKey: CtaKey = module.building
      ? 'building'
      : module.locked
        ? 'locked'
        : module.completed
          ? 'completed'
          : module.progressPercent > 0
            ? 'continue'
            : 'start'

    const availabilityConfig = availabilityConfigByKey[availabilityKey]

    return {
      ctaLabel: t('card.cta', { state: ctaKey }),
      availability: {
        ...availabilityConfig,
        text: t(`card.${availabilityKey}` as any),
      },
      difficulty: {
        variant: difficultyVariantByDifficulty[module.difficulty],
        label: t(`card.difficulty.${module.difficulty}`),
      },
      imageState: availabilityKey === 'building' ? 'building' : availabilityKey === 'locked' ? 'locked' : 'available',
    } as const
  })()

  return (
    <Box
      variant="glass"
      size="xl"
      round="3xl"
      className="flex h-full w-full flex-col overflow-hidden border-primary-800/70"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Badge variant={ui.availability.variant} className="px-3 py-1">
          <span className="inline-flex items-center gap-2">
            <span className={clsx(ui.availability.variant === 'muted' ? 'text-snowWhite-200' : 'text-current')}>
              {ui.availability.icon}
            </span>
            {ui.availability.text}
          </span>
        </Badge>
        <Badge variant={ui.difficulty.variant} className="px-3 py-1">
          <span className="inline-flex items-center gap-2">
            <RiBarChart2Line size={16} />
            {ui.difficulty.label}
          </span>
        </Badge>
      </div>

      <p className="mt-3 text-xl font-semibold text-snowWhite-50">{module.title}</p>

      <ModuleCardImage src="/images/python-image.png" state={ui.imageState} className="mt-5" />

      <div className="mt-4 rounded-2xl border border-primary-800/70 bg-primary-950/45 px-4 py-3">
        <div className="flex items-center gap-2">
          <RiInformationLine size={16} className="text-secondary-300" />
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary-300">
            {t('card.requirementsTitle')}
          </p>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {module.requirements.map((item) => (
            <Badge key={item} variant="muted" size="sm" className="px-3 py-1 normal-case tracking-normal">
              {item}
            </Badge>
          ))}
        </div>
      </div>

      <p className="mt-4 text-sm text-snowWhite-300 md:text-base">{module.desc}</p>
      {!module.locked && !module.building && (
        <div className="mt-5">
          <Stepper
            steps={module.sprints.map((sprint) => ({ value: sprint.progressPercent }))}
            size="sm"
            variant="muted"
          />
        </div>
      )}

      <div className="mt-auto pt-6">
        {(module.locked || module.building) && <Separator className="mb-5" />}
        <div className={clsx('flex', !(module.locked || module.building) && 'justify-end')}>
          <Button
            variant={module.locked ? 'glow' : module.building ? 'muted' : 'gradient'}
            size="lg"
            round="lg"
            rightIcon={
              module.locked ? (
                <RiCoinsLine size={18} />
              ) : module.building ? (
                <RiLock2Line size={18} />
              ) : (
                <RiArrowRightLine size={18} />
              )
            }
            className="w-full"
            disabled={module.building}
            onClick={onOpen}
          >
            {ui.ctaLabel}
          </Button>
        </div>
      </div>
    </Box>
  )
}

export default ModuleCard
