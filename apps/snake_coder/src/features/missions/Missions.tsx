'use client'

import clsx from 'clsx'
import React from 'react'
import { useTranslations } from 'next-intl'
import { RiArrowRightLine, RiBookOpenLine, RiBugLine, RiCodeLine, RiQuestionAnswerLine } from 'react-icons/ri'

import { Badge, Button, Pagination, Select, Table, type TableColumn } from '@/components'
import { useRouter } from '@/i18n/navigation'

import useMissions, {
  type MissionData,
  type MissionDifficulty,
  type MissionStatus,
  type MissionType,
} from './useMissions'

const DIFFICULTY_BADGE_VARIANT = {
  beginner: 'success',
  intermediate: 'warning',
  advanced: 'danger',
} as const

const CTA_BUTTON_VARIANT = {
  todo: 'gradient',
  inProgress: 'primary',
  done: 'ghost',
} as const

const ICON_BY_TYPE = {
  task: RiCodeLine,
  bugfix: RiBugLine,
  quiz: RiQuestionAnswerLine,
  article: RiBookOpenLine,
} as const

const PER_PAGE_OPTIONS = [6, 12, 24, 50] as const

const Missions = () => {
  const t = useTranslations('missions')
  const router = useRouter()

  const { pageMissions, totalPages, page, perPage, setPage, setPerPage, filters, setFilter, filterOptions } =
    useMissions()

  const columns = React.useMemo<TableColumn<MissionData>[]>(() => {
    return [
      {
        key: 'title',
        label: t('table.title'),
        render: (_value, row) => <span className="font-semibold text-snowWhite-50">{row.title}</span>,
      },
      {
        key: 'moduleId',
        label: t('table.module'),
        render: (_value, row) => <span className="text-snowWhite-200">{row.moduleTitle}</span>,
      },
      {
        key: 'difficulty',
        label: t('table.difficulty'),
        render: (_value, row) => (
          <Badge variant={DIFFICULTY_BADGE_VARIANT[row.difficulty]} size="sm" className="px-3 py-1 whitespace-nowrap">
            {t('difficulty', { difficulty: row.difficulty })}
          </Badge>
        ),
      },
      {
        key: 'type',
        label: t('table.type'),
        render: (_value, row) => {
          const TypeIcon = ICON_BY_TYPE[row.type]
          return (
            <Badge variant="muted" size="sm" className="px-3 py-1 whitespace-nowrap">
              <span className="inline-flex items-center gap-2">
                <TypeIcon size={16} />
                {t('type', { type: row.type })}
              </span>
            </Badge>
          )
        },
      },
      {
        key: 'xp',
        label: t('table.xp'),
        render: (_value, row) => <span className="font-semibold text-secondary-300">+{row.xp} XP</span>,
        align: 'right',
      },
      {
        key: '__actions',
        label: t('table.action'),
        align: 'center',
        render: (_value, row) => (
          <Button
            variant={CTA_BUTTON_VARIANT[row.status]}
            size="sm"
            round="lg"
            rightIcon={<RiArrowRightLine size={18} />}
            className="w-36 whitespace-nowrap text-xs px-3 py-1"
            onClick={() => router.push(row.route)}
          >
            {t('table.cta', { status: row.status })}
          </Button>
        ),
      },
    ] as const
  }, [router, t])

  const canClear = Boolean(filters.difficulty || filters.moduleId || filters.type || filters.status)

  return (
    <main className="mx-auto max-w-400 space-y-8 px-6 py-10 md:px-12">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary-300">{t('badge')}</p>
        <h1 className="text-3xl font-semibold text-snowWhite-50">{t('title')}</h1>
        <p className="max-w-2xl text-sm text-snowWhite-300 md:text-base">{t('subtitle')}</p>
      </header>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-wrap items-end gap-4">
          <Select
            title={t('filters.difficulty')}
            value={filters.difficulty}
            onChange={(e) => setFilter.difficulty(e.target.value as MissionDifficulty | '')}
            variant="muted"
            size="sm"
            round="lg"
            className="w-44"
          >
            <option value="">{t('filters.all')}</option>
            {filterOptions.difficulty.map((difficulty) => (
              <option key={difficulty} value={difficulty}>
                {t('difficulty', { difficulty })}
              </option>
            ))}
          </Select>

          <Select
            title={t('filters.modules')}
            value={filters.moduleId}
            onChange={(e) => setFilter.moduleId(e.target.value)}
            variant="muted"
            size="sm"
            round="lg"
            className="w-72"
          >
            <option value="">{t('filters.all')}</option>
            {filterOptions.module.map((module) => (
              <option key={module.id} value={module.id}>
                {module.code} — {module.title}
              </option>
            ))}
          </Select>

          <Select
            title={t('filters.type')}
            value={filters.type}
            onChange={(e) => setFilter.type(e.target.value as MissionType | '')}
            variant="muted"
            size="sm"
            round="lg"
            className="w-44"
          >
            <option value="">{t('filters.all')}</option>
            {filterOptions.type.map((type) => (
              <option key={type} value={type}>
                {t('type', { type })}
              </option>
            ))}
          </Select>

          <Select
            title={t('filters.progress')}
            value={filters.status}
            onChange={(e) => setFilter.status(e.target.value as MissionStatus | '')}
            variant="muted"
            size="sm"
            round="lg"
            className="w-44"
          >
            <option value="">{t('filters.all')}</option>
            {filterOptions.status.map((status) => (
              <option key={status} value={status}>
                {t('status', { status })}
              </option>
            ))}
          </Select>

          <Button variant="ghost" size="sm" round="lg" disabled={!canClear} onClick={setFilter.clear}>
            {t('filters.clear')}
          </Button>
        </div>

        <Select
          title={t('pagination.perPage')}
          value={String(perPage)}
          onChange={(e) => setPerPage(Number(e.target.value))}
          variant="muted"
          size="sm"
          round="lg"
          className="w-36"
        >
          {PER_PAGE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      </div>

      <Table columns={columns} data={pageMissions} zebra emptyLabel={t('table.empty')} />

      <div className={clsx('flex justify-end', { invisible: totalPages <= 1 })}>
        <Pagination totalPages={totalPages} currentPage={page} onPageChange={setPage} />
      </div>
    </main>
  )
}

export default Missions
