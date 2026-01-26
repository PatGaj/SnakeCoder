'use client'

import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { tv, type VariantProps } from 'tailwind-variants'

const modalStyles = tv({
  slots: {
    overlay:
      'fixed inset-0 z-[10000] flex items-start justify-center overflow-y-auto bg-nightBlack-900/70 px-4 py-6 backdrop-blur-sm transition-opacity duration-150 lg:items-center',
    dialog:
      'relative z-[10001] w-full max-w-[92vw] max-h-[calc(100dvh-2rem)] overflow-hidden rounded-xl border border-primary-700/80 bg-primary-950/90 text-snowWhite-50 shadow-[0_24px_64px_#07204d96] flex flex-col sm:max-h-[calc(100dvh-3rem)]',
    header: 'shrink-0 flex items-start justify-between gap-4 border-b border-primary-800/70 px-4 py-3 sm:px-5 sm:py-4',
    title: 'text-lg font-semibold',
    body: 'flex-1 min-h-0 px-4 py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-secondary-500 scrollbar-track-primary-900/50 sm:px-5',
    footer: 'shrink-0 flex items-center justify-end gap-3 border-t border-primary-800/70 px-4 py-3 sm:px-5 sm:py-4',
    close:
      'inline-flex cursor-pointer h-9 w-9 items-center justify-center rounded-md border border-primary-700/70 bg-primary-900/80 text-sm font-semibold transition hover:bg-primary-800/80',
  },
  variants: {
    size: {
      sm: { dialog: 'sm:w-85' },
      md: { dialog: 'sm:w-130' },
      lg: { dialog: 'sm:w-180' },
      xl: { dialog: 'sm:w-225' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

type ModalProps = VariantProps<typeof modalStyles> & {
  open: boolean
  onClose: () => void
  title?: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
  hideCloseButton?: boolean
}

const Modal: React.FC<ModalProps> = ({ open, onClose, title, children, footer, hideCloseButton = false, size }) => {
  const styles = modalStyles({ size })
  const [mounted, setMounted] = React.useState(false)

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    if (open) {
      document.addEventListener('keydown', handleKey)
    }
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className={styles.overlay()}
          role="dialog"
          aria-modal="true"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          <motion.div
            className={styles.dialog()}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {(title || !hideCloseButton) && (
              <div className={styles.header()}>
                {title && <div className={styles.title()}>{title}</div>}
                {!hideCloseButton && (
                  <button type="button" className={styles.close()} onClick={onClose} aria-label="Zamknij">
                    x
                  </button>
                )}
              </div>
            )}
            <div className={styles.body()}>{children}</div>
            {footer && <div className={styles.footer()}>{footer}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  , document.body)
}

Modal.displayName = 'Modal'

export default Modal
