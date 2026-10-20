import type { DashboardBlock } from '@/api-types'

export type SessionsPoint = { date: string; sessions: number }

function isSessionsPoint(value: unknown): value is SessionsPoint {
  if (typeof value !== 'object' || value === null) return false
  const point = value as Record<string, unknown>
  if (typeof point.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(point.date)) return false
  const timestamp = Date.parse(`${point.date}T00:00:00Z`)
  return (
    Number.isFinite(timestamp) &&
    new Date(timestamp).toISOString().slice(0, 10) === point.date &&
    typeof point.sessions === 'number' &&
    Number.isInteger(point.sessions) &&
    point.sessions >= 0
  )
}

/**
 * Pontos do bloco `sessions_evolution` (sessões válidas por dia). O contrato
 * tipa `payload` como objeto livre, então o formato é conferido aqui: payload
 * fora do esperado vira `null` e a tela mostra o bloco como indisponível.
 */
export function sessionsEvolutionPoints(block: DashboardBlock): SessionsPoint[] | null {
  if (block.status !== 'ready' || block.key !== 'sessions_evolution') return null
  const points = block.payload?.points
  if (!Array.isArray(points) || !points.every(isSessionsPoint)) return null
  return points
}
