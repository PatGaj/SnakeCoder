export const PUBLIC_MODULE_CODES = ['BASICS'] as const
export const PUBLIC_MODULE_CODES_LIST = [...PUBLIC_MODULE_CODES]

export const isPublicModuleCode = (code?: string | null) =>
  Boolean(code && PUBLIC_MODULE_CODES_LIST.includes(code))
