import type { GameStatus } from '@/api-types'

export const gameStatusLabels: Record<GameStatus, string> = {
  draft: 'Rascunho',
  active: 'Ativo',
  archived: 'Arquivado',
}
