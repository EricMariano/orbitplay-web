import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { api } from '@/lib/api-client'
import { useCreateTest } from './use-create-test'
import { useEnterPlayerTest, usePlayerTest } from './use-player-test-preparation'
import { useTest } from './use-test'

// O TanStack Router decodifica os params: `/studio/games/..%2F..%2Forgs%2F…` chega
// ao hook como `../../orgs/…`, que sem encode trocaria o endpoint da requisição.
const hostile = '../../orgs/members/user-b/password-reset?x='
const encoded = '..%2F..%2Forgs%2Fmembers%2Fuser-b%2Fpassword-reset%3Fx%3D'

function wrapper({ children }: { children: ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}

afterEach(() => vi.restoreAllMocks())

describe('route params in API paths', () => {
  it('keeps a hostile game id inside its segment when creating a test', async () => {
    const post = vi.spyOn(api, 'post').mockResolvedValue({ id: 'test' })
    const { result } = renderHook(() => useCreateTest(hostile), { wrapper })
    await act(() => result.current.mutateAsync({ testModelKey: 'free_exploration' }))
    expect(post).toHaveBeenCalledWith(
      `/games/${encoded}/tests`,
      { testModelKey: 'free_exploration' },
      { idempotent: true },
    )
  })

  it('encodes the test id in studio and player reads and in joining a test', async () => {
    const get = vi.spyOn(api, 'get').mockResolvedValue({ id: 'test' })
    const post = vi.spyOn(api, 'post').mockResolvedValue({ id: 'participation' })
    renderHook(() => useTest(hostile), { wrapper })
    renderHook(() => usePlayerTest(hostile), { wrapper })
    await waitFor(() => expect(get).toHaveBeenCalledWith(`/tests/${encoded}`))
    await waitFor(() => expect(get).toHaveBeenCalledWith(`/player/tests/${encoded}`))

    const { result } = renderHook(() => useEnterPlayerTest(), { wrapper })
    await act(() => result.current.mutateAsync(hostile))
    expect(post).toHaveBeenCalledWith(`/player/tests/${encoded}/participations`, undefined, {
      idempotent: true,
    })
  })
})
