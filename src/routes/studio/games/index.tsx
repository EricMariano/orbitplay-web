import { createFileRoute } from '@tanstack/react-router'
import { GamesListScreen } from '@/features/games/components/GamesListScreen'

export const Route = createFileRoute('/studio/games/')({
  component: GamesListScreen,
})
