import { createFileRoute } from '@tanstack/react-router'
import { GameDetailScreen } from '@/features/games/components/GameDetailScreen'

export const Route = createFileRoute('/studio/games/$id')({
  component: StudioGameDetailRoute,
})

function StudioGameDetailRoute() {
  const { id } = Route.useParams()
  return <GameDetailScreen gameId={id} />
}
