'use client'

import React from 'react'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import toast from 'react-hot-toast'
import { RiLock2Line } from 'react-icons/ri'

import { Badge, Button, Modal, Separator } from '@/components'
import { useRouter } from '@/i18n/navigation'

import ModuleCard from './moduleCard'
import useModules from './useModules'

const Modules = () => {
  const t = useTranslations('modules')
  const router = useRouter()
  const { modules } = useModules()
  const queryClient = useQueryClient()
  const [unlockTarget, setUnlockTarget] = React.useState<null | { id: string; route: string; title: string }>(null)
  const certificationModules = modules.filter((module) => module.category === 'certifications')
  const libraryModules = modules.filter((module) => module.category === 'libraries')

  const unlockMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/modules/${id}/unlock`, { method: 'POST' })
      if (!response.ok) throw new Error('Failed to unlock module')
      return response.json() as Promise<{ ok: true }>
    },
    onSuccess: async (_data, id) => {
      await queryClient.invalidateQueries({ queryKey: ['modules'] })
      await queryClient.invalidateQueries({ queryKey: ['module', id] })
    },
  })

  const handleOpen = (module: { locked: boolean; route: string; id: string; title: string }) => {
    if (module.locked) {
      setUnlockTarget({ id: module.id, route: module.route, title: module.title })
      return
    }
    router.push(module.route)
  }

  const handleUnlock = async () => {
    if (!unlockTarget) return
    try {
      await unlockMutation.mutateAsync(unlockTarget.id)
      toast.success(t('unlockModal.toast.success'))
      router.push(unlockTarget.route)
      setUnlockTarget(null)
    } catch {
      toast.error(t('unlockModal.toast.error'))
    }
  }

  return (
    <main className="mx-auto max-w-400 px-6 py-10 space-y-8 md:px-12">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary-300">{t('badge')}</p>
        <h1 className="text-3xl font-semibold text-snowWhite-50">{t('title')}</h1>
        <p className="max-w-2xl text-sm text-snowWhite-300 md:text-base">{t('subtitle')}</p>
      </header>

      <section className="space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary-300">{t('sections.certifications.title')}</p>
          <p className="max-w-2xl text-sm text-snowWhite-300 md:text-base">{t('sections.certifications.subtitle')}</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {certificationModules.map((module) => (
            <ModuleCard key={module.id} module={module} onOpen={() => handleOpen(module)} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary-300">{t('sections.libraries.title')}</p>
          <p className="max-w-2xl text-sm text-snowWhite-300 md:text-base">{t('sections.libraries.subtitle')}</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {libraryModules.map((module) => (
            <ModuleCard key={module.id} module={module} onOpen={() => handleOpen(module)} />
          ))}
        </div>
      </section>

      <Modal
        open={Boolean(unlockTarget)}
        onClose={() => setUnlockTarget(null)}
        size="md"
        title={
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary-300">{t('unlockModal.badge')}</p>
            <p className="text-lg font-semibold text-snowWhite-50">{t('unlockModal.title')}</p>
          </div>
        }
        footer={
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="ghost"
              size="md"
              round="lg"
              disabled={unlockMutation.isPending}
              onClick={() => setUnlockTarget(null)}
            >
              {t('unlockModal.actions.cancel')}
            </Button>
            <Button
              variant="gradient"
              size="md"
              round="lg"
              leftIcon={<RiLock2Line size={18} />}
              loading={unlockMutation.isPending}
              className="sm:min-w-40"
              onClick={handleUnlock}
            >
              {t('unlockModal.actions.unlock')}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="muted" size="lg" className="px-3 py-1">
              <span className="inline-flex items-center gap-2">
                <RiLock2Line size={16} className="text-snowWhite-200" />
                {t('card.noAccess')}
              </span>
            </Badge>
          </div>
          <div className="space-y-1">
            <p className="text-base font-semibold text-snowWhite-50">{unlockTarget?.title}</p>
            <p className="text-sm text-snowWhite-300">{t('unlockModal.desc')}</p>
          </div>
          <Separator />
          <p className="text-xs text-snowWhite-300">{t('unlockModal.note')}</p>
        </div>
      </Modal>
    </main>
  )
}
export default Modules
