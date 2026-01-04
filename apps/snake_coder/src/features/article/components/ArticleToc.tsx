import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import { RiListCheck2 } from 'react-icons/ri'

import { Box, Separator } from '@/components'

export type ArticleTocItem = {
  id: string
  label: string
  level: 2 | 3
}

export type ArticleTocProps = {
  items: ArticleTocItem[]
}

const ArticleToc: React.FC<ArticleTocProps> = ({ items }) => {
  const t = useTranslations('article')

  const handleNavigate = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault()
    const el = document.getElementById(id)
    if (!el) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' })
    window.history.replaceState(null, '', `#${id}`)
  }

  return (
    <Box
      variant="glass"
      size="lg"
      round="2xl"
      className="w-full border-primary-800/70 sticky top-6 self-start max-h-[calc(100vh-6rem)] flex flex-col"
    >
      <div className="flex items-center gap-2">
        <RiListCheck2 size={18} className="text-secondary-300" />
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary-300">{t('toc')}</p>
      </div>
      <Separator className="my-4 bg-primary-800/70" />
      {items.length === 0 ? (
        <p className="text-sm text-snowWhite-300">{t('tocEmpty')}</p>
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-primary-800/70 scrollbar-track-transparent">
          <nav className="space-y-1">
            {items.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(event) => handleNavigate(event, item.id)}
                className={clsx(
                  'block rounded-lg border border-transparent px-3 py-2 text-sm text-snowWhite-200',
                  'hover:bg-snowWhite-50/5 hover:border-primary-800/70',
                  { 'pl-8': item.level === 3 }
                )}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </Box>
  )
}

export default ArticleToc
