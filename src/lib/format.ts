const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

/** Format a number as BRL currency, e.g. `1234.5` → `"R$ 1.234,50"`. */
export function formatCurrency(value: number): string {
  return currencyFormatter.format(value)
}

/** Format integer cents from the API, preserving the currency returned by the contract. */
export function formatCents(value: number, currency = 'BRL'): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(value / 100)
}

const compactNumberFormatter = new Intl.NumberFormat('pt-BR', { notation: 'compact' })

/** Format a count compactly, e.g. `222157` → `"222 mil"`. */
export function formatCompactNumber(value: number): string {
  return compactNumberFormatter.format(value)
}

/** Format the time remaining until `endsAt` as `"27h 32m"`, or `null` once it has passed. */
export function formatCountdown(endsAt: string, now: Date = new Date()): string | null {
  const diffMs = new Date(endsAt).getTime() - now.getTime()
  if (diffMs <= 0) return null

  const totalMinutes = Math.floor(diffMs / 60_000)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return `${hours}h ${minutes}m`
}

/**
 * Format a duration as `"32m 54s"` (seconds zero-padded, as in the design);
 * from one hour on, `"1h 05m"`.
 */
export function formatDuration(ms: number): string {
  const totalSeconds = Math.round(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  if (hours > 0) return `${hours}h ${String(minutes).padStart(2, '0')}m`
  return `${minutes}m ${String(seconds).padStart(2, '0')}s`
}

const decimalFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

/** Format a score/average with one decimal, e.g. `4.66` → `"4,7"`. */
export function formatDecimal(value: number): string {
  return decimalFormatter.format(value)
}

const percentFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'percent',
  maximumFractionDigits: 0,
})

/** Format a 0–1 ratio as a whole percentage, e.g. `0.783` → `"78%"`. */
export function formatPercent(ratio: number): string {
  return percentFormatter.format(ratio)
}
