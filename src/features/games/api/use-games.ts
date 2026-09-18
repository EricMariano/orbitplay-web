import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import { gamesKeys } from './games-keys'
import type { GameCardData } from '../types'

/**
 * Lista jogos do estúdio. O tipo de retorno já reflete o que a UI precisa
 * (GameCardData); o endpoint `/games` hoje só devolve o shape básico de
 * `Game` — falar com o backend pra estender a resposta ou criar um endpoint
 * dedicado antes de tirar o mock do passo abaixo.
 */
export function useGames() {
  return useQuery({
    queryKey: gamesKeys.list(),
    queryFn: () => api.get<GameCardData[]>('/games'),
    // REMOVER — só pra testar o visual sem backend
    initialData: [
      {
        id: '1',
        organizationId: 'org-demo',
        title: 'Azura Card Game',
        slug: 'azura-card-game',
        description: null,
        genre: null,
        platform: null,
        status: 'active',
        coverUrl: 'https://picsum.photos/seed/azura/600/340',
        bannerUrl: null,
        metrics: {
          testsTotal: 0,
          testsActive: 0,
          sessionsValid: 0,
          playersTotal: 0,
          averageRating: null,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        playersCount: 0,
        openTestsCount: 0,
        maxRewardCents: 0,
        remainingRewardCents: 0,
        availability: 'unavailable',
        availabilityDetail: 'Terminado',
      },
      {
        id: '2',
        organizationId: 'org-demo',
        title: 'Racha de Rua!',
        slug: 'racha-de-rua',
        description: null,
        genre: null,
        platform: null,
        status: 'draft',
        coverUrl: 'https://picsum.photos/seed/racha/600/340',
        bannerUrl: null,
        metrics: {
          testsTotal: 5,
          testsActive: 5,
          sessionsValid: 124,
          playersTotal: 124,
          averageRating: null,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        playersCount: 124,
        openTestsCount: 5,
        maxRewardCents: 2500,
        remainingRewardCents: 157500,
        availability: 'available',
        availabilityDetail: 'Termina em 27h 32m',
        isNew: true,
      },
    ],
  })
}
