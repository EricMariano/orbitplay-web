import type { HighlightedGame } from '@/api-types'
import { EmptyState } from '@/components/common/EmptyState'
import { QueryBoundary } from '@/components/common/QueryBoundary'
import { Icon } from '@/components/icon'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useHighlightedGames } from '@/features/games/api/use-highlighted-games'
import { formatCompactNumber, formatCountdown, formatCurrency } from '@/lib/format'
import { SectionHeader } from './SectionHeader'

export function HighlightedGamesSection() {
  const games = useHighlightedGames()

  return (
    <section>
      <SectionHeader title="Destaques para você" linkLabel="Ir para jogos" />
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
              <HighlightedGameCard key={game.id} game={game} />
            ))}
          </div>
        )}
      </QueryBoundary>
    </section>
  )
}

function HighlightedGameCard({ game }: { game: HighlightedGame }) {
  const countdown = formatCountdown(game.endsAt)

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-surface">
      <div className="relative h-32">
        {game.coverUrl ? (
          <img src={game.coverUrl} alt="" className="size-full object-cover" />
        ) : (
          <div className="flex size-full items-center justify-center bg-surface-raised">
            <Icon name="games" className="size-8 text-muted" />
          </div>
        )}
        <div className="absolute top-2 left-2 flex gap-1">
          <Badge className={game.status === 'available' ? 'bg-success text-white' : ''}>
            {game.status === 'available' ? 'Disponível' : 'Indisponível'}
          </Badge>
          {game.isNew ? <Badge variant="secondary">Novo</Badge> : null}
        </div>
        {countdown ? (
          <span className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-background/80 px-2 py-0.5 text-[11px] text-foreground">
            <Icon name="clock" className="size-3" />
            {countdown}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="truncate text-sm font-semibold text-foreground">{game.title}</h3>
          <span className="flex shrink-0 items-center gap-1 text-xs text-muted">
            <Icon name="users" className="size-3" />
            {formatCompactNumber(game.playersCount)}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div>
            <p className="flex items-center gap-1 text-foreground">
              <Icon name="list-checks" className="size-3" />
              {game.openTests}
            </p>
            <p className="text-muted">Testes abertos</p>
          </div>
          <div>
            <p className="text-foreground">{formatCurrency(game.maxReward)}</p>
            <p className="text-muted">Prêmio máximo</p>
          </div>
          <div>
            <p className="text-foreground">{formatCurrency(game.remainingReward)}</p>
            <p className="text-muted">Prêmio restante</p>
          </div>
        </div>
        <Button size="sm" className="mt-auto">
          Testar!
        </Button>
      </div>
    </div>
  )
}
