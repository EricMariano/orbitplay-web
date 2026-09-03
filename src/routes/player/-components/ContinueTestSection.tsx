import { EmptyState } from '@/components/common/EmptyState'
import { QueryBoundary } from '@/components/common/QueryBoundary'
import { Icon } from '@/components/icon'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useContinueTest } from '@/features/tests/api/use-continue-test'
import { formatCompactNumber, formatCountdown, formatCurrency } from '@/lib/format'
import { SectionHeader } from './SectionHeader'

export function ContinueTestSection() {
  const continueTest = useContinueTest()

  return (
    <section>
      <SectionHeader title="Continue seu teste" linkLabel="Ir para meus testes" />
      <QueryBoundary
        query={continueTest}
        emptyFallback={
          <EmptyState
            icon="tests"
            title="Nenhum teste em andamento"
            description="Comece um teste nos destaques abaixo para continuá-lo por aqui."
          />
        }
      >
        {(data) => {
          const countdown = formatCountdown(data.endsAt)
          return (
            <div className="grid overflow-hidden rounded-xl border border-border bg-surface sm:grid-cols-[280px_1fr]">
              <div className="relative h-44 sm:h-full">
                {data.coverUrl ? (
                  <img src={data.coverUrl} alt="" className="size-full object-cover" />
                ) : (
                  <div className="flex size-full items-center justify-center bg-surface-raised">
                    <Icon name="games" className="size-10 text-muted" />
                  </div>
                )}
                {countdown ? (
                  <span className="absolute top-3 left-3 rounded-full bg-background/80 px-2 py-1 text-xs text-foreground">
                    Termina em {countdown}
                  </span>
                ) : null}
              </div>
              <div className="flex flex-col gap-4 p-5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-lg font-semibold text-foreground">{data.gameTitle}</h3>
                  <span className="flex shrink-0 items-center gap-1 text-sm text-muted">
                    <Icon name="users" className="size-4" />
                    {formatCompactNumber(data.playersCount)}
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  {data.tracks.map((track) => (
                    <div key={track.label} className="flex items-center gap-3">
                      <span className="w-32 shrink-0 truncate text-sm text-muted">
                        {track.label}
                      </span>
                      <Progress value={track.progress} className="h-2" />
                      <span className="w-10 shrink-0 text-right text-sm text-muted">
                        {track.progress}%
                      </span>
                      <span className="w-20 shrink-0 text-right text-sm text-success">
                        + {formatCurrency(track.reward)}
                      </span>
                    </div>
                  ))}
                </div>
                <Button size="lg" className="mt-auto self-start">
                  Continuar!
                </Button>
              </div>
            </div>
          )
        }}
      </QueryBoundary>
    </section>
  )
}
