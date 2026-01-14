import { useTranslations } from 'next-intl'
import { RiAwardLine, RiQuestionAnswerLine, RiTimerLine } from 'react-icons/ri'

import { Badge, Box, Progressbar, Separator } from '@/components'

export type QuizHeaderData = {
  title: string
  desc: string
  xp: number
  passPercent: number
}

export type QuizHeaderProps = {
  header: QuizHeaderData
  current: number
  total: number
  answered: number
  timeLeftLabel?: string
  isTimeWarning?: boolean
}

const QuizHeader: React.FC<QuizHeaderProps> = ({ header, current, total, answered, timeLeftLabel, isTimeWarning }) => {
  const t = useTranslations('quiz')
  const percent = total > 0 ? Math.round((current / total) * 100) : 0

  return (
    <Box variant="glass" size="xl" round="3xl" className="w-full border-primary-800/70">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary-300">{t('badge')}</p>
          <h1 className="text-2xl font-semibold text-snowWhite-50 md:text-3xl">{header.title}</h1>
          <p className="max-w-2xl text-sm text-snowWhite-300 md:text-base">{header.desc}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="muted" size="sm" className="px-3 py-1">
            <span className="inline-flex items-center gap-2">
              <RiQuestionAnswerLine size={16} className="text-secondary-300" />
              {t('meta.answered', { answered, total })}
            </span>
          </Badge>
          <Badge variant="muted" size="sm" className="px-3 py-1">
            <span className="inline-flex items-center gap-2">
              <RiAwardLine size={16} className="text-secondary-300" />
              {t('meta.pass', { percent: header.passPercent })}
            </span>
          </Badge>
          {timeLeftLabel && (
            <Badge variant={isTimeWarning ? 'warning' : 'muted'} size="sm" className="px-3 py-1">
              <span className="inline-flex items-center gap-2">
                <RiTimerLine size={16} className={isTimeWarning ? 'text-nightBlack-900' : 'text-secondary-300'} />
                {t('meta.time', { time: timeLeftLabel })}
              </span>
            </Badge>
          )}
          <Badge variant="secondary" size="sm" className="px-3 py-1">
            {t('meta.xp', { xp: header.xp })}
          </Badge>
        </div>
      </div>

      <Separator className="my-5 bg-primary-800/70" />

      <Progressbar value={percent} max={100} showValue label={t('progress', { current, total })} />
    </Box>
  )
}

export default QuizHeader
