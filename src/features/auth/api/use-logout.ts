import { useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '@/lib/auth'

/**
 * Clears the session and returns to /login. Previously inlined inside
 * `AppShell`, which mixed layout rendering with the auth/navigation
 * side-effect. Extracting it means any screen can trigger a logout the same
 * way, and `AppShell` no longer needs to know how logging out works (SRP).
 */
export function useLogout() {
  const navigate = useNavigate()
  const clearSession = useAuthStore((s) => s.clearSession)

  return function logout() {
    clearSession()
    void navigate({ to: '/login' })
  }
}
