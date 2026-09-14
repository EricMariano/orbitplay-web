import { Link, useNavigate } from '@tanstack/react-router'
import orbitPlayLogo from '@/assets/login/orbitplay-logo.png'
import { Icon, type IconName } from '@/components/icon'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useLogout } from '@/features/auth/api/use-logout'
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
  const navigate = useNavigate()
  const logoutMutation = useLogout()

  async function logout() {
    try {
      await logoutMutation.mutateAsync()
    } finally {
      void navigate({ to: '/login' })
    }
  }

  return (
    <header className="flex h-20 min-w-[1280px] items-center justify-between gap-4 bg-background px-6 font-login-body [&_svg]:shrink-0">
      <div className="flex items-center gap-7">
        <img src={orbitPlayLogo} alt="OrbitPlay" className="h-[30px] w-[131px] object-contain" />
        <nav
          aria-label="Navegação principal"
          className="flex h-12 shrink-0 items-center gap-1 whitespace-nowrap"
        >
          {navEntries.map((entry) =>
            entry.to ? (
              <Link
                key={entry.label}
                to={entry.to}
                className="flex h-12 items-center gap-2 border-b-2 border-transparent px-3 text-sm text-white/75 transition-colors hover:text-white [&.active]:border-[#f8643b] [&.active]:text-[#f8643b]"
              >
                <Icon name={entry.icon} />
                {entry.label}
              </Link>
            ) : (
              <span
                key={entry.label}
                className="flex h-12 items-center gap-2 border-b-2 border-transparent px-3 text-sm text-white/75 [&_svg]:text-[#168cf3]"
              >
                <Icon name={entry.icon} />
                {entry.label}
              </span>
            ),
          )}
        </nav>
      </div>

      <div className="flex shrink-0 items-center gap-2 whitespace-nowrap">
        <Button variant="ghost" size="sm" className="text-white/75 hover:text-white">
          <Icon name="help" />
          Ajuda
        </Button>
        <Button variant="secondary" size="sm" className="gap-1.5 bg-white/15 text-white">
          <Icon name="globe" />
          PT
        </Button>
        <Button
          variant="secondary"
          size="icon-sm"
          className="bg-white/15 text-white"
          aria-label="Notificações"
        >
          <Icon name="bell" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-semibold text-white hover:bg-white/10"
            >
              <Avatar size="sm">
                <AvatarFallback>{user?.displayName?.[0]?.toUpperCase() ?? '?'}</AvatarFallback>
              </Avatar>
              {user?.displayName}
              <Icon name="chevron-down" className="size-3.5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => void logout()} disabled={logoutMutation.isPending}>
              <Icon name="logout" />
              {logoutMutation.isPending ? 'Saindo...' : 'Sair'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
