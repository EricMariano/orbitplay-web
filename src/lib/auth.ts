import { create } from 'zustand'
import type { Role, User } from '@/api-types'

export type SessionStatus = 'unauthenticated' | 'authenticated'

type SessionState = {
  user: User | null
  /** Authoritative role from the backend (RN-03) — NOT the login tab. */
  role: Role | null
  /**
   * Access token kept ONLY in memory. Never persisted to localStorage /
   * sessionStorage. "Remember me" persistence will come from an httpOnly
   * cookie issued by the API — see the extension point below.
   */
  accessToken: string | null
  status: SessionStatus
}

type SessionActions = {
  setSession: (payload: { user: User; accessToken: string }) => void
  setAccessToken: (token: string) => void
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

  setAccessToken: (accessToken) => set({ accessToken }),

  clearSession: () => set({ ...initialState }),
}))

// --- Non-reactive accessors, for use outside React (e.g. the api-client) ---

export const getAccessToken = () => useAuthStore.getState().accessToken
export const clearSession = () => useAuthStore.getState().clearSession()

// TODO(remember-me): when the API ships the httpOnly refresh cookie, rehydrate
// the session on boot by calling POST /api/auth/refresh here (no token touches
// web storage). This is the single extension point for persistent login.
