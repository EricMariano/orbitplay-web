import { createFileRoute, redirect } from '@tanstack/react-router'
import { homeRouteForRole, useAuthStore } from '@/lib/auth'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    const { status, role } = useAuthStore.getState()
    if (status !== 'authenticated' || !role) {
      throw redirect({ to: '/login' })
    }
    throw redirect({ to: homeRouteForRole(role) })
  },
})
