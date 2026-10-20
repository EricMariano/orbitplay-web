import { EmptyState } from '@/components/common/EmptyState'
import { QueryBoundary } from '@/components/common/QueryBoundary'
import { usePlayerFeed } from '@/features/player/api/use-player-feed'
import { PlayerGameCard } from '@/features/games/components/PlayerGameCard'
import { SectionHeader } from './SectionHeader'

/** Quantos jogos do feed aparecem na Home. */
const HIGHLIGHT_LIMIT = 4

export function HighlightedGamesSection() {
  const games = usePlayerFeed(HIGHLIGHT_LIMIT)

  return (
    <section>
      <SectionHeader title="Destaques para você" linkLabel="Ir para jogos" linkTo="/player/games" />
      <QueryBoundary
        query={games}
        emptyFallback={
          <EmptyState
            icon="games"
            title="Nenhum destaque no momento"
            description="Volte em breve para novas oportunidades de teste."
          />
        }
      >
        {(data) => (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {data.map((game) => (
              <PlayerGameCard key={game.id} game={game} />
            ))}
          </div>
        )}
      </QueryBoundary>
    </section>
  )
}
