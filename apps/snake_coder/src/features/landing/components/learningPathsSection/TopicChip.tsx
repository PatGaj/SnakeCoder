import React from 'react'

type TopicChipProps = {
  children: React.ReactNode
}

const TopicChip: React.FC<TopicChipProps> = ({ children }) => {
  return (
    <li className="rounded-xl border border-primary-800/60 bg-primary-950/50 px-3 py-2 text-xs text-snowWhite-200">
      {children}
    </li>
  )
}

export default TopicChip

