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
}

type SessionActions = {
  setSession: (payload: { user: AuthUser; accessToken: string }) => void
  clearSession: () => void
}

const initialState: SessionState = {
  user: null,
  role: null,
  accessToken: null,
  status: 'unauthenticated',
}

export const useAuthStore = create<SessionState & SessionActions>((set) => ({
  ...initialState,

  setSession: ({ user, accessToken }) =>
    set({
      user,
      role: user.role,
      accessToken,
      status: 'authenticated',
    }),

  clearSession: () => set({ ...initialState }),
}))

// --- Non-reactive accessors, for use outside React (e.g. the api-client) ---

export const getAccessToken = () => useAuthStore.getState().accessToken
export const clearSession = () => useAuthStore.getState().clearSession()

export function isStudioRole(role: Role) {
  return role !== 'player'
}

export function homeRouteForRole(role: Role): '/studio' | '/player' {
  return isStudioRole(role) ? '/studio' : '/player'
}
