import React from 'react'
import clsx from 'clsx'
import { RiArrowRightSLine } from 'react-icons/ri'
import { useLocale } from 'next-intl'

type LearningRangeProps = {
  size?: 'sm' | 'md'
  className?: string
}

const LearningRange: React.FC<LearningRangeProps> = ({ size = 'sm', className }) => {
  const locale = useLocale()

  const labels =
    locale === 'pl'
      ? { start: 'od zera', middle: 'podstawy', end: 'zaawansowane' }
      : { start: 'from zero', middle: 'basics', end: 'advanced' }

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
      <span>{labels.start}</span>
      <RiArrowRightSLine aria-hidden className="text-current/80" size={16} />
      <span>{labels.middle}</span>
      <RiArrowRightSLine aria-hidden className="text-current/80" size={16} />
      <span>{labels.end}</span>
    </span>
  )
}

export default LearningRange
