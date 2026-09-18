import { Link, Outlet, useNavigate } from '@tanstack/react-router'
import { Icon, type IconName } from '@/components/icon'
import { Logo } from '@/components/common/Logo'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useLogout } from '@/features/auth/api/use-logout'
import { useAuthStore } from '@/lib/auth'

export type NavItem = {
  label: string
  to?: string
  icon: IconName
}

type AppShellProps = {
  area: string
  navItems: NavItem[]
}

function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

/** Layout autenticado: topbar com marca, navegação horizontal e cluster do usuário. */
export function AppShell({ area, navItems }: AppShellProps) {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const logout = useLogout()

  function handleLogout() {
    logout.mutate(undefined, {
      onSettled: () => void navigate({ to: '/login' }),
    })
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex h-16 items-center justify-between gap-6 border-b border-border/60 bg-surface/40 px-6 backdrop-blur-sm">
        <div className="flex min-w-0 items-center gap-8">
          <Logo />

          <nav className="flex items-center gap-1 overflow-x-auto" aria-label={area}>
            {navItems.map((item) =>
              item.to ? (
                <Link
                  key={item.label}
                  to={item.to}
                  className="flex items-center gap-2 border-b-2 border-transparent px-3 py-5 text-sm whitespace-nowrap text-foreground-strong transition-colors [&.active]:border-highlight [&.active]:text-highlight [&.active_svg]:text-highlight"
                  activeOptions={{ exact: item.to.split('/').length <= 2 }}
                >
                  <Icon name={item.icon} className="text-primary [.active_&]:text-highlight" />
                  {item.label}
                </Link>
              ) : (
                <span
                  key={item.label}
                  className="flex cursor-not-allowed items-center gap-2 px-3 py-5 text-sm whitespace-nowrap text-foreground-strong/50"
                  title="Em breve"
                >
                  <Icon name={item.icon} className="text-primary/50" />
                  {item.label}
                </span>
              ),
            )}
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-4">
          <button
            type="button"
            className="flex items-center gap-1 text-sm text-primary hover:text-highlight"
          >
            <Icon name="help" />
            Ajuda
          </button>

          <button
            type="button"
            className="flex items-center gap-1 rounded-diagonal bg-surface-raised px-2 py-1 text-sm text-foreground-strong"
          >
            <Icon name="language" />
            PT
          </button>

          <button
            type="button"
            aria-label="Notificações"
            className="text-primary hover:text-highlight"
          >
            <Icon name="notifications" />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button type="button" className="flex items-center gap-2">
                <Avatar className="size-8">
                  <AvatarFallback>{user ? initials(user.displayName) : '?'}</AvatarFallback>
                </Avatar>
                <span className="text-sm text-foreground-strong">
                  {user ? user.displayName : 'Sessão'}
                </span>
                <Icon name="chevron-down" className="size-4 text-muted" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={handleLogout} disabled={logout.isPending}>
                <Icon name="logout" />
                {logout.isPending ? 'Saindo...' : 'Sair'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="min-w-0 flex-1 p-6">
        <Outlet />
      </main>
    </div>
  )
}
