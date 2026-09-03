import { createFileRoute } from '@tanstack/react-router'
import { AppShell, type NavItem } from '@/components/common/AppShell'
import { requireRole } from '@/features/auth/lib/route-guards'

const playerNav: NavItem[] = [
  { label: 'Início', to: '/player', icon: 'dashboard' },
  { label: 'Meus jogos', to: '/player/games', icon: 'games' },
  { label: 'Relatórios', to: '/player/reports', icon: 'reports' },
]

export const Route = createFileRoute('/player')({
  beforeLoad: () => requireRole('player'),
  component: () => <AppShell area="Jogador" navItems={playerNav} />,
})
