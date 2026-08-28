import { createFileRoute, redirect } from '@tanstack/react-router'
import { AppShell, type NavItem } from '@/components/common/AppShell'
import { useAuthStore } from '@/lib/auth'

const studioNav: NavItem[] = [
  { label: 'Início', to: '/studio', icon: 'dashboard' },
  { label: 'Jogos', to: '/studio/games', icon: 'games' },
]

export const Route = createFileRoute('/studio')({
  beforeLoad: () => {
    const { status, role } = useAuthStore.getState()
    if (status !== 'authenticated') {
      throw redirect({ to: '/login' })
    }
    if (role !== 'studio') {
      throw redirect({ to: '/player' })
    }
  },
  component: () => <AppShell area="Estúdio" navItems={studioNav} />,
})
