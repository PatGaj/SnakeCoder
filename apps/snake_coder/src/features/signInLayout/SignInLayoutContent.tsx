'use client'

import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'

import { usePathname } from '@/i18n/navigation'

type SignInLayoutContentProps = {
  children: React.ReactNode
}

const SignInLayoutContent: React.FC<SignInLayoutContentProps> = ({ children }) => {
  const pathname = usePathname()

  return (
    <div className="min-w-0 flex-1 min-h-0 overflow-y-auto scrollbar-thumb-secondary-500 scrollbar-track-primary-500 scrollbar-thin">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          className="min-h-full"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default SignInLayoutContent
