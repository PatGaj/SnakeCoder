'use client'

import { useIsFetching, useIsMutating } from '@tanstack/react-query'
import clsx from 'clsx'
import React from 'react'
import { RiLoader4Line } from 'react-icons/ri'

type GlobalLoaderProps = {
  className?: string
}

const GlobalLoader: React.FC<GlobalLoaderProps> = ({ className }) => {
  const isFetching = useIsFetching()
  const isMutating = useIsMutating()
  const isActive = isFetching + isMutating > 0

  if (!isActive) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary-950/40 backdrop-blur-sm">
      <div
        className={clsx(
          'flex items-center justify-center rounded-full border border-primary-800/80 bg-primary-950/90 p-4 shadow-[0_18px_48px_#0000008a]',
          className
        )}
        role="status"
        aria-live="polite"
      >
        <RiLoader4Line className="text-2xl text-secondary-200 animate-spin" />
      </div>
    </div>
  )
}

export default GlobalLoader
