import type { ReactNode } from 'react'
import { EmptyState } from '@/components/common/EmptyState'
import { PageHeader, type Breadcrumb } from '@/components/common/PageHeader'
import { QueryBoundary } from '@/components/common/QueryBoundary'
import { useGames } from '@/features/games/api/use-games'
import { AddGameCard } from './AddGameCard'
import { GamesGrid } from './GamesGrid'
import { GamesSummaryStats } from './GamesSummaryStats'

type GamesLibraryScreenProps = {
  title: string
  breadcrumbs?: Breadcrumb[]
  emptyTitle: string
  emptyDescription: string
  emptyAction?: ReactNode
}

/**
 * Shared composer for the studio's card-based game library (dashboard and
 * "Gerenciar jogos"). Route-level wrappers only vary copy; fetching, empty
 * handling and the grid live here so neither screen reimplements them (SRP).
 */
export function GamesLibraryScreen({
  title,
  breadcrumbs,
  emptyTitle,
  emptyDescription,
  emptyAction,
}: GamesLibraryScreenProps) {
  const games = useGames()

  return (
    <div>
      <PageHeader title={title} breadcrumbs={breadcrumbs} />
      <QueryBoundary
        query={games}
        emptyFallback={
          <div className="space-y-6">
            <EmptyState
              icon="games"
              title={emptyTitle}
              description={emptyDescription}
              action={emptyAction}
            />
            <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-5">
              <AddGameCard />
            </div>
          </div>
        }
      >
        {(data) => (
          <>
            <GamesSummaryStats games={data} />
            <GamesGrid games={data} />
          </>
        )}
      </QueryBoundary>
    </div>
  )
}
