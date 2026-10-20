import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { api, ApiError } from '@/lib/api-client'
import { usePlayerCatalog, usePlayerLibrary } from './use-player-library'

function wrapper({ children }: { children: ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}

afterEach(() => vi.restoreAllMocks())

describe('player library API contracts', () => {
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
      const { result } = renderHook(
        () => (kind === 'library' ? usePlayerLibrary() : usePlayerCatalog()),
        { wrapper },
      )
      await waitFor(() => expect(result.current.isError).toBe(true))
      expect(result.current.error?.message).toBe('Repeated pagination cursor')
      expect(get).toHaveBeenCalledTimes(2)
    },
  )
})
