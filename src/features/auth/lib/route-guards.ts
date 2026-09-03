import { redirect } from '@tanstack/react-router'
import type { Role } from '@/api-types'
import { useAuthStore } from '@/lib/auth'
import { routeForRole } from './route-for-role'

/**
 * Guard for a role-scoped area (`/player`, `/studio`): bounces unauthenticated
 * visitors to `/login`, and authenticated-but-wrong-role visitors to their
 * own area. This exact check was duplicated between `routes/player.tsx` and
 * `routes/studio.tsx`; both now call `requireRole(...)` from their
 * `beforeLoad`, so the redirect rules live in exactly one place.
 */
export function requireRole(role: Role) {
  const { status, role: currentRole } = useAuthStore.getState()
  if (status !== 'authenticated') {
    throw redirect({ to: '/login' })
  }
  if (currentRole !== role) {
    // Invariant: role is always set once status is 'authenticated' (see
    // useAuthStore.setSession), so this cast is safe.
    throw redirect({ to: routeForRole(currentRole as Role) })
  }
}
