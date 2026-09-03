import { createFileRoute } from '@tanstack/react-router'
import { LoginScreen } from '@/features/auth/components/LoginScreen'

export const Route = createFileRoute('/login')({
  component: LoginScreen,
})
