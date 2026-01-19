import { useTranslations } from 'next-intl'
import { RiRoadMapLine } from 'react-icons/ri'

import SectionHeader from '../SectionHeader'
import PathCard from './PathCard'
import TopicChip from './TopicChip'

const LearningPathsSection = () => {
  const t = useTranslations('landing')

  return (
    <section id="paths" className="scroll-mt-28">
      <SectionHeader title={t('paths.title')} subtitle={t('paths.subtitle')} />
      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <PathCard
          badgeText={t('paths.pcep.badge')}
          tagText={t('paths.pcep.tag')}
          title={t('paths.pcep.title')}
          desc={t('paths.pcep.desc')}
          icon={<RiRoadMapLine className="text-secondary-400" size={20} />}
        >
          <TopicChip>{t('paths.pcep.topics.syntax')}</TopicChip>
          <TopicChip>{t('paths.pcep.topics.types')}</TopicChip>
          <TopicChip>{t('paths.pcep.topics.flow')}</TopicChip>
          <TopicChip>{t('paths.pcep.topics.functions')}</TopicChip>
          <TopicChip>{t('paths.pcep.topics.collections')}</TopicChip>
        </PathCard>
      </div>
    </section>
  )
}

export default LearningPathsSection
