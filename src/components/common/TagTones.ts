/** Tons do "Badge-Tag" — também nomeiam as séries de gráfico (`--chart-<tom>`). */
export type TagTone = 'yellow' | 'green' | 'orange' | 'blue' | 'red' | 'teal' | 'violet'

/** Cor de série de gráfico do mesmo tom de uma tag (legenda = badge). */
export function chartColor(tone: TagTone | 'neutral'): string {
  return `var(--chart-${tone})`
}
