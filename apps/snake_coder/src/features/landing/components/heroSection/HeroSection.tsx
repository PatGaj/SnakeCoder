'use client'

import { useTranslations } from 'next-intl'
import { RiArrowRightLine, RiFlashlightLine, RiGamepadLine, RiSparkling2Line } from 'react-icons/ri'

import { Badge, Box, Button, CodeBlock, Separator } from '@/components'
import { useRouter } from '@/i18n/navigation'

import LearningRange from '../LearningRange'
import HeroPoint from './HeroPoint'
import PreviewTag from './PreviewTag'

const HeroSection = () => {
  const t = useTranslations('landing')
  const router = useRouter()

  const codeSnippet = `def is_even(n: int) -> bool:
    return n % 2 == 0
`

  return (
    <section className="relative">
      <div className="pointer-events-none absolute -right-10 top-10 h-64 w-64 rounded-full bg-aquaBlue-500/10 blur-3xl" />
      <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">
              <LearningRange />
            </Badge>
            <Badge variant="muted">{t('hero.badge2')}</Badge>
          </div>
          <h1 className="text-3xl font-semibold leading-tight text-snowWhite-50 md:text-5xl">
            {t.rich('hero.title', {
              highlight: (chunks) => (
                <span className="bg-linear-to-r from-secondary-400 via-aquaBlue-400 to-primary-200 bg-clip-text text-transparent">
                  {chunks}
                </span>
              ),
            })}
          </h1>
          <p className="max-w-2xl text-sm text-snowWhite-300 md:text-base">{t('hero.subtitle')}</p>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="gradient"
              size="lg"
              round="lg"
              rightIcon={<RiArrowRightLine size={18} />}
              onClick={() => router.push('/register')}
            >
              {t('hero.primaryCta')}
            </Button>
            <Button
              variant="muted"
              size="lg"
              round="lg"
              onClick={() =>
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }
            >
              {t('hero.secondaryCta')}
            </Button>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            <HeroPoint
              icon={<RiFlashlightLine className="mt-0.5 text-secondary-400" size={18} />}
              title={t('hero.points.missions.title')}
              desc={t('hero.points.missions.desc')}
            />
            <HeroPoint
              icon={<RiGamepadLine className="mt-0.5 text-secondary-400" size={18} />}
              title={t('hero.points.gamification.title')}
              desc={t('hero.points.gamification.desc')}
            />
            <HeroPoint
              className="sm:col-span-2"
              icon={<RiSparkling2Line className="mt-0.5 text-secondary-400" size={18} />}
              title={t('hero.points.llm.title')}
              desc={t('hero.points.llm.desc')}
            />
          </ul>
        </div>
        <Box variant="glass" size="lg" round="2xl" className="w-full border-primary-800/70">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{t('hero.preview.badge')}</Badge>
              <Badge variant="outline">{t('hero.preview.level')}</Badge>
            </div>
            <Badge variant="muted">{t('hero.preview.timer')}</Badge>
          </div>
          <p className="mt-4 text-sm text-snowWhite-300">{t('hero.preview.desc')}</p>
          <CodeBlock className="mt-4" title={t('hero.preview.snippetTitle')} code={codeSnippet} />
          <Separator className="my-5" />
          <div className="grid gap-3 sm:grid-cols-3">
            <PreviewTag title={t('hero.preview.tags.tests')} desc={t('hero.preview.tags.testsDesc')} />
            <PreviewTag title={t('hero.preview.tags.style')} desc={t('hero.preview.tags.styleDesc')} />
            <PreviewTag title={t('hero.preview.tags.ai')} desc={t('hero.preview.tags.aiDesc')} />
          </div>
        </Box>
      </div>
    </section>
  )
}

export default HeroSection

