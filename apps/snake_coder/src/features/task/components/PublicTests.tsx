import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import { RiTestTubeLine } from 'react-icons/ri'

import { Box, Button, Separator } from '@/components'

export type PublicTestCase = {
  id: string
  input: string
  output: string
}

export type PublicTestsData = {
  cases: PublicTestCase[]
}

export type PublicTestsProps = {
  publicTests: PublicTestsData
  onTest: () => void
  loading?: boolean
  className?: string
}

const PublicTests: React.FC<PublicTestsProps> = ({ publicTests, onTest, loading, className }) => {
  const t = useTranslations('task')

  return (
    <Box variant="glass" size="xl" round="3xl" className={clsx('w-full border-primary-800/70', className)}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary-300">{t('sections.publicTests')}</p>
        <Button
          variant="muted"
          size="sm"
          round="lg"
          leftIcon={<RiTestTubeLine size={18} />}
          loading={loading}
          onClick={onTest}
          type="button"
          className="px-4"
        >
          {t('actions.test')}
        </Button>
      </div>
      <Separator className="my-5 bg-primary-800/70" />
      <div className="space-y-3">
        {publicTests.cases.map((testCase) => (
          <div key={testCase.id} className="rounded-2xl border border-primary-800/70 bg-primary-900/25 p-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-snowWhite-300">{t('results.fields.input')}</p>
                <pre className="whitespace-pre-wrap wrap-break-words rounded-xl bg-primary-950/40 px-3 py-2 text-xs text-snowWhite-50">
                  {testCase.input}
                </pre>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-snowWhite-300">
                  {t('results.fields.expected')}
                </p>
                <pre className="whitespace-nowrap overflow-x-auto rounded-xl bg-primary-950/40 px-3 py-2 text-xs text-snowWhite-50">
                  {testCase.output}
                </pre>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Box>
  )
}

export default PublicTests
