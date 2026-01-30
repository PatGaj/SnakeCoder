import dynamic from 'next/dynamic'
import { useTranslations } from 'next-intl'
import { RiFileCodeLine } from 'react-icons/ri'

import { Box, Separator } from '@/components'

import { defineSnakeCoderMonacoThemes, SNAKE_CODER_EDITOR_THEME } from '../utils/monacoTheme'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

export type CodeEditorData = {
  language: string
}

export type CodeEditorProps = {
  editor: CodeEditorData
  value: string
  onChange: (value: string) => void
  headerRight?: React.ReactNode
}

const CodeEditor: React.FC<CodeEditorProps> = ({ editor, value, onChange, headerRight }) => {
  const t = useTranslations('task')

  return (
    <Box
      variant="glass"
      size="xl"
      round="3xl"
      className="w-full h-full border-primary-800/70 p-0 overflow-hidden flex flex-col"
    >
      <div className="flex items-center justify-between gap-3 px-5 py-4">
        <div className="flex items-center gap-2 min-w-0">
          <RiFileCodeLine size={18} className="text-secondary-300 shrink-0" />
          <p className="min-w-0 truncate text-sm font-semibold text-snowWhite-50">{t('sections.editor')}</p>
        </div>
        {headerRight}
      </div>
      <Separator className="bg-primary-800/70" />
      <div className="flex-1 min-h-0">
        <MonacoEditor
          height="100%"
          theme={SNAKE_CODER_EDITOR_THEME}
          language={editor.language}
          value={value}
          onChange={(nextValue) => onChange(nextValue ?? '')}
          beforeMount={defineSnakeCoderMonacoThemes}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            lineHeight: 20,
            fontFamily:
              'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            scrollBeyondLastLine: false,
            tabSize: 2,
            padding: { top: 16, bottom: 16 },
            cursorBlinking: 'smooth',
            renderLineHighlight: 'all',
            smoothScrolling: true,
            overviewRulerBorder: false,
            automaticLayout: true,
          }}
          loading={<div className="p-5 text-sm text-snowWhite-300">Ładowanie edytora…</div>}
        />
      </div>
    </Box>
  )
}

export default CodeEditor
