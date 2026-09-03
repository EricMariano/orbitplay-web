import type { Opportunity } from '@/api-types'
import { StatCard } from '@/components/common/StatCard'

type OpportunitiesSummaryStatsProps = {
  opportunities: Opportunity[]
}

function countByStatus(opportunities: Opportunity[], status: Opportunity['status']): number {
  return opportunities.filter((opportunity) => opportunity.status === status).length
}

/**
 * Summary row shown above the opportunities grid. Mirrors
 * `GamesSummaryStats` — see that file for the "derive from the same list"
 * rationale.
 */
export function OpportunitiesSummaryStats({ opportunities }: OpportunitiesSummaryStatsProps) {
  return (
    <div className="mb-6 flex flex-wrap gap-4">
      <StatCard label="Oportunidades" value={opportunities.length} />
      <StatCard label="Abertas" value={countByStatus(opportunities, 'open')} />
      <StatCard label="Em andamento" value={countByStatus(opportunities, 'in_progress')} />
      <StatCard label="Encerradas" value={countByStatus(opportunities, 'closed')} />
    </div>
  )
}
