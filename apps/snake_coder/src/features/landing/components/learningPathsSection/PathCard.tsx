import React from 'react'

import { Badge, Box } from '@/components'

type PathCardProps = {
  badgeText: string
  tagText: string
  title: string
  desc: string
  icon: React.ReactNode
  children?: React.ReactNode
}

const PathCard: React.FC<PathCardProps> = ({ badgeText, tagText, title, desc, icon, children }) => {
  return (
    <Box variant="glass" size="sm" round="2xl" className="w-full border-primary-800/70">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="rounded-xl border border-primary-800/70 bg-primary-950/60 p-2">{icon}</div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{badgeText}</Badge>
              <Badge variant="muted">{tagText}</Badge>
            </div>
            <p className="text-base font-semibold text-snowWhite-50">{title}</p>
            <p className="text-sm text-snowWhite-300">{desc}</p>
          </div>
        </div>
      </div>
      <ul className="mt-5 grid gap-2 sm:grid-cols-2">{children}</ul>
    </Box>
  )
}

export default PathCard
