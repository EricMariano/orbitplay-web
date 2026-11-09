import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { api } from '@/lib/api-client'
import { useAcceptInvite, useInvitePreview } from './use-accept-invite'
import { useResendInvite } from './use-resend-invite'

function wrapper({ children }: { children: ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}

afterEach(() => vi.restoreAllMocks())

describe('invite acceptance API contracts', () => {
  it('previews with the token in the body of a public POST, never in the URL', async () => {
    const post = vi.spyOn(api, 'post').mockResolvedValue({
      organizationName: 'Studio A',
      role: 'studio',
      email: 'a@b.dev',
      accountExists: false,
      birthdateRequired: true,
    })
    const { result } = renderHook(() => useInvitePreview('raw-token'), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(post).toHaveBeenCalledWith(
      '/auth/invite/preview',
      { token: 'raw-token' },
      { auth: false },
    )
  })

  it('does not call the API without a token', () => {
    const post = vi.spyOn(api, 'post')
    const { result } = renderHook(() => useInvitePreview(''), { wrapper })
    expect(result.current.fetchStatus).toBe('idle')
    expect(post).not.toHaveBeenCalled()
  })

  it('accepts through the public endpoint with the form payload', async () => {
    const post = vi
      .spyOn(api, 'post')
      .mockResolvedValue({ message: 'ok', email: 'a@b.dev', organizationName: 'Studio A' })
    const { result } = renderHook(() => useAcceptInvite(), { wrapper })

    await result.current.mutateAsync({ token: 't', password: 'Senha1234', birthdate: '1995-06-15' })
    expect(post).toHaveBeenCalledWith(
      '/auth/invite/accept',
      { token: 't', password: 'Senha1234', birthdate: '1995-06-15' },
      { auth: false },
    )
  })

  it('resends an invite for the member (escaping the id)', async () => {
    const post = vi.spyOn(api, 'post').mockResolvedValue({ message: 'Convite reenviado.' })
    const { result } = renderHook(() => useResendInvite(), { wrapper })

    await result.current.mutateAsync('user/1')
    expect(post).toHaveBeenCalledWith('/orgs/members/user%2F1/invite/resend')
  })
})
