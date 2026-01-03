import dynamic from 'next/dynamic'
import { useTranslations } from 'next-intl'
import { RiEraserLine, RiTerminalBoxLine } from 'react-icons/ri'

import { Box, Button, Separator } from '@/components'

import { defineSnakeCoderMonacoThemes, SNAKE_CODER_CONSOLE_THEME } from '../monacoTheme'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

export type ConsoleProps = {
  value: string
  onClear?: () => void
}

const Console: React.FC<ConsoleProps> = ({ value, onClear }) => {
  const t = useTranslations('task')
  const displayValue = value.trim().length ? value : t('console.empty')

  return (
    <Box
      variant="glass"
      size="xl"
      round="3xl"
      className="w-full border-primary-800/70 p-0 overflow-hidden flex flex-col h-64"
    >
      <div className="flex items-center justify-between gap-3 px-5 py-4">
        <div className="flex items-center gap-2 min-w-0">
          <RiTerminalBoxLine size={18} className="text-secondary-300 shrink-0" />
          <p className="min-w-0 truncate text-sm font-semibold text-snowWhite-50">{t('sections.console')}</p>
        </div>
        {onClear && (
          <Button
            variant="ghost"
            size="sm"
            round="lg"
            leftIcon={<RiEraserLine size={16} />}
            className="px-3"
            type="button"
            onClick={onClear}
          >
            {t('actions.clearConsole')}
          </Button>
        )}
      </div>
      <Separator className="bg-primary-800/70" />
      <div className="flex-1 min-h-0">
        <MonacoEditor
          height="100%"
          theme={SNAKE_CODER_CONSOLE_THEME}
          language="plaintext"
          value={displayValue}
          beforeMount={defineSnakeCoderMonacoThemes}
          options={{
            readOnly: true,
            minimap: { enabled: false },
            fontSize: 12,
            lineHeight: 18,
            lineNumbers: 'off',
            glyphMargin: false,
            folding: false,
            scrollBeyondLastLine: false,
            padding: { top: 14, bottom: 14 },
            scrollbar: { verticalScrollbarSize: 10, horizontalScrollbarSize: 10 },
            automaticLayout: true,
          }}
          loading={<div className="p-5 text-sm text-snowWhite-300">Ładowanie konsoli…</div>}
        />
      </div>
    </Box>
  )
}

export default Console
