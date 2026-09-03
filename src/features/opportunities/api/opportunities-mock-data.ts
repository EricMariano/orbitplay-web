import type { Opportunity } from '@/api-types'

/**
 * Temporary in-memory fixture standing in for `GET /opportunities` while the
 * backend doesn't exist yet. Shaped exactly like the OpenAPI `Opportunity`
 * schema so swapping back to `opportunitiesRepository` later is a no-op for
 * every consumer (screens only ever see the `OpportunitiesRepository`
 * contract — DIP).
 */
export const mockOpportunities: Opportunity[] = [
  {
    id: 'opp-1',
    title: 'Racha de Rua',
    gameId: 'game-1',
    reward: 150,
    status: 'open',
  },
  {
    id: 'opp-2',
    title: 'Reino de Cristal',
    gameId: 'game-2',
    reward: 220,
    status: 'in_progress',
  },
  {
    id: 'opp-3',
    title: 'Velocidade Máxima',
    gameId: 'game-3',
    reward: 90,
    status: 'open',
  },
  {
    id: 'opp-4',
    title: 'Sombras do Abismo',
    gameId: 'game-4',
    reward: 300,
    status: 'closed',
  },
]
