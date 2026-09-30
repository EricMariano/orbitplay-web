import { Badge } from '@/components/ui/badge'
import { Icon } from '@/components/icon'
import { cn } from '@/lib/utils'
import type { Game } from '@/api-types'

export function GameSummaryCard({ game }: { game: Game }) {
  const isActive = game.status === 'active'
  const statusLabel = { active: 'Ativo', draft: 'Rascunho', archived: 'Arquivado' }[game.status]

  return (
    <div className="overflow-hidden rounded-diagonal border border-border bg-surface">
      <div className="relative aspect-[16/7] w-full">
        {game.coverUrl ? (
          <img src={game.coverUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-surface-raised" />
        )}

        <div className="absolute top-2 left-2 flex items-center gap-2">
          <Badge
            className={cn(
              isActive
                ? 'bg-availability-available-background text-availability-available-foreground'
                : 'bg-availability-unavailable-background text-availability-unavailable-foreground',
            )}
          >
            {statusLabel}
          </Badge>
        </div>
      </div>

      <div className="flex items-center justify-between border-b border-primary px-4 py-3">
        <h3 className="font-semibold text-foreground-strong">{game.title}</h3>
        <span className="flex items-center gap-1 text-sm text-foreground-strong">
          <Icon name="user" className="size-4" />
          {game.metrics.playersTotal}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 px-4 py-4">
        <div className="flex flex-col items-start gap-1">
          <span className="flex items-center gap-1 font-bold text-foreground-strong">
            <Icon name="checklist" className="size-4" />
            {game.metrics.testsActive}
          </span>
          <span className="text-xs text-muted">Testes abertos</span>
        </div>
        <div className="flex flex-col items-start gap-1">
          <span className="font-bold text-foreground-strong">{game.metrics.testsTotal}</span>
          <span className="text-xs text-muted">Testes totais</span>
        </div>
        <div className="flex flex-col items-start gap-1">
          <span className="font-bold text-foreground-strong">{game.metrics.sessionsValid}</span>
          <span className="text-xs text-muted">Sessões válidas</span>
        </div>
      </div>

      <button
        type="button"
        className="w-full bg-gradient-to-l from-cta-configure-from to-cta-configure-to py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        Configurar!
      </button>
    </div>
  )
}
