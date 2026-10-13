import { Link } from '@tanstack/react-router'
import type { Game } from '@/api-types'
import { Badge } from '@/components/ui/badge'
import { Icon, type IconName } from '@/components/icon'
import { cn } from '@/lib/utils'
import { gameStatusLabels } from '../game-status'

export function GameSummaryCard({ game }: { game: Game }) {
  const isActive = game.status === 'active'

  return (
    <div className="overflow-hidden rounded-diagonal border border-border bg-surface">
      <div className="relative aspect-[16/7] w-full">
        {game.coverUrl ? (
          <img src={game.coverUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-surface-raised">
            <Icon name="games" className="size-10 text-muted" />
          </div>
        )}

        <Badge
          className={cn(
            'absolute top-2 left-2',
            isActive
              ? 'bg-availability-available-background text-availability-available-foreground'
              : 'bg-availability-unavailable-background text-availability-unavailable-foreground',
          )}
        >
          {gameStatusLabels[game.status]}
        </Badge>
      </div>

      <div className="flex items-center justify-between border-b border-primary px-4 py-3">
        <h3 className="truncate font-semibold text-foreground-strong">{game.title}</h3>
        <span className="flex items-center gap-1 text-sm text-foreground-strong">
          <Icon name="user" className="size-4" />
          {game.metrics.playersTotal}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 px-4 py-4">
        <Metric icon="checklist" value={game.metrics.testsActive} label="Testes ativos" />
        <Metric icon="tests" value={game.metrics.testsTotal} label="Testes no total" />
        <Metric icon="score" value={game.metrics.sessionsValid} label="Sessões válidas" />
      </div>

      <Link
        to="/studio/games/$gameId/tests/new"
        params={{ gameId: game.id }}
        className="block w-full bg-gradient-to-l from-cta-configure-from to-cta-configure-to py-3 text-center text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        Configurar!
      </Link>
    </div>
  )
}

function Metric({ icon, value, label }: { icon: IconName; value: number; label: string }) {
  return (
    <div className="flex flex-col items-start gap-1">
      <span className="flex items-center gap-1 font-bold text-foreground-strong">
        <Icon name={icon} className="size-4" />
        {value}
      </span>
      <span className="text-xs text-muted">{label}</span>
    </div>
  )
}
