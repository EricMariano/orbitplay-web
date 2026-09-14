import { beforeEach, describe, expect, it } from 'vitest'
import type { AuthUser } from '@/api-types'
import { homeRouteForRole, isStudioRole, useAuthStore } from '@/lib/auth'

const studioUser: AuthUser = {
  userId: '00000000-0000-0000-0000-000000000001',
  displayName: 'Estúdio',
  email: 'studio@example.com',
  organizationId: '00000000-0000-0000-0000-000000000002',
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

  it.each(['owner', 'admin', 'studio'] as const)(
    'routes the %s role to the studio area',
    (role) => {
      expect(isStudioRole(role)).toBe(true)
      expect(homeRouteForRole(role)).toBe('/studio')
    },
  )

  it('routes the player role to the player area', () => {
    expect(isStudioRole('player')).toBe(false)
    expect(homeRouteForRole('player')).toBe('/player')
  })
})
