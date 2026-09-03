import { useNavigate } from '@tanstack/react-router'
import type { Role, User } from '@/api-types'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { routeForRole } from '@/features/auth/lib/route-for-role'
import { useAuthStore } from '@/lib/auth'

/**
 * DEV-only shortcut to seed a session without the API (the API doesn't exist
 * yet in this setup phase). Mirrors "session filled manually in the store" from
 * the acceptance criteria and powers the E2E smoke test. Never rendered in
 * prod — the caller gates it behind `import.meta.env.DEV`. See DECISIONS.md.
 */
export function DevLoginShortcut() {
  const navigate = useNavigate()
  const setSession = useAuthStore((s) => s.setSession)

  function devLogin(role: Role) {
    const user: User = {
      id: `dev-${role}`,
      name: role === 'studio' ? 'Estúdio Dev' : 'Jogador Dev',
      email: `${role}@dev.local`,
      role,
    }
    setSession({ user, accessToken: 'dev-token' })
    void navigate({ to: routeForRole(role) })
  }

  return (
    <div className="space-y-2">
      <Separator />
      <p className="text-xs text-muted">Atalhos de desenvolvimento (sem API)</p>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => devLogin('studio')}
          data-testid="dev-login-studio"
        >
          Entrar como estúdio
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => devLogin('player')}
          data-testid="dev-login-player"
        >
          Entrar como jogador
        </Button>
      </div>
    </div>
  )
}
