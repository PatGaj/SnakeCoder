import clsx from 'clsx'
import React from 'react'
import { useTranslations } from 'next-intl'
import { RiArrowDownSLine, RiCheckLine, RiCloseLine, RiLoader4Line, RiTestTubeLine } from 'react-icons/ri'

import { Badge, Box, Separator } from '@/components'
import formatTestValue from '../utils/formatTestValue'

export type TaskTestStatus = 'pending' | 'passed' | 'failed'

export type TestResult = {
  id: string
  title: string
  status: Exclude<TaskTestStatus, 'pending'>
  input: unknown
  expected: unknown
  output?: unknown
}

export type TestResultsData = {
  status: TaskTestStatus
  tests: TestResult[]
}

export type TestResultsProps = {
  results: TestResultsData
  isRunning?: boolean
  className?: string
}

const STATUS_BADGE_VARIANT = {
  pending: 'muted',
  passed: 'success',
  failed: 'danger',
} as const

const STATUS_ICON = {
  passed: RiCheckLine,
  failed: RiCloseLine,
} as const

const TestResults: React.FC<TestResultsProps> = ({ results, isRunning, className }) => {
  const t = useTranslations('task')
  const StatusIcon =
    results.status === 'pending' ? (isRunning ? RiLoader4Line : RiTestTubeLine) : STATUS_ICON[results.status]
  const [openTestId, setOpenTestId] = React.useState<string | null>(null)

  const totalTests = results.tests.length
  const passedTests = results.tests.filter((test) => test.status === 'passed').length
  const statusLabel = t('results.status', { status: results.status })

  return (
    <Box variant="glass" size="xl" round="3xl" className={clsx('w-full border-primary-800/70', className)}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary-300">{t('sections.results')}</p>
        <Badge variant={STATUS_BADGE_VARIANT[results.status]} size="sm" className="px-3 py-1">
          <span className="inline-flex items-center gap-2">
            <StatusIcon size={16} className={clsx(results.status === 'pending' && isRunning && 'animate-spin')} />
            {passedTests}/{totalTests} {statusLabel}
          </span>
        </Badge>
      </div>

      <Separator className="my-5 bg-primary-800/70" />

      <div className="space-y-3">
        {results.tests.map((test) => {
          const isPassed = test.status === 'passed'
          const TestIcon = isPassed ? RiCheckLine : RiCloseLine
          const isOpen = openTestId === test.id

          return (
            <div
              key={test.id}
              className={clsx('rounded-2xl border p-4', {
                'border-jadeGreen-500/40 bg-jadeGreen-500/10': isPassed,
                'border-chiliRed-500/40 bg-chiliRed-500/10': !isPassed,
              })}
            >
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 text-left"
                onClick={() => setOpenTestId((current) => (current === test.id ? null : test.id))}
                aria-expanded={isOpen}
              >
                <span className="flex min-w-0 items-center gap-2">
                  <TestIcon
                    size={18}
                    className={clsx('shrink-0', {
                      'text-jadeGreen-300': isPassed,
                      'text-chiliRed-300': !isPassed,
                    })}
                  />
                  <span className="truncate text-sm font-semibold text-snowWhite-50">{test.title}</span>
                </span>

                <RiArrowDownSLine
                  size={22}
                  className={clsx('shrink-0 text-snowWhite-200 transition-transform', { 'rotate-180': isOpen })}
                />
              </button>

              {isOpen && (
                <div className="mt-4">
                  <Separator className="mb-4 bg-primary-800/70" />
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-1">
                      <p className="text-xs font-semibold uppercase tracking-wide text-snowWhite-300">
                        {t('results.fields.input')}
                      </p>
                      <pre className="whitespace-pre-wrap wrap-break-words rounded-xl bg-primary-950/40 px-3 py-2 text-xs text-snowWhite-50">
                        {formatTestValue(test.input)}
                      </pre>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-semibold uppercase tracking-wide text-snowWhite-300">
                        {t('results.fields.expected')}
                      </p>
                      <pre className="whitespace-nowrap overflow-x-auto rounded-xl bg-primary-950/40 px-3 py-2 text-xs text-snowWhite-50">
                        {formatTestValue(test.expected)}
                      </pre>
                    </div>
                  </div>

                  {!isPassed && (
                    <div className="mt-3 space-y-1">
                      <p className="text-xs font-semibold uppercase tracking-wide text-snowWhite-300">
                        {t('results.fields.output')}
                      </p>
                      <pre className="whitespace-pre-wrap wrap-break-words rounded-xl bg-primary-950/40 px-3 py-2 text-xs text-snowWhite-50">
                        {formatTestValue(test.output) || t('results.emptyOutput')}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </Box>
  )
}

export default TestResults
