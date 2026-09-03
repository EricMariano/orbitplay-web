import type { Opportunity } from '@/api-types'
import { OpportunityCard } from './OpportunityCard'
import { RequestAccessCard } from './RequestAccessCard'

type OpportunitiesGridProps = {
  opportunities: Opportunity[]
  showRequestAccess?: boolean
}

/**
 * Lays out the player's opportunities as a responsive card grid, plus an
 * optional trailing "request access" tile. Pure/presentational (SRP / DIP).
 */
export function OpportunitiesGrid({
  opportunities,
  showRequestAccess = true,
}: OpportunitiesGridProps) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5">
      {opportunities.map((opportunity) => (
        <OpportunityCard key={opportunity.id} opportunity={opportunity} />
      ))}
      {showRequestAccess ? <RequestAccessCard /> : null}
    </div>
  )
}
