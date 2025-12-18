export const normalizeUrlPath = (path: string) => {
  return path.replace(/^\/(pl|en)/, '') || '/'
}
