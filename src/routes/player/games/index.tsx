import { createFileRoute } from '@tanstack/react-router'
import { PlayerLibraryScreen } from '@/features/opportunities/components/PlayerLibraryScreen'

export const Route = createFileRoute('/player/games/')({
  component: PlayerLibraryScreen,
})
