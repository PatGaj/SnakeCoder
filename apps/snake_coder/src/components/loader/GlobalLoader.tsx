'use client'

import { useIsFetching, useIsMutating } from '@tanstack/react-query'
import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'
import { RiLoader4Line } from 'react-icons/ri'

type GlobalLoaderProps = {
  className?: string
}

const GlobalLoader: React.FC<GlobalLoaderProps> = ({ className }) => {
  const isFetching = useIsFetching()
  const isMutating = useIsMutating()
  const isActive = isFetching + isMutating > 0

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-primary-950/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          <motion.div
            className={clsx(
              'flex items-center justify-center rounded-full border border-primary-800/80 bg-primary-950/90 p-4 shadow-[0_18px_48px_#0000008a]',
              className
            )}
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <RiLoader4Line className="text-2xl text-secondary-200 animate-spin" />
            <span className="sr-only">Ładowanie</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default GlobalLoader
