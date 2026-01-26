'use client'

import React from 'react'
import { RiRefreshLine, RiSave2Line } from 'react-icons/ri'
import { useTranslations } from 'next-intl'

import { Button, Modal } from '@/components'

import { CodeEditor, Console, PublicTests, TaskActionBar, TaskDescription, TestResults } from './components'
import useTask from './useTask'

export type TaskProps = {
  id: string
}

const Task: React.FC<TaskProps> = ({ id }) => {
  const {
    errorLabel,
    isError,
    task,
    editor,
    publicTests,
    code,
    onCodeChange,
    consoleValue,
    results,
    runLoading,
    testLoading,
    saveLoading,
    submitLoading,
    aiLoading,
    aiReviewVisible,
    aiReviewDisabled,
    aiReviewRemaining,
    aiReviewLimit,
    submitDisabled,
    onRun,
    onTest,
    onSave,
    onReset,
    onSubmit,
    onAiReview,
    submitModalOpen,
    submitPercent,
    submitModalMessage,
    submitStats,
    closeSubmitModal,
    saveLabel,
    resetLabel,
  } = useTask(id)
  const t = useTranslations('task')

  const formatDuration = (seconds: number | null) => {
    if (!seconds || seconds <= 0) return t('submitModal.unknown')
    const minutes = Math.floor(seconds / 60)
    const remaining = seconds % 60
    if (!minutes) {
      return t('submitModal.secondsValue', { seconds: remaining })
    }
    return t('submitModal.timeValue', { minutes, seconds: remaining })
  }

  const attemptsValue = submitStats?.attemptsCount ?? null
  const attemptsLabel = attemptsValue === null ? t('submitModal.unknown') : String(attemptsValue)
  const xpAwarded = submitStats?.xpAwarded ?? 0
  const xpLabel = `${xpAwarded > 0 ? '+' : ''}${xpAwarded} XP`

  if (!task || !editor || !publicTests) {
    if (isError) {
      return (
        <main className="mx-auto max-w-400 px-6 pb-6 pt-20 md:px-12">
          <div className="text-sm text-snowWhite-300">{errorLabel}</div>
        </main>
      )
    }
    return null
  }

  return (
    <main className="mx-auto max-w-400 px-6 pb-6 pt-20 md:px-12 flex flex-col gap-6 lg:h-screen lg:overflow-hidden">
      <section className="flex flex-col gap-6 lg:flex-1 lg:min-h-0 lg:flex-row">
        <div className="flex flex-col gap-6 lg:w-120 xl:w-130 lg:min-h-0">
          <TaskDescription
            task={task}
            className="flex-1 min-h-0 overflow-y-auto scrollbar-thumb-secondary-500 scrollbar-track-primary-500 scrollbar-thin"
          />
          <PublicTests
            publicTests={publicTests}
            onTest={onTest}
            loading={testLoading}
            className="flex-1 min-h-0 overflow-y-auto scrollbar-thumb-secondary-500 scrollbar-track-primary-500 scrollbar-thin"
          />
          <TestResults
            results={results}
            isRunning={testLoading}
            className="flex-1 min-h-0 overflow-y-auto scrollbar-thumb-secondary-500 scrollbar-track-primary-500 scrollbar-thin"
          />
        </div>

        <div className="flex flex-col gap-6 lg:flex-1 lg:min-h-0 lg:overflow-hidden">
          <div className="flex flex-col gap-4 lg:flex-1 lg:min-h-0">
            <div className="h-130 lg:flex-1 lg:min-h-0">
              <CodeEditor
                editor={editor}
                value={code}
                onChange={onCodeChange}
                headerRight={
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      round="lg"
                      leftIcon={<RiRefreshLine size={16} />}
                      className="px-3 border border-primary-800/70"
                      loading={saveLoading}
                      disabled={saveLoading}
                      onClick={onReset}
                      type="button"
                    >
                      {resetLabel}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      round="lg"
                      leftIcon={<RiSave2Line size={16} />}
                      className="px-3"
                      loading={saveLoading}
                      disabled={saveLoading}
                      onClick={onSave}
                      type="button"
                    >
                      {saveLabel}
                    </Button>
                  </div>
                }
              />
            </div>
            <TaskActionBar
              onRun={onRun}
              onSubmit={onSubmit}
              onAiReview={onAiReview}
              runLoading={runLoading}
              submitLoading={submitLoading}
              aiLoading={aiLoading}
              submitDisabled={submitDisabled}
              aiDisabled={aiReviewDisabled}
              showAiReview={aiReviewVisible}
              aiRemaining={aiReviewRemaining}
              aiLimit={aiReviewLimit}
            />
          </div>
          <Console value={consoleValue} />
        </div>
      </section>

      <Modal open={submitModalOpen} onClose={closeSubmitModal}>
        {submitModalOpen && (
          <div className="space-y-4 text-center">
            <div className="space-y-2">
              <p className="text-5xl font-bold text-snowWhite-50">{submitPercent}%</p>
              <p className="text-sm text-snowWhite-200">{submitModalMessage}</p>
            </div>
            <div className="grid gap-3 text-left sm:grid-cols-3">
              <div className="rounded-xl border border-primary-800/70 bg-primary-950/60 px-3 py-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-secondary-300">
                  {t('submitModal.labels.time')}
                </p>
                <p className="text-sm font-semibold text-snowWhite-50">
                  {formatDuration(submitStats?.timeSpentSeconds ?? null)}
                </p>
              </div>
              <div className="rounded-xl border border-primary-800/70 bg-primary-950/60 px-3 py-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-secondary-300">
                  {t('submitModal.labels.attempts')}
                </p>
                <p className="text-sm font-semibold text-snowWhite-50">{attemptsLabel}</p>
              </div>
              <div className="rounded-xl border border-primary-800/70 bg-primary-950/60 px-3 py-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-secondary-300">
                  {t('submitModal.labels.xp')}
                </p>
                <p className="text-sm font-semibold text-snowWhite-50">{xpLabel}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </main>
  )
}

export default Task
