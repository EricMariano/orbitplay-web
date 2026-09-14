import { ApiError } from '@/lib/api-client'
import type { PlayerTest } from './player-game-types'

export function gameDetailsErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 403) return 'Sua conta não tem acesso a este conteúdo.'
    if (error.status === 404) return 'Este conteúdo não está disponível no momento.'
    if (error.status === 409)
      return 'A disponibilidade do teste mudou. Atualize a lista e tente novamente.'
    if (error.status === 429) return 'Muitas tentativas. Aguarde um pouco e tente novamente.'
  }
  return 'Não foi possível carregar os dados. Tente novamente em instantes.'
}

export function isGameId(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
}

export function testProgress(test: Pick<PlayerTest, 'cta'>): number | null {
  if (test.cta === 'completed' || test.cta === 'in_review') return 100
  if (test.cta === 'start') return 0
  // The contract does not expose partial or download progress.
  return null
}

export function remainingTime(expiresAt: string | null | undefined, now: number): string {
  if (!expiresAt) return 'Sem prazo'
  const end = Date.parse(expiresAt)
  if (!Number.isFinite(end)) return 'Não informado'
  const seconds = Math.max(0, Math.floor((end - now) / 1000))
  if (seconds === 0) return 'Expirado'
  return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m ${seconds % 60}s`
}
