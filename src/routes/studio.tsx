import { createFileRoute } from '@tanstack/react-router'
import { AppShell, type NavItem } from '@/components/common/AppShell'
import { requireRole } from '@/features/auth/lib/route-guards'

const studioNav: NavItem[] = [
  { label: 'Início', to: '/studio', icon: 'dashboard' },
  { label: 'Jogos', to: '/studio/games', icon: 'games' },
  { label: 'Testes', to: '/studio/tests', icon: 'tests' },
  { label: 'Relatórios', to: '/studio/reports', icon: 'reports' },
]

export const Route = createFileRoute('/studio')({
  beforeLoad: () => requireRole('studio'),
  component: () => <AppShell area="Estúdio" navItems={studioNav} />,
})
