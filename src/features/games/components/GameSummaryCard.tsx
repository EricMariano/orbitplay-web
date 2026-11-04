import { Link } from '@tanstack/react-router'
import type { Game } from '@/api-types'
import { Badge } from '@/components/ui/badge'
import { Icon, type IconName } from '@/components/icon'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { RoleGate } from '@/components/common/RoleGate'
import { STUDIO_ROLES } from '@/lib/auth'
import { EditGameDialog } from './EditGameDialog'
import { gameStatusLabels } from '../game-status'

export function GameSummaryCard({ game }: { game: Game }) {
  const isActive = game.status === 'active'
  const [editOpen, setEditOpen] = useState(false)

  return (
    <div className="group overflow-hidden rounded-diagonal border border-border bg-surface">
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
        <RoleGate allow={STUDIO_ROLES}>
          <Button
            type="button"
            size="icon-sm"
            variant="secondary"
            aria-label={`Editar ${game.title}`}
            className="pointer-events-none absolute top-2 right-2 opacity-0 shadow transition-opacity group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100"
            onClick={() => setEditOpen(true)}
          >
            <Icon name="edit" />
          </Button>
        </RoleGate>
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
        to="/studio/games/$gameId"
        params={{ gameId: game.id }}
        className="block w-full bg-gradient-to-l from-cta-configure-from to-cta-configure-to py-3 text-center text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        Configurar!
      </Link>
      {editOpen && <EditGameDialog game={game} open onOpenChange={setEditOpen} />}
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
