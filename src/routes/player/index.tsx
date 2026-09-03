import { createFileRoute } from '@tanstack/react-router'
import { PlayerHomeScreen } from '@/features/opportunities/components/PlayerHomeScreen'

export const Route = createFileRoute('/player/')({
  component: PlayerHomeScreen,
})
