import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Icon } from '@/components/icon'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { BenchmarkEntry } from '../types'

function formatPriceDelta(cents: number) {
  return `+ R$${(cents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
}

const statusConfig: Record<
  BenchmarkEntry['status'],
  { label: string; variant: 'default' | 'highlight' | 'start' }
> = {
  continue: { label: 'Continuar', variant: 'default' },
  complete: { label: 'Completar', variant: 'highlight' },
  start: { label: 'Iniciar', variant: 'start' },
}

function BenchmarkProgressBar({ percent }: { percent: number }) {
  const isComplete = percent >= 100
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-white/80">
      <div
        className={cn('h-full rounded-full', isComplete ? 'bg-success' : 'bg-primary')}
        style={{ width: `${percent}%` }}
      />
    </div>
  )
}

/** Card "Benchmark de mercado" (Tela 02). Puramente apresentacional. */
export function BenchmarkCard({ entries }: { entries: BenchmarkEntry[] }) {
  return (
    <Card className="rounded-lg border border-white bg-stat-card-background py-4">
      <CardHeader className="px-4">
        <CardTitle className="text-sm font-medium text-stat-card-foreground">
          Benchmark de mercado
        </CardTitle>
        <CardAction>
          <Icon name="info" className="size-4 text-stat-card-muted" />
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-3 px-4">
        {entries.map((entry) => {
          const status = statusConfig[entry.status]
          return (
            <div
              key={entry.id}
              className="grid grid-cols-[minmax(0,120px)_1fr_auto_100px] items-center gap-4"
            >
              <p className="truncate text-sm text-stat-card-foreground">{entry.gameTitle}</p>

              <div className="flex items-center gap-2">
                <BenchmarkProgressBar percent={entry.progressPercent} />
                <span className="w-9 shrink-0 text-xs text-stat-card-muted">
                  {entry.progressPercent}%
                </span>
              </div>

              <span className="text-sm text-stat-card-muted">
                {formatPriceDelta(entry.priceDeltaCents)}
              </span>

              <Button size="sm" variant={status.variant} className="w-full">
                {status.label}
              </Button>
            </div>
          )
        })}

        <div className="flex justify-end">
          <span className="text-sm text-primary">Ir para meus testes →</span>
        </div>
      </CardContent>
    </Card>
  )
}
