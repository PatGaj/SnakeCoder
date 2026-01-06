import { useTranslations } from 'next-intl'
import { RiArrowLeftLine, RiCheckLine, RiTimeLine } from 'react-icons/ri'

import { Badge, Button } from '@/components'

export type ArticleHeaderData = {
  title: string
  desc: string
  readTimeMinutes: number
  tags: string[]
}

export type ArticleHeaderProps = {
  header: ArticleHeaderData
  onBack: () => void
  onMarkRead: () => void
  markReadLoading?: boolean
}

const ArticleHeader: React.FC<ArticleHeaderProps> = ({ header, onBack, onMarkRead, markReadLoading }) => {
  const t = useTranslations('article')

  return (
    <header className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="px-3 py-1 text-nightBlack-900">
            {t('badge')}
          </Badge>
          <Badge variant="muted" className="px-3 py-1">
            <span className="inline-flex items-center gap-2 text-snowWhite-200">
              <RiTimeLine size={16} className="text-secondary-300" />
              {t('meta.readTime', { minutes: header.readTimeMinutes })}
            </span>
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="md"
            round="lg"
            className="border border-primary-800/70"
            leftIcon={<RiArrowLeftLine size={18} />}
            onClick={onBack}
          >
            {t('actions.back')}
          </Button>
          <Button
            type="button"
            variant="gradient"
            size="md"
            round="lg"
            leftIcon={<RiCheckLine size={18} />}
            loading={markReadLoading}
            onClick={onMarkRead}
          >
            {t('actions.markRead')}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-snowWhite-50">{header.title}</h1>
        <p className="max-w-3xl text-sm text-snowWhite-300 md:text-base">{header.desc}</p>
      </div>

      {header.tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {header.tags.map((tag) => (
            <Badge key={tag} variant="muted" size="sm" className="px-3 py-1">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </header>
  )
}

export default ArticleHeader
