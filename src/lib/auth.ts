import { create } from 'zustand'
import type { AuthUser, Role } from '@/api-types'

export type SessionStatus = 'unauthenticated' | 'authenticated'

type SessionState = {
  user: AuthUser | null
  /** Authoritative role from the backend (RN-03), never the login tab. */
  role: Role | null
  /** Access token stays in memory; persistence is handled by the API's httpOnly cookie. */
  accessToken: string | null
  status: SessionStatus
  revision: number
}

type SessionActions = {
  setSession: (payload: { user: AuthUser; accessToken: string }) => void
  refreshSession: (payload: { user: AuthUser; accessToken: string }, revision: number) => boolean
  clearSession: () => void
}

const initialState: SessionState = {
  user: null,
  role: null,
  accessToken: null,
  status: 'unauthenticated',
  revision: 0,
}

export const useAuthStore = create<SessionState & SessionActions>((set) => ({
  ...initialState,

  setSession: ({ user, accessToken }) =>
    set((state) => ({
      user,
      role: user.role,
      accessToken,
      status: 'authenticated',
      revision: state.revision + 1,
    })),

  refreshSession: ({ user, accessToken }, revision) => {
    let applied = false
    set((state) => {
      if (state.revision !== revision) return state
      applied = true
      return { user, role: user.role, accessToken, status: 'authenticated' }
    })
    return applied
  },

  clearSession: () => set((state) => ({ ...initialState, revision: state.revision + 1 })),
}))

// --- Non-reactive accessors, for use outside React (e.g. the api-client) ---

export const getAccessToken = () => useAuthStore.getState().accessToken
export const clearSession = () => useAuthStore.getState().clearSession()

/** Papéis com acesso de estúdio — espelha STUDIO_ROLES do orbitplay-api. */
export const STUDIO_ROLES: Role[] = ['owner', 'admin', 'studio']

export function isStudioRole(role: Role) {
  return STUDIO_ROLES.includes(role)
}

export function homeRouteForRole(role: Role): '/studio' | '/player' {
  return isStudioRole(role) ? '/studio' : '/player'
}
