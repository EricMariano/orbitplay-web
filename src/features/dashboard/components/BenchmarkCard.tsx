import { Link } from '@tanstack/react-router'
import type { StudioBenchmark } from '@/api-types'
import { BlockState } from '@/components/common/BlockState'
import { EmptyState } from '@/components/common/EmptyState'
import { Icon } from '@/components/icon'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { formatDecimal, formatPercent } from '@/lib/format'

type BenchmarkCardProps = {
  pages: StudioBenchmark[]
  hasNextPage: boolean
  isFetchingNextPage: boolean
  onLoadMore: () => void
  onRetry: () => void
}

export function BenchmarkCard({
  pages,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  onRetry,
}: BenchmarkCardProps) {
  const games = pages.flatMap((page) => (page.status === 'ready' ? (page.payload?.data ?? []) : []))
  const pending = pages.find((page) => page.status !== 'ready')
  return (
    <Card
      role="region"
      aria-label="Comparativo dos seus jogos"
      className="h-full gap-4 rounded-xl border-field-border/30 bg-field shadow-none"
    >
      <CardHeader>
        <h3 className="flex items-center gap-2 font-label text-lg font-medium">
          <Icon name="trending-up" className="size-5 shrink-0 text-primary" />
          Comparativo dos seus jogos
        </h3>
        <p className="text-xs leading-5 text-muted">
          Todo o histórico · Jogos mais recentes primeiro
          <br />
          Conclusão = sessões concluídas / participações.
        </p>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        {games.length > 0 && (
          <ul className="divide-y divide-field-border/30">
            {games.map((game) => (
              <li key={game.gameId} className="py-4 first:pt-0">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <Link
                    to="/studio/games/$gameId"
                    params={{ gameId: game.gameId }}
                    className="min-w-0 break-words text-sm font-medium text-foreground-strong hover:text-primary focus-visible:rounded focus-visible:outline-2 focus-visible:outline-primary"
                  >
                    {game.title}
                    <Icon name="arrow-right" className="ml-1 inline size-3.5" />
                  </Link>
                  <span className="shrink-0 text-sm font-medium text-primary">
                    {game.completionRate === null
                      ? 'Sem participações'
                      : formatPercent(game.completionRate)}
                  </span>
                </div>
                <div
                  aria-hidden="true"
                  className="mb-2 h-1.5 overflow-hidden rounded-full bg-field-border/30"
                >
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${Math.min(100, (game.completionRate ?? 0) * 100)}%` }}
                  />
                </div>
                <p className="text-xs leading-5 text-muted">
                  {game.sessionsCompleted} sessões concluídas / {game.participationsTotal}{' '}
                  participações
                </p>
                <p className="text-xs leading-5 text-muted">
                  {game.playersTotal} jogadores únicos ·{' '}
                  {game.averageRating === null
                    ? 'Sem avaliações'
                    : `Nota ${formatDecimal(game.averageRating)} / 5`}
                </p>
              </li>
            ))}
          </ul>
        )}
        {pending && pending.status !== 'ready' ? (
          <div className="my-auto">
            <BlockState status={pending.status} />
            {pending.status === 'failed' && (
              <Button variant="outline" size="sm" className="mt-3" onClick={onRetry}>
                Tentar novamente
              </Button>
            )}
          </div>
        ) : games.length === 0 ? (
          <EmptyState
            icon="games"
            title="Nenhum jogo para comparar"
            description="Cadastre seus jogos para acompanhar e comparar os resultados dos testes."
            action={
              <Button asChild variant="outline">
                <Link to="/studio/games">Meus jogos</Link>
              </Button>
            }
          />
        ) : null}
        {games.length > 0 && (
          <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-field-border/30 pt-4">
            <span className="text-xs text-muted">{games.length} jogos carregados</span>
            {hasNextPage && (
              <Button
                variant="outline"
                size="sm"
                disabled={isFetchingNextPage}
                onClick={onLoadMore}
              >
                {isFetchingNextPage ? 'Carregando…' : 'Carregar mais jogos'}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
