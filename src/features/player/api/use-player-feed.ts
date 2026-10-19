import { useQuery } from '@tanstack/react-query'
import type { FeedList } from '@/api-types'
import { api } from '@/lib/api-client'
import { playerKeys } from './player-keys'

/**
 * Primeira página do feed do jogador (`GET /player/feed`). A API congela a
 * ordem num snapshot identificado por `seed`; como aqui só se lê a primeira
 * página, o seed não precisa ser reenviado.
 */
export function usePlayerFeed(limit: number) {
  return useQuery({
    queryKey: playerKeys.feed(limit),
    queryFn: () => api.get<FeedList>(`/player/feed?limit=${limit}`),
    select: (feed) => feed.data,
  })
}
