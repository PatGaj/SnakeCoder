import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import { RiCheckboxCircleLine, RiCloseCircleLine } from 'react-icons/ri'

import { Badge, Box, Button, ItemRow, Separator } from '@/components'

export type SkillTestRequirement = {
  id: 'tasks' | 'article' | 'quiz'
  done: boolean
  meta: string
}

export type SkillTestCardData = {
  ready: boolean
  requirements: SkillTestRequirement[]
  route: string
}

export type SkillTestCardProps = {
  skillTest: SkillTestCardData
  onGoToTest: () => void
}

const SkillTestCard: React.FC<SkillTestCardProps> = ({ skillTest, onGoToTest }) => {
  const t = useTranslations('dashboard')

  return (
    <Box variant="glass" size="lg" round="2xl" className="w-full border-primary-800/70">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary-300">{t('skillTest.title')}</p>
          <p className="mt-2 text-sm text-snowWhite-300">{t('skillTest.desc')}</p>
        </div>
        <Badge variant={skillTest.ready ? 'success' : 'muted'} className="px-3 py-1">
          {skillTest.ready ? t('common.unlocked') : t('common.locked')}
        </Badge>
      </div>

      <Separator className="my-4" />

      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-snowWhite-200/70">
        {t('skillTest.requirementsTitle')}
      </p>

      <div className="mt-3 grid gap-2">
        {skillTest.requirements.map((req) => (
          <ItemRow
            key={req.id}
            className={clsx(req.done ? 'border-secondary-500/30' : 'border-primary-800/70')}
            icon={
              req.done ? (
                <RiCheckboxCircleLine className="text-secondary-400" size={18} />
              ) : (
                <RiCloseCircleLine className="text-snowWhite-400/60" size={18} />
              )
            }
            label={t(`skillTest.requirements.${req.id}`)}
            right={
              <Badge variant={req.done ? 'success' : 'muted'} className="px-2 py-0.5">
                {req.meta}
              </Badge>
            }
          />
        ))}
      </div>

      <Separator className="my-4" />

      <Button
        variant="gradient"
        size="md"
        round="lg"
        className="w-full"
        disabled={!skillTest.ready}
        onClick={onGoToTest}
      >
        {t('skillTest.cta')}
      </Button>
    </Box>
  )
}

export default SkillTestCard
