import { beforeEach, describe, expect, it } from 'vitest'
import type { AuthUser } from '@/api-types'
import { useAuthStore } from '@/lib/auth'
import { queryClient } from './query-client'

const user: AuthUser = {
  id: 'user-a',
  organizationId: 'org-a',
  role: 'owner',
  email: 'a@example.test',
  displayName: 'A',
}

describe('query cache session isolation', () => {
  beforeEach(() => {
    useAuthStore.getState().setSession({ user, accessToken: 'token' })
    queryClient.setQueryData(['games'], { secret: 'account A' })
  })

  it('removes cached data immediately on logout', () => {
    useAuthStore.getState().clearSession()
    expect(queryClient.getQueryData(['games'])).toBeUndefined()
  })

  it('removes cached data when another account logs in', () => {
    useAuthStore.getState().setSession({ user: { ...user, id: 'user-b' }, accessToken: 'other' })
    expect(queryClient.getQueryData(['games'])).toBeUndefined()
  })

  it('keeps queries during a token refresh in the same session', () => {
    useAuthStore
      .getState()
      .refreshSession({ user, accessToken: 'new' }, useAuthStore.getState().revision)
    expect(queryClient.getQueryData(['games'])).toEqual({ secret: 'account A' })
  })

  it('removes queries if permissions change during refresh', () => {
    useAuthStore
      .getState()
      .refreshSession(
        { user: { ...user, role: 'studio' }, accessToken: 'new' },
        useAuthStore.getState().revision,
      )
    expect(queryClient.getQueryData(['games'])).toBeUndefined()
  })
})
