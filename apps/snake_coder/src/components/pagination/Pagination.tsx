'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

import { cn } from '@/lib/utils'

const paginationStyles = tv({
  slots: {
    root: ' inline-flex items-center gap-2 text-snowWhite-50',
    button:
      'h-9 cursor-pointer min-w-9 rounded-md border px-2 text-sm font-semibold transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 hover:-translate-y-px',
  },
  variants: {
    variant: {
      primary: { button: 'border-primary-700/70 bg-primary-900/80 hover:bg-primary-800/80' },
      secondary: { button: 'border-secondary-500/70 bg-secondary-500 text-nightBlack-900 hover:bg-secondary-600' },
      ghost: { button: 'border-transparent bg-primary-900/40 hover:bg-primary-800/70' },
    },
    size: {
      sm: { button: 'h-8 min-w-8 text-xs' },
      md: {},
      lg: { button: 'h-10 min-w-10 text-base' },
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
})

type PaginationProps = VariantProps<typeof paginationStyles> & {
  totalPages: number
  currentPage: number
  onPageChange: (page: number) => void
  className?: string
}

const Pagination: React.FC<PaginationProps> = ({ totalPages, currentPage, onPageChange, variant, size, className }) => {
  const styles = paginationStyles({ variant, size })
  const [jumpOpen, setJumpOpen] = useState<'start' | 'end' | null>(null)
  const [jumpValue, setJumpValue] = useState(String(currentPage))
  const containerRef = useRef<HTMLDivElement>(null)

  const clampPage = useCallback(
    (page: number) => Math.min(Math.max(1, page), totalPages),
    [totalPages]
  )

  const handleChange = useCallback(
    (page: number) => {
      onPageChange(clampPage(page))
    },
    [clampPage, onPageChange]
  )

  const openJump = useCallback(
    (position: 'start' | 'end') => {
      setJumpOpen(position)
      setJumpValue(String(currentPage))
    },
    [currentPage]
  )

  useEffect(() => {
    if (!jumpOpen) return

    const handleOutside = (event: MouseEvent) => {
      if (!containerRef.current) return
      if (!containerRef.current.contains(event.target as Node)) {
        setJumpOpen(null)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setJumpOpen(null)
      }
    }

    document.addEventListener('mousedown', handleOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [jumpOpen])

  useEffect(() => {
    setJumpValue(String(currentPage))
  }, [currentPage])

  const handleJumpSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault()
      const parsed = Number(jumpValue)
      if (Number.isNaN(parsed)) {
        setJumpOpen(null)
        return
      }
      handleChange(parsed)
      setJumpOpen(null)
    },
    [handleChange, jumpValue]
  )

  const pages = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, idx) => idx + 1)
    }

    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, 'end-ellipsis', totalPages]
    }

    if (currentPage >= totalPages - 3) {
      return [1, 'start-ellipsis', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    }

    return [1, 'start-ellipsis', currentPage - 1, currentPage, currentPage + 1, 'end-ellipsis', totalPages]
  }, [currentPage, totalPages])

  return (
    <div className={cn(styles.root(), className)} aria-label="Pagination" ref={containerRef}>
      <button className={styles.button()} onClick={() => handleChange(currentPage - 1)} disabled={currentPage === 1}>
        Prev
      </button>
      {pages.map((page) =>
        typeof page === 'number' ? (
          <button
            key={page}
            className={cn(styles.button(), page === currentPage && 'bg-primary-600 text-snowWhite-50')}
            onClick={() => handleChange(page)}
          >
            {page}
          </button>
        ) : (
          <div key={page} className="relative">
            <button className={styles.button()} onClick={() => openJump(page === 'start-ellipsis' ? 'start' : 'end')}>
              ...
            </button>
            {jumpOpen === (page === 'start-ellipsis' ? 'start' : 'end') && (
              <form
                onSubmit={handleJumpSubmit}
                className="absolute left-1/2 bottom-[115%] z-10 flex -translate-x-1/2 items-center gap-2 rounded-md border border-primary-800 bg-primary-950 px-3 py-2 shadow-xl"
              >
                <input
                  type="number"
                  min={1}
                  max={totalPages}
                  value={jumpValue}
                  onChange={(e) => setJumpValue(e.target.value)}
                  className="h-8 w-20 rounded-md bg-primary-900 px-2 text-sm text-snowWhite-50 outline-none ring-1 ring-primary-800/70 focus:ring-secondary-500 appearance-none [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                <button type="submit" className={cn(styles.button(), 'h-8 px-3 text-xs')}>
                  Idź
                </button>
              </form>
            )}
          </div>
        )
      )}
      <button
        className={styles.button()}
        onClick={() => handleChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  )
}

Pagination.displayName = 'Pagination'

export default Pagination
