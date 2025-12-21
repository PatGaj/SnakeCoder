'use client'

import { useTranslations } from 'next-intl'
import { RiArrowRightLine, RiLoginBoxLine } from 'react-icons/ri'

import { Badge, Box, Button } from '@/components'
import { useRouter } from '@/i18n/navigation'

import LearningRange from './LearningRange'

const CtaSection = () => {
  const t = useTranslations('landing')
  const router = useRouter()

  return (
    <section id="start" className="scroll-mt-28">
      <Box variant="glass" size="xl" round="3xl" className="relative w-full overflow-hidden border-primary-800/70">
        <div className="pointer-events-none absolute -right-14 -top-14 h-64 w-64 rounded-full bg-secondary-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-aquaBlue-500/10 blur-3xl" />
        <div className="relative grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{t('cta.badge')}</Badge>
              <Badge variant="muted">
                <LearningRange />
              </Badge>
            </div>
            <h3 className="text-2xl font-semibold text-snowWhite-50 md:text-3xl">{t('cta.title')}</h3>
            <p className="text-sm text-snowWhite-300 md:text-base">{t('cta.subtitle')}</p>
          </div>
          <div className="flex flex-col gap-3">
            <Button
              variant="gradient"
              size="xl"
              round="lg"
              className="w-full"
              rightIcon={<RiArrowRightLine size={18} />}
              onClick={() => router.push('/register')}
            >
              {t('cta.primaryCta')}
            </Button>
            <Button
              variant="ghost"
              size="xl"
              round="lg"
              className="w-full border border-primary-800/70"
              leftIcon={<RiLoginBoxLine size={18} />}
              onClick={() => router.push('/login')}
            >
              {t('cta.secondaryCta')}
            </Button>
            <p className="text-center text-xs text-snowWhite-300">{t('cta.note')}</p>
          </div>
        </div>
      </Box>
    </section>
  )
}

export default CtaSection
