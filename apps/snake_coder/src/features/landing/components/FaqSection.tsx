import { useTranslations } from 'next-intl'
import { RiQuestionLine } from 'react-icons/ri'

import LandingCard from './LandingCard'
import SectionHeader from './SectionHeader'

const FaqSection = () => {
  const t = useTranslations('landing')

  return (
    <section id="faq" className="scroll-mt-28">
      <SectionHeader title={t('faq.title')} subtitle={t('faq.subtitle')} />
      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <LandingCard
          icon={<RiQuestionLine className="text-secondary-400" size={20} />}
          title={t('faq.items.ai.q')}
          desc={t('faq.items.ai.a')}
          bodyClassName="space-y-2"
        />
        <LandingCard
          icon={<RiQuestionLine className="text-secondary-400" size={20} />}
          title={t('faq.items.pcepPcap.q')}
          desc={t('faq.items.pcepPcap.a')}
          bodyClassName="space-y-2"
        />
        <LandingCard
          icon={<RiQuestionLine className="text-secondary-400" size={20} />}
          title={t('faq.items.time.q')}
          desc={t('faq.items.time.a')}
          bodyClassName="space-y-2"
        />
        <LandingCard
          icon={<RiQuestionLine className="text-secondary-400" size={20} />}
          title={t('faq.items.level.q')}
          desc={t('faq.items.level.a')}
          bodyClassName="space-y-2"
        />
      </div>
    </section>
  )
}

export default FaqSection

