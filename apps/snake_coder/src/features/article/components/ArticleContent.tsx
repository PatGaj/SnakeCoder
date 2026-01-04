import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import { RiInformationLine, RiLightbulbFlashLine, RiSparklingLine } from 'react-icons/ri'

import { Badge, Box, CodeBlock, Separator } from '@/components'

export type ArticleCalloutTone = 'info' | 'tip' | 'highlight'

export type ArticleBlock =
  | { type: 'heading'; id: string; level: 2 | 3; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'code'; title?: string; language: string; code: string }
  | { type: 'callout'; tone: ArticleCalloutTone; title: string; text: string }

export type ArticleContentData = {
  blocks: ArticleBlock[]
  summary: string[]
}

export type ArticleContentProps = {
  content: ArticleContentData
}

const CALLOUT_STYLE_BY_TONE: Record<ArticleCalloutTone, { icon: React.ReactNode; className: string }> = {
  info: {
    icon: <RiInformationLine size={18} className="text-aquaBlue-200" />,
    className: 'border-aquaBlue-400/25 bg-linear-to-br from-aquaBlue-500/10 to-primary-950/70',
  },
  tip: {
    icon: <RiLightbulbFlashLine size={18} className="text-mangoYellow-200" />,
    className: 'border-mangoYellow-400/25 bg-linear-to-br from-mangoYellow-500/10 to-primary-950/70',
  },
  highlight: {
    icon: <RiSparklingLine size={18} className="text-secondary-300" />,
    className: 'border-secondary-400/20 bg-linear-to-br from-secondary-500/10 to-primary-950/70',
  },
}

const ArticleContent: React.FC<ArticleContentProps> = ({ content }) => {
  const t = useTranslations('article')

  return (
    <Box variant="glass" size="xl" round="2xl" className="w-full border-primary-800/70">
      <div className="space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary-300">{t('content')}</p>
          <p className="mt-2 text-sm text-snowWhite-300">{t('contentHint')}</p>
        </div>

        <Separator className="bg-primary-800/70" />

        <div className="space-y-5">
          {content.blocks.map((block, index) => {
            if (block.type === 'heading') {
              const Tag = block.level === 2 ? 'h2' : 'h3'
              return (
                <Tag
                  key={`${block.type}-${block.id}-${index}`}
                  id={block.id}
                  className={clsx('scroll-mt-24 font-semibold text-snowWhite-50', {
                    'text-xl': block.level === 2,
                    'text-lg': block.level === 3,
                  })}
                >
                  {block.text}
                </Tag>
              )
            }

            if (block.type === 'paragraph') {
              return (
                <p key={`${block.type}-${index}`} className="text-sm leading-7 text-snowWhite-200">
                  {block.text}
                </p>
              )
            }

            if (block.type === 'list') {
              return (
                <ul key={`${block.type}-${index}`} className="list-disc space-y-1 pl-5 text-sm text-snowWhite-200">
                  {block.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )
            }

            if (block.type === 'code') {
              return (
                <CodeBlock
                  key={`${block.type}-${index}`}
                  title={block.title ?? `${block.language}`}
                  code={block.code}
                  className="border-primary-800/80 bg-primary-950/70"
                />
              )
            }

            const callout = CALLOUT_STYLE_BY_TONE[block.tone]
            return (
              <div
                key={`${block.type}-${index}`}
                className={clsx('rounded-2xl border px-4 py-3 shadow-[0_18px_42px_#00000084]', callout.className)}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="inline-flex items-center gap-2 text-sm font-semibold text-snowWhite-50">
                    {callout.icon}
                    {block.title}
                  </p>
                  <Badge variant="muted" size="sm" className="px-3 py-1">
                    {t(`callout.${block.tone}`)}
                  </Badge>
                </div>
                <p className="mt-2 text-sm leading-7 text-snowWhite-200">{block.text}</p>
              </div>
            )
          })}
        </div>

        {content.summary.length > 0 && (
          <>
            <Separator className="bg-primary-800/70" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary-300">{t('summary')}</p>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-snowWhite-200">
                {content.summary.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </Box>
  )
}

export default ArticleContent

