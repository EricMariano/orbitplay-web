import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import type { Game } from '@/api-types'
import type { GamesRepository } from './games-repository'
import { useGames } from './use-games'

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

describe('useGames', () => {
  it('resolves with data from an injected repository — no HTTP layer involved', async () => {
    const games: Game[] = [
      { id: '1', title: 'Racha de Rua', status: 'in_review', createdAt: new Date().toISOString() },
    ]
    const fakeRepository: GamesRepository = {
      list: async () => games,
      get: async () => games[0]!,
    }

    const { result } = renderHook(() => useGames(fakeRepository), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(games)
  })
})
