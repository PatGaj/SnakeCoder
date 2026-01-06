import { useTranslations } from 'next-intl'
import { RiArrowRightLine, RiRoadMapLine } from 'react-icons/ri'

import { Badge, Box, Button, Separator } from '@/components'

export type NoSprintCardProps = {
  onGoToModules: () => void
}

const NoSprintCard: React.FC<NoSprintCardProps> = ({ onGoToModules }) => {
  const t = useTranslations('dashboard')

  return (
    <Box variant="glass" size="lg" round="2xl" className="relative w-full overflow-hidden border-primary-800/70">
      <div className="pointer-events-none absolute -left-10 -top-16 h-56 w-56 rounded-full bg-secondary-500/12 blur-3xl" />
      <div className="pointer-events-none absolute -right-10 -bottom-16 h-56 w-56 rounded-full bg-aquaBlue-500/10 blur-3xl" />

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary-300">{t('empty.badge')}</p>
          <p className="mt-2 text-base font-semibold text-snowWhite-50">{t('empty.title')}</p>
          <p className="mt-1 text-sm text-snowWhite-300">{t('empty.desc')}</p>
        </div>
        <Badge variant="muted" className="px-3 py-1">
          <span className="inline-flex items-center gap-2">
            <RiRoadMapLine size={16} className="text-secondary-400" />
            {t('empty.badgeHint')}
          </span>
        </Badge>
      </div>

      <Separator className="my-4" />

      <Button
        variant="gradient"
        size="md"
        round="lg"
        className="w-full"
        rightIcon={<RiArrowRightLine size={18} />}
        onClick={onGoToModules}
      >
        {t('empty.cta')}
      </Button>
    </Box>
  )
}

export default NoSprintCard

