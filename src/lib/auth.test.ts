import { beforeEach, describe, expect, it } from 'vitest'
import type { User } from '@/api-types'
import { useAuthStore } from '@/lib/auth'

const studioUser: User = {
  id: '1',
  name: 'Estúdio',
  email: 'studio@example.com',
  role: 'studio',
}

describe('auth store', () => {
  beforeEach(() => {
    useAuthStore.getState().clearSession()
  })

  it('starts unauthenticated with no token', () => {
    const state = useAuthStore.getState()
    expect(state.status).toBe('unauthenticated')
    expect(state.accessToken).toBeNull()
    expect(state.role).toBeNull()
  })

  it('derives role from the backend user, not the caller', () => {
    useAuthStore.getState().setSession({ user: studioUser, accessToken: 'tok' })
    const state = useAuthStore.getState()
    expect(state.status).toBe('authenticated')
    expect(state.role).toBe('studio')
    expect(state.accessToken).toBe('tok')
  })

  it('clears everything on logout', () => {
    useAuthStore.getState().setSession({ user: studioUser, accessToken: 'tok' })
    useAuthStore.getState().clearSession()
    const state = useAuthStore.getState()
    expect(state.status).toBe('unauthenticated')
    expect(state.user).toBeNull()
    expect(state.accessToken).toBeNull()
  })
})
