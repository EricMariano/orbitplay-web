import type { Role } from '@/api-types'

/**
 * Single source of truth for "which area does this role land on". Before
 * the refactor this ternary was duplicated in `routes/index.tsx` and
 * `routes/login.tsx`, with the risk of the two drifting apart. Every caller
 * (root redirect, login success, dev shortcut, role guards) now goes
 * through here instead.
 */
export function routeForRole(role: Role): '/studio' | '/player' {
  return role === 'studio' ? '/studio' : '/player'
}
