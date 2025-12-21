import { useTranslations } from 'next-intl'
import { RiCheckDoubleLine, RiCodeSSlashLine, RiSendPlane2Line } from 'react-icons/ri'

import LandingCard from './LandingCard'
import SectionHeader from './SectionHeader'

const HowItWorksSection = () => {
  const t = useTranslations('landing')

  return (
    <section id="how-it-works" className="scroll-mt-28">
      <SectionHeader title={t('how.title')} subtitle={t('how.subtitle')} />
      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <LandingCard
          icon={<RiCodeSSlashLine className="text-secondary-400" size={20} />}
          title={t('how.steps.pick.title')}
          desc={t('how.steps.pick.desc')}
          right="01"
        />
        <LandingCard
          icon={<RiSendPlane2Line className="text-secondary-400" size={20} />}
          title={t('how.steps.solve.title')}
          desc={t('how.steps.solve.desc')}
          right="02"
        />
        <LandingCard
          icon={<RiCheckDoubleLine className="text-secondary-400" size={20} />}
          title={t('how.steps.feedback.title')}
          desc={t('how.steps.feedback.desc')}
          right="03"
        />
      </div>
    </section>
  )
}

export default HowItWorksSection

