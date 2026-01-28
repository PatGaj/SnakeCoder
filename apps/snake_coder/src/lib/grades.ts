// Maps average numeric grade to a letter used across the UI.
export const gradeLabelFromAvg = (avg: number | null) => {
  if (avg == null) return ''
  if (avg >= 4.75) return 'A'
  if (avg >= 4.25) return 'A-'
  if (avg >= 4.0) return 'B+'
  if (avg >= 3.5) return 'B'
  if (avg >= 3.0) return 'C+'
  if (avg >= 2.5) return 'C'
  if (avg >= 2.0) return 'D'
  return 'E'
}
