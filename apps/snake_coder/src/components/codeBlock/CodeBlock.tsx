'use client'

import React, { useState } from 'react'

import { cn } from '@/lib/utils'

type CodeBlockProps = {
  code: string
  title?: string
  className?: string
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, title, className }) => {
  const [copied, setCopied] = useState<boolean>(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch (e) {
      setCopied(false)
    }
  }

  return (
    <div className={cn('rounded-xl border border-primary-800/80 bg-primary-950/80 shadow-[0_16px_40px_#0d1530]', className)}>
      <div className="flex items-center justify-between border-b border-primary-800/60 px-4 py-2">
        <span className="text-xs font-semibold text-snowWhite-200">{title ?? 'Snippet'}</span>
        <button
          onClick={handleCopy}
          className="text-xs font-semibold text-secondary-400 hover:text-secondary-300"
        >
          {copied ? 'Skopiowano' : 'Kopiuj'}
        </button>
      </div>
      <pre className="whitespace-pre-wrap wrap-break-words px-4 py-3 text-sm text-secondary-400">
        <code>{code}</code>
      </pre>
    </div>
  )
}

CodeBlock.displayName = 'CodeBlock'

export default CodeBlock
