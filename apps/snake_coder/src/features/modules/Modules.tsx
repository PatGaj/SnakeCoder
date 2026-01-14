'use client'

import React from 'react'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import toast from 'react-hot-toast'
import { RiLock2Line } from 'react-icons/ri'

import { Badge, Button, Modal, Separator } from '@/components'
import { useRouter } from '@/i18n/navigation'

import ModuleCard from './moduleCard'
import useModules from './useModules'

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1]

const pageVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: EASE_OUT,
      when: 'beforeChildren',
      staggerChildren: 0.08,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE_OUT } },
}

const gridVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.06,
    },
  },
}

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
      await queryClient.invalidateQueries({ queryKey: ['user'] })
      await queryClient.invalidateQueries({ queryKey: ['dashboard'] })
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
    <motion.main
      className="mx-auto max-w-400 px-6 py-10 space-y-8 md:px-12"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.header className="space-y-2" variants={itemVariants}>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary-300">{t('badge')}</p>
        <h1 className="text-3xl font-semibold text-snowWhite-50">{t('title')}</h1>
        <p className="max-w-2xl text-sm text-snowWhite-300 md:text-base">{t('subtitle')}</p>
      </motion.header>

      <motion.section className="space-y-4" variants={itemVariants}>
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary-300">{t('sections.certifications.title')}</p>
          <p className="max-w-2xl text-sm text-snowWhite-300 md:text-base">{t('sections.certifications.subtitle')}</p>
        </div>
        <motion.div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3" variants={gridVariants}>
          {certificationModules.map((module) => (
            <motion.div key={module.id} variants={itemVariants}>
              <ModuleCard module={module} onOpen={() => handleOpen(module)} />
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      <motion.section className="space-y-4" variants={itemVariants}>
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary-300">{t('sections.libraries.title')}</p>
          <p className="max-w-2xl text-sm text-snowWhite-300 md:text-base">{t('sections.libraries.subtitle')}</p>
        </div>
        <motion.div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3" variants={gridVariants}>
          {libraryModules.map((module) => (
            <motion.div key={module.id} variants={itemVariants}>
              <ModuleCard module={module} onOpen={() => handleOpen(module)} />
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

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
    </motion.main>
  )
}
export default Modules
