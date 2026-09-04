import { Badge } from '@/components/ui/badge'
import { Icon } from '@/components/icon'
import { cn } from '@/lib/utils'
import type { GameCardData } from '../types'

function formatBRL(cents: number) {
  const value = (cents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })
  return (
    <>
      <span className="text-xs text-muted">R$</span>
      <span className="text-lg font-bold text-foreground-strong">{value}</span>
    </>
  )
}

export function GameSummaryCard({ game }: { game: GameCardData }) {
  const isAvailable = game.availability === 'available'

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
              isAvailable
                ? 'bg-availability-available-background text-availability-available-foreground'
                : 'bg-availability-unavailable-background text-availability-unavailable-foreground',
            )}
          >
            {isAvailable ? 'Disponível' : 'Indisponível'}
          </Badge>
          {game.availabilityDetail ? (
            <Badge className="gap-1 bg-background/70 text-foreground-strong">
              <Icon name="clock" className="size-3" />
              {game.availabilityDetail}
            </Badge>
          ) : null}
        </div>

        {game.isNew ? (
          <Badge className="absolute top-2 right-2 bg-highlight/25 text-highlight">Novo</Badge>
        ) : null}
      </div>

      <div className="flex items-center justify-between border-b border-primary px-4 py-3">
        <h3 className="font-semibold text-foreground-strong">{game.title}</h3>
        <span className="flex items-center gap-1 text-sm text-foreground-strong">
          <Icon name="user" className="size-4" />
          {game.playersCount}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 px-4 py-4">
        <div className="flex flex-col items-start gap-1">
          <span className="flex items-center gap-1 font-bold text-foreground-strong">
            <Icon name="checklist" className="size-4" />
            {game.openTestsCount}
          </span>
          <span className="text-xs text-muted">Testes abertos</span>
        </div>
        <div className="flex flex-col items-start gap-1">
          <span>{formatBRL(game.maxRewardCents)}</span>
          <span className="text-xs text-muted">Prêmio máximo</span>
        </div>
        <div className="flex flex-col items-start gap-1">
          <span>{formatBRL(game.remainingRewardCents)}</span>
          <span className="text-xs text-muted">Prêmio restante</span>
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
