// Strips locale prefix (e.g. /pl, /en) from a URL path and normalizes empty to "/".
export const normalizeUrlPath = (path: string) => {
  return path.replace(/^\/(pl|en)(?=\/|$)/, '') || '/'
}
