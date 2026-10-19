import type { DashboardBlock } from '@/api-types'

export type SessionsPoint = { date: string; sessions: number }

function isSessionsPoint(value: unknown): value is SessionsPoint {
  if (typeof value !== 'object' || value === null) return false
  const point = value as Record<string, unknown>
  return typeof point.date === 'string' && typeof point.sessions === 'number'
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
