import { Link, useNavigate } from '@tanstack/react-router'
import { Icon, type IconName } from '@/components/icon'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuthStore } from '@/lib/auth'

type NavEntry = {
  label: string
  icon: IconName
  /** Omitted when the destination screen doesn't exist yet — rendered inert. */
  to?: string
}

const navEntries: NavEntry[] = [
  { label: 'Home', icon: 'home', to: '/player' },
  { label: 'Jogos', icon: 'games' },
  { label: 'Meus testes e ganhos', icon: 'tests' },
  { label: 'Tutorial e formação', icon: 'graduation-cap' },
  { label: 'Comunidade', icon: 'users' },
]

/** Top navbar for the player area — replaces the sidebar shell used by /studio. */
export function PlayerTopNav() {
  const user = useAuthStore((s) => s.user)
  const clearSession = useAuthStore((s) => s.clearSession)
  const navigate = useNavigate()

  function logout() {
    clearSession()
    void navigate({ to: '/login' })
  }

  return (
    <header className="flex h-16 items-center justify-between gap-6 border-b border-border bg-surface px-6">
      <div className="flex items-center gap-8">
        <span className="text-base font-semibold text-foreground">
          Orbit<span className="text-primary">Play</span>
        </span>
        <nav className="flex items-center gap-1">
          {navEntries.map((entry) =>
            entry.to ? (
              <Link
                key={entry.label}
                to={entry.to}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted transition-colors hover:bg-accent hover:text-foreground [&.active]:bg-accent [&.active]:text-foreground"
              >
                <Icon name={entry.icon} />
                {entry.label}
              </Link>
            ) : (
              <span
                key={entry.label}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted"
              >
                <Icon name={entry.icon} />
                {entry.label}
              </span>
            ),
          )}
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" className="text-muted">
          <Icon name="help" />
          Ajuda
        </Button>
        <Button variant="ghost" size="sm" className="gap-1.5 text-muted">
          <Icon name="globe" />
          PT
        </Button>
        <Button variant="ghost" size="icon-sm" className="text-muted" aria-label="Notificações">
          <Icon name="bell" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-foreground hover:bg-accent"
            >
              <Avatar size="sm">
                <AvatarFallback>{user?.name?.[0]?.toUpperCase() ?? '?'}</AvatarFallback>
              </Avatar>
              {user?.name}
              <Icon name="chevron-down" className="size-3.5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={logout}>
              <Icon name="logout" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
