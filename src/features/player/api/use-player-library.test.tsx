import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import { useAuthStore } from '@/lib/auth'
import { api, ApiError } from '@/lib/api-client'
import { usePlayerCatalog, usePlayerLibrary } from './use-player-library'

function wrapper({ children }: { children: ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}

function login(id: string) {
  useAuthStore.getState().setSession({
    accessToken: 'test',
    user: { id, email: `${id}@example.com`, displayName: id, organizationId: id, role: 'player' },
  })
}

beforeEach(() => login('a'))
afterEach(() => {
  vi.restoreAllMocks()
  useAuthStore.getState().clearSession()
})

describe('player library API contracts', () => {
  it.each(['library', 'catalog'] as const)(
    'isolates the %s cache when switching accounts',
    async (kind) => {
      const client = new QueryClient({
        defaultOptions: { queries: { retry: false, staleTime: 30_000 } },
      })
      const get = vi
        .spyOn(api, 'get')
        .mockResolvedValue({ data: [], nextCursor: null, seed: 'snapshot' })
      const hook = kind === 'library' ? usePlayerLibrary : usePlayerCatalog
      const { result } = renderHook(hook, {
        wrapper: ({ children }) => (
          <QueryClientProvider client={client}>{children}</QueryClientProvider>
        ),
      })
      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      act(() => login('b'))
      await waitFor(() => expect(get).toHaveBeenCalledTimes(2))
      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      client.clear()
    },
  )

  it('pages participations, deduplicates games and omits only removed games', async () => {
    const get = vi.spyOn(api, 'get').mockImplementation(async (path) => {
      if (path === '/player/participations?limit=100')
        return { data: [{ gameId: 'a' }, { gameId: 'a' }], nextCursor: 'next' }
      if (path === '/player/participations?limit=100&cursor=next')
        return { data: [{ gameId: 'b' }, { gameId: 'removed' }], nextCursor: null }
      if (path === '/player/games/removed') throw new ApiError(404, null, 'removed')
      return { game: { id: path.split('/').at(-1) } }
    })
    const { result } = renderHook(() => usePlayerLibrary(), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual([{ id: 'a' }, { id: 'b' }])
    expect(get.mock.calls.filter(([path]) => path === '/player/games/a')).toHaveLength(1)
  })

  it('preserves the feed snapshot and deduplicates games across pages', async () => {
    const get = vi
      .spyOn(api, 'get')
      .mockResolvedValueOnce({ data: [{ id: 'a' }], nextCursor: 'next', seed: 'snapshot' })
      .mockResolvedValueOnce({
        data: [{ id: 'a' }, { id: 'b' }],
        nextCursor: null,
        seed: 'snapshot',
      })
    const { result } = renderHook(() => usePlayerCatalog(), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual([{ id: 'a' }, { id: 'b' }])
    expect(get.mock.calls[1]?.[0]).toBe('/player/feed?limit=100&cursor=next&seed=snapshot')
  })

  it('surfaces unavailable services instead of showing a partial library', async () => {
    vi.spyOn(api, 'get')
      .mockResolvedValueOnce({ data: [{ gameId: 'a' }], nextCursor: null })
      .mockRejectedValueOnce(new ApiError(503, null, 'unavailable'))
    const { result } = renderHook(() => usePlayerLibrary(), { wrapper })
    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error).toMatchObject({ status: 503 })
  })

  it.each(['library', 'catalog'] as const)(
    'rejects a repeated pagination cursor in %s',
    async (kind) => {
      const get = vi
        .spyOn(api, 'get')
        .mockResolvedValue({ data: [], nextCursor: 'same', seed: 'snapshot' })
      const hook = kind === 'library' ? usePlayerLibrary : usePlayerCatalog
      const { result } = renderHook(hook, { wrapper })
      await waitFor(() => expect(result.current.isError).toBe(true))
      expect(result.current.error?.message).toBe('Repeated pagination cursor')
      expect(get).toHaveBeenCalledTimes(2)
    },
  )
})
