import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Merges Tailwind class names with conditional inputs.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Formats a duration in seconds into a compact "Xm Ys" string for UI display.
export const formatDuration = (seconds: number | null) => {
  if (!seconds || seconds <= 0) return '-'
  const minutes = Math.floor(seconds / 60)
  const remaining = seconds % 60
  if (!minutes) {
    return `${remaining}s`
  }
  return `${minutes}m ${remaining}s`
}
