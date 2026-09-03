import { createFileRoute, redirect } from '@tanstack/react-router'
import { routeForRole } from '@/features/auth/lib/route-for-role'
import { useAuthStore } from '@/lib/auth'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    const { status, role } = useAuthStore.getState()
    if (status !== 'authenticated') {
      throw redirect({ to: '/login' })
    }
    // Invariant: role is always set once status is 'authenticated'.
    throw redirect({ to: routeForRole(role!) })
  },
})
