import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/lib/auth'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    const { status, role } = useAuthStore.getState()
    if (status !== 'authenticated') {
      throw redirect({ to: '/login' })
    }
    throw redirect({ to: role === 'studio' ? '/studio' : '/player' })
  },
})
