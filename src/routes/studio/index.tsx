import { createFileRoute } from '@tanstack/react-router'
import { StudioHomeScreen } from '@/features/games/components/StudioHomeScreen'

export const Route = createFileRoute('/studio/')({
  component: StudioHomeScreen,
})
