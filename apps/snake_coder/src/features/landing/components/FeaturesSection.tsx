import { useTranslations } from 'next-intl'
import { RiBookOpenLine, RiFlaskLine, RiGamepadLine, RiRadarLine, RiRobot3Line, RiStackLine } from 'react-icons/ri'

import LandingCard from './LandingCard'
import SectionHeader from './SectionHeader'

const FeaturesSection = () => {
  const t = useTranslations('landing')

  return (
    <section id="features" className="scroll-mt-28">
      <SectionHeader title={t('features.title')} subtitle={t('features.subtitle')} />
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <LandingCard
          icon={<RiRadarLine className="text-secondary-400" size={20} />}
          title={t('features.items.missions.title')}
          desc={t('features.items.missions.desc')}
        />
        <LandingCard
          icon={<RiRobot3Line className="text-secondary-400" size={20} />}
          title={t('features.items.llm.title')}
          desc={t('features.items.llm.desc')}
        />
        <LandingCard
          icon={<RiFlaskLine className="text-secondary-400" size={20} />}
          title={t('features.items.tests.title')}
          desc={t('features.items.tests.desc')}
        />
        <LandingCard
          icon={<RiGamepadLine className="text-secondary-400" size={20} />}
          title={t('features.items.gamification.title')}
          desc={t('features.items.gamification.desc')}
        />
        <LandingCard
          icon={<RiBookOpenLine className="text-secondary-400" size={20} />}
          title={t('features.items.pcepPcap.title')}
          desc={t('features.items.pcepPcap.desc')}
        />
        <LandingCard
          icon={<RiStackLine className="text-secondary-400" size={20} />}
          title={t('features.items.projects.title')}
          desc={t('features.items.projects.desc')}
        />
      </div>
    </section>
  )
}

export default FeaturesSection
