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

/** Authenticated layout: sidebar nav + topbar with the current user and logout. */
export function AppShell({ area, navItems }: AppShellProps) {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const clearSession = useAuthStore((s) => s.clearSession)

  function logout() {
    clearSession()
    void navigate({ to: '/login' })
  }

  return (
    <div className="grid min-h-dvh grid-cols-[220px_1fr]">
      <aside className="flex flex-col gap-1 border-r border-border bg-surface p-3">
        <div className="px-2 py-3 text-sm font-semibold text-foreground">
          OrbitPlay <span className="text-muted">· {area}</span>
        </div>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-muted transition-colors hover:bg-accent hover:text-foreground [&.active]:bg-accent [&.active]:text-foreground"
              activeOptions={{ exact: item.to.split('/').length <= 2 }}
            >
              <Icon name={item.icon} />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="flex h-14 items-center justify-between border-b border-border bg-surface/60 px-6">
          <span className="text-sm text-muted">{user ? user.name : 'Sessão'}</span>
          <Button variant="ghost" size="sm" onClick={logout}>
            <Icon name="logout" />
            Sair
          </Button>
        </header>
        <main className="min-w-0 flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
