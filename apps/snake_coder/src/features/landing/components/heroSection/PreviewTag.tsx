import React from 'react'

type PreviewTagProps = {
  title: string
  desc: string
}

const PreviewTag: React.FC<PreviewTagProps> = ({ title, desc }) => {
  return (
    <div className="rounded-xl border border-primary-800/70 bg-primary-950/50 px-3 py-2">
      <p className="text-xs font-semibold text-snowWhite-50">{title}</p>
      <p className="text-[11px] text-snowWhite-300">{desc}</p>
    </div>
  )
}

export default PreviewTag
