import { Link } from '@tanstack/react-router'
import type { Game } from '@/api-types'
import { CoverBanner } from '@/components/common/CoverBanner'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Icon } from '@/components/icon'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getGameStatusPresentation } from '../lib/game-status'

type GameCardProps = {
  game: Game
}

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

/**
 * Presentational: renders a single game as a card. Takes a plain `Game`
 * prop instead of fetching its own data, so it stays reusable and
 * unit-testable without a QueryClient (SRP).
 */
export function GameCard({ game }: GameCardProps) {
  const status = getGameStatusPresentation(game.status)

  return (
    <Card className="gap-0 overflow-hidden p-0">
      <CoverBanner
        seed={game.id}
        title={game.title}
        imageUrl={game.coverUrl}
        topRight={<StatusBadge label={status.label} tone={status.tone} />}
      />
      <CardContent className="flex flex-col gap-3 px-4 py-4">
        <div className="flex items-baseline justify-between gap-2">
          <p className="truncate text-sm font-medium text-foreground">{game.title}</p>
          <span className="shrink-0 text-xs text-muted">
            {dateFormatter.format(new Date(game.createdAt))}
          </span>
        </div>
        <div className="flex gap-2">
          <Button asChild size="sm" className="flex-1">
            <Link to="/studio/games/$id" params={{ id: game.id }}>
              Gerenciar
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link to="/studio/reports" aria-label="Relatórios de bugs">
              <Icon name="bug" />
              Bugs
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
