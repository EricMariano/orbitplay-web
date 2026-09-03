const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

/** Format a number as BRL currency, e.g. `1234.5` → `"R$ 1.234,50"`. */
export function formatCurrency(value: number): string {
  return currencyFormatter.format(value)
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
