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
        title: 'Street Fighter II',
        status: 'published',
        coverUrl: 'https://www.bonusstage.com.br/wp-content/uploads/2013/09/top10-caparuim-sf2.jpg',
        createdAt: new Date().toISOString(),
        playersCount: 0,
        openTestsCount: 0,
        maxRewardCents: 0,
        remainingRewardCents: 0,
        availability: 'unavailable',
        availabilityDetail: 'Terminado',
      },
      {
        id: '2',
        title: 'Spider-Man 2',
        status: 'draft',
        coverUrl:
          'https://upload.wikimedia.org/wikipedia/pt/6/64/Spider-Man_2_2023_capa.jpg?utm_source=pt.wikipedia.org&utm_campaign=index&utm_content=original',
        createdAt: new Date().toISOString(),
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
