import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import { RiCheckLine, RiCloseLine, RiRefreshLine } from 'react-icons/ri'

import { Badge, Button, Modal, Separator } from '@/components'

export type QuizResultItem = {
  id: string
  title: string
  prompt: string
  selectedLabel: string | null
  isCorrect: boolean
}

export type QuizResultModalProps = {
  open: boolean
  onClose: () => void
  score: number
  total: number
  passPercent: number
  items: QuizResultItem[]
  onRestart: () => void
}

const QuizResultModal: React.FC<QuizResultModalProps> = ({
  open,
  onClose,
  score,
  total,
  passPercent,
  items,
  onRestart,
}) => {
  const t = useTranslations('quiz')
  const percent = total > 0 ? Math.round((score / total) * 100) : 0
  const passed = percent >= passPercent

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary-300">{t('results.title')}</p>
          <div className="flex items-center gap-2">
            <p className="text-lg font-semibold text-snowWhite-50">{t('results.score', { score, total })}</p>
            <Badge variant={passed ? 'success' : 'danger'} size="sm" className="px-3 py-1">
              <span className="inline-flex items-center gap-2">
                {passed ? <RiCheckLine size={16} /> : <RiCloseLine size={16} />}
                {passed ? t('results.passed') : t('results.failed')}
              </span>
            </Badge>
          </div>
          <p className={clsx('text-sm', passed ? 'text-jadeGreen-200' : 'text-chiliRed-200')}>
            {t('results.percent', { percent })}
          </p>
        </div>
      }
      footer={
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button variant="ghost" round="lg" className="w-full sm:w-auto" onClick={onClose} type="button">
            {t('actions.close')}
          </Button>
          <Button
            variant="muted"
            round="lg"
            className="w-full sm:w-auto"
            leftIcon={<RiRefreshLine size={18} />}
            onClick={onRestart}
            type="button"
          >
            {t('actions.restart')}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary-300">{t('results.details')}</p>
        <Separator className="bg-primary-800/70" />
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className={clsx('rounded-2xl border p-4', {
                'border-jadeGreen-500/40 bg-jadeGreen-500/10': item.isCorrect,
                'border-chiliRed-500/40 bg-chiliRed-500/10': !item.isCorrect,
              })}
            >
              <div className="flex items-start gap-3">
                {item.isCorrect ? (
                  <RiCheckLine size={18} className="mt-0.5 shrink-0 text-jadeGreen-300" />
                ) : (
                  <RiCloseLine size={18} className="mt-0.5 shrink-0 text-chiliRed-300" />
                )}
                <div className="min-w-0 space-y-1">
                  <p className="text-sm font-semibold text-snowWhite-50">{item.title}</p>
                  <p className="text-xs text-snowWhite-300">{item.prompt}</p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-snowWhite-300">{t('results.yourAnswer')}</p>
                  <div
                    className={clsx(
                      'rounded-xl border bg-primary-950/40 px-3 py-2 text-xs text-snowWhite-50',
                      item.isCorrect ? 'border-jadeGreen-500/30' : 'border-chiliRed-500/30'
                    )}
                  >
                    {item.selectedLabel ?? t('results.noAnswer')}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  )
}

export default QuizResultModal
