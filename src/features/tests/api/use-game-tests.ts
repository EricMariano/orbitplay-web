import { useInfiniteQuery } from '@tanstack/react-query'
import type { TestList } from '@/api-types'
import { api } from '@/lib/api-client'
import { testsKeys } from './tests-keys'

/** Testes do jogo da organização; preserva os filtros e a paginação do backend. */
export function useGameTests(gameId: string, tab: 'active' | 'all') {
  return useInfiniteQuery({
    queryKey: testsKeys.gameList(gameId, tab),
    initialPageParam: null as string | null,
    queryFn: ({ pageParam, signal }) => {
      const params = new URLSearchParams({ tab, limit: '20' })
      if (pageParam) params.set('cursor', pageParam)
      return api.get<TestList>(`/games/${encodeURIComponent(gameId)}/tests?${params}`, {
        signal,
      })
    },
    getNextPageParam: (lastPage, _pages, _lastParam, pageParams) => {
      const cursor = lastPage.nextCursor
      return cursor && !pageParams.includes(cursor) ? cursor : undefined
    },
    enabled: Boolean(gameId),
  })
}
