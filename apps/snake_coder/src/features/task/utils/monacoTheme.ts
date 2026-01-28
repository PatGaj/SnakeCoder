import type { Monaco } from '@monaco-editor/react'

export const SNAKE_CODER_EDITOR_THEME = 'snakeCoderEditor'
export const SNAKE_CODER_CONSOLE_THEME = 'snakeCoderConsole'

let themesDefined = false

export const defineSnakeCoderMonacoThemes = (monaco: Monaco) => {
  if (themesDefined) return
  themesDefined = true

  const base = {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: '', foreground: 'EAF1FF' },
      { token: 'comment', foreground: '7A8BB8', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'FFFB2D' },
      { token: 'number', foreground: '77BDFB' },
      { token: 'string', foreground: '67E8F9' },
      { token: 'type.identifier', foreground: 'D8B4FE' },
      { token: 'delimiter', foreground: 'BFD0F5' },
    ],
    colors: {
      'editor.foreground': '#EAF1FF',
      'editorCursor.foreground': '#FFFB2D',
      'editorLineNumber.foreground': '#6C7FB0',
      'editorLineNumber.activeForeground': '#FFFB2D',
      'editorIndentGuide.background': '#1B3566',
      'editorIndentGuide.activeBackground': '#2A4A87',
      'editor.selectionBackground': '#20488370',
      'editor.lineHighlightBackground': '#0F2A5670',
      'editorWidget.background': '#061D44',
      'editorWidget.border': '#12305E',
      'scrollbar.shadow': '#00000000',
      'scrollbarSlider.background': '#FFFFFF14',
      'scrollbarSlider.hoverBackground': '#FFFFFF1F',
      'scrollbarSlider.activeBackground': '#FFFFFF2B',
    },
  } as const

  monaco.editor.defineTheme(SNAKE_CODER_EDITOR_THEME, {
    ...base,
    colors: {
      ...base.colors,
      'editor.background': '#061D44',
    },
  })

  monaco.editor.defineTheme(SNAKE_CODER_CONSOLE_THEME, {
    ...base,
    colors: {
      ...base.colors,
      'editor.background': '#04122B',
      'editorLineNumber.activeForeground': '#EAF1FF',
    },
  })
}

