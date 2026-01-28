// List of module codes that are accessible without explicit user access.
export const PUBLIC_MODULE_CODES = ['BASICS'] as const
export const PUBLIC_MODULE_CODES_LIST: string[] = [...PUBLIC_MODULE_CODES]

// Returns true when a module code is considered public.
export const isPublicModuleCode = (code?: string | null) =>
  Boolean(code && PUBLIC_MODULE_CODES_LIST.includes(code))
