import React from 'react'
import clsx from 'clsx'
import { RiArrowRightSLine } from 'react-icons/ri'

type LearningRangeProps = {
  size?: 'sm' | 'md'
  className?: string
}

const LearningRange: React.FC<LearningRangeProps> = ({ size = 'sm', className }) => {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 font-semibold uppercase tracking-wide',
        {
          'text-xs': size === 'sm',
          'text-sm': size === 'md',
        },
        className
      )}
    >
      <span>od zera</span>
      <RiArrowRightSLine aria-hidden className="text-current/80" size={16} />
      <span>PCEP</span>
      <RiArrowRightSLine aria-hidden className="text-current/80" size={16} />
      <span>PCAP</span>
    </span>
  )
}

export default LearningRange

