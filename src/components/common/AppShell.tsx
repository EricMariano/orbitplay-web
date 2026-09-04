import { Link, Outlet, useNavigate } from '@tanstack/react-router'
import { Icon, type IconName } from '@/components/icon'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/lib/auth'

export type NavItem = {
  label: string
  to: string
  icon: IconName
}

type AppShellProps = {
  area: string
  navItems: NavItem[]
}

export function AppShell({ area, navItems }: AppShellProps) {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const clearSession = useAuthStore((s) => s.clearSession)

  function logout() {
    clearSession()
    void navigate({ to: '/login' })
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex h-16 items-center justify-between gap-6 border-b border-border/60 bg-surface/40 px-6 backdrop-blur-sm">
        <div className="flex min-w-0 items-center gap-8">
          <span className="shrink-0 text-sm font-semibold text-foreground">
            OrbitPlay <span className="text-muted">· {area}</span>
          </span>
          <nav className="flex items-center gap-1 overflow-x-auto">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm whitespace-nowrap text-muted transition-colors hover:bg-accent hover:text-foreground [&.active]:bg-accent [&.active]:text-foreground"
                activeOptions={{ exact: item.to.split('/').length <= 2 }}
              >
                <Icon name={item.icon} />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <span className="text-sm text-muted">{user ? user.name : 'Sessão'}</span>
          <Button variant="ghost" size="sm" onClick={logout}>
            <Icon name="logout" />
            Sair
          </Button>
        </div>
      </header>

      <main className="min-w-0 flex-1 p-6">
        <Outlet />
      </main>
    </div>
  )
}
