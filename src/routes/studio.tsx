import { createFileRoute, redirect } from '@tanstack/react-router'
import { AppShell, type NavItem } from '@/components/common/AppShell'
import { isStudioRole, useAuthStore } from '@/lib/auth'

const studioNav: NavItem[] = [
  { label: 'Home', to: '/studio', icon: 'dashboard' },
  { label: 'Meus Jogos', to: '/studio/games', icon: 'games' },
  { label: 'Membros', to: '/studio/members', icon: 'users' },
  { label: 'Acessos', to: '/studio/access', icon: 'lock' },
  { label: 'Plug-in Telemetria', to: '/studio/telemetry', icon: 'plug' },
  { label: 'Benchmark', to: '/studio/benchmark', icon: 'reports' },
  { label: 'Tutorial e formação', to: '/studio/training', icon: 'insights' },
  { label: 'Comunidade', to: '/studio/community', icon: 'user' },
]

export const Route = createFileRoute('/studio')({
  beforeLoad: () => {
    const { status, role } = useAuthStore.getState()
    if (status !== 'authenticated') {
      throw redirect({ to: '/login' })
    }
    if (!role || !isStudioRole(role)) {
      throw redirect({ to: '/player' })
    }
  },
  component: () => <AppShell area="Estúdio" navItems={studioNav} />,
})
