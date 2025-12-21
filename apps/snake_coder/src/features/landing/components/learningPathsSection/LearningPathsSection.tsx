import { useTranslations } from 'next-intl'
import { RiGraduationCapLine, RiRoadMapLine } from 'react-icons/ri'

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
          badgeText="PCEP"
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

        <PathCard
          badgeText="PCAP"
          tagText={t('paths.pcap.tag')}
          title={t('paths.pcap.title')}
          desc={t('paths.pcap.desc')}
          icon={<RiGraduationCapLine className="text-secondary-400" size={20} />}
        >
          <TopicChip>{t('paths.pcap.topics.oop')}</TopicChip>
          <TopicChip>{t('paths.pcap.topics.modules')}</TopicChip>
          <TopicChip>{t('paths.pcap.topics.exceptions')}</TopicChip>
          <TopicChip>{t('paths.pcap.topics.files')}</TopicChip>
          <TopicChip>{t('paths.pcap.topics.testing')}</TopicChip>
        </PathCard>
      </div>
    </section>
  )
}

export default LearningPathsSection
