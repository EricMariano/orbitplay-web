import type { Game } from '@/api-types'
import { StatCard } from '@/components/common/StatCard'

type GamesSummaryStatsProps = {
  games: Game[]
}

function countByStatus(games: Game[], status: Game['status']): number {
  return games.filter((game) => game.status === status).length
}

/**
 * Summary row shown above the games grid. Derives every number from the
 * same `games` list the grid renders instead of a separate summary
 * endpoint, so there's exactly one source of truth to keep in sync.
 */
export function GamesSummaryStats({ games }: GamesSummaryStatsProps) {
  return (
    <div className="mb-6 flex flex-wrap gap-4">
      <StatCard label="Jogos ativos" value={games.length} />
      <StatCard label="Em revisão" value={countByStatus(games, 'in_review')} />
      <StatCard label="Publicados" value={countByStatus(games, 'published')} />
      <StatCard label="Rascunhos" value={countByStatus(games, 'draft')} />
    </div>
  )
}
