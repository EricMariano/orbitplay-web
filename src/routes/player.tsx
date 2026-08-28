import { createFileRoute, redirect } from '@tanstack/react-router'
import { AppShell, type NavItem } from '@/components/common/AppShell'
import { useAuthStore } from '@/lib/auth'

const playerNav: NavItem[] = [
  { label: 'Início', to: '/player', icon: 'dashboard' },
  { label: 'Oportunidades', to: '/player', icon: 'opportunities' },
]

export const Route = createFileRoute('/player')({
  beforeLoad: () => {
    const { status, role } = useAuthStore.getState()
    if (status !== 'authenticated') {
      throw redirect({ to: '/login' })
    }
    if (role !== 'player') {
      throw redirect({ to: '/studio' })
    }
  },
  component: () => <AppShell area="Jogador" navItems={playerNav} />,
})
