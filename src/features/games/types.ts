import type { Game } from '@/api-types'

/**
 * Dado exibido no card de jogo (Tela 02 e Tela 03). Os campos abaixo além de
 * `Game` ainda não existem no contrato da API — precisam vir do backend
 * (RN-03: nunca calcular no front). Mover para src/api-types quando o
 * endpoint `/games` (ou um dedicado) expuser isso de verdade.
 */
export type GameCardData = Game & {
  playersCount: number
  openTestsCount: number
  maxRewardCents: number
  remainingRewardCents: number
  availability: 'available' | 'unavailable'
  /** Texto do badge central, ex.: "Terminado" ou "Termina em 27h 32m". */
  availabilityDetail?: string
  isNew?: boolean
}
