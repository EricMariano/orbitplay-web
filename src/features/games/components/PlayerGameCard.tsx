import { Link } from '@tanstack/react-router'
import type { Game } from '@/api-types'
import { Icon } from '@/components/icon'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCompactNumber } from '@/lib/format'

export function PlayerGameCard({ game }: { game: Game }) {
  const available = game.metrics.testsActive > 0

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
          <Badge className={available ? 'bg-success text-white' : ''}>
            {available ? 'Disponível' : 'Indisponível'}
          </Badge>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="truncate text-sm font-semibold text-foreground">{game.title}</h3>
          <span className="flex shrink-0 items-center gap-1 text-xs text-muted">
            <Icon name="users" className="size-3" />
            {formatCompactNumber(game.metrics.playersTotal)}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div>
            <p className="flex items-center gap-1 text-foreground">
              <Icon name="list-checks" className="size-3" />
              {game.metrics.testsActive}
            </p>
            <p className="text-muted">Testes abertos</p>
          </div>
          <div>
            <p className="text-foreground">{game.metrics.sessionsValid}</p>
            <p className="text-muted">Sessões válidas</p>
          </div>
          <div>
            <p className="text-foreground">
              {game.metrics.averageRating === null
                ? '—'
                : game.metrics.averageRating.toFixed(1).replace('.', ',')}
            </p>
            <p className="text-muted">Nota média</p>
          </div>
        </div>
        <Button asChild size="sm" className="mt-auto">
          <Link to="/player/games/$gameId" params={{ gameId: game.id }}>
            Ver detalhes
          </Link>
        </Button>
      </div>
    </div>
  )
}
