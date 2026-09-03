import { createFileRoute } from '@tanstack/react-router'
import { OpportunityDetailScreen } from '@/features/opportunities/components/OpportunityDetailScreen'

export const Route = createFileRoute('/player/games/$id')({
  component: PlayerGameDetailRoute,
})

function PlayerGameDetailRoute() {
  const { id } = Route.useParams()
  return <OpportunityDetailScreen opportunityId={id} />
}
