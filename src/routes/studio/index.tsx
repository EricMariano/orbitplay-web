import { createFileRoute, Link } from '@tanstack/react-router'
import { useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import type { Game, StudioDashboard, Test } from '@/api-types'
import { EmptyState } from '@/components/common/EmptyState'
import { QueryBoundary } from '@/components/common/QueryBoundary'
import { Icon } from '@/components/icon'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { roleLabels } from '@/features/auth/role-labels'
import { useStudioBenchmark } from '@/features/dashboard/api/use-studio-benchmark'
import { useStudioDashboard } from '@/features/dashboard/api/use-studio-dashboard'
import { BenchmarkCard } from '@/features/dashboard/components/BenchmarkCard'
import { DashboardTelemetryCard } from '@/features/dashboard/components/DashboardTelemetryCard'
import { SessionsEvolutionCard } from '@/features/dashboard/components/SessionsEvolutionCard'
import { StudioMetricsRow } from '@/features/dashboard/components/StudioMetricsRow'
import { StudioResultsCard } from '@/features/dashboard/components/StudioResultsCard'
import { useGames } from '@/features/games/api/use-games'
import { GameSummaryCard } from '@/features/games/components/GameSummaryCard'
import { useTestModels } from '@/features/tests/api/use-test-models'
import { RecentTestsTable } from '@/features/tests/components/RecentTestsTable'
import { useAuthStore } from '@/lib/auth'
import { reportsKeys } from '@/features/reports/api/reports-keys'

export const Route = createFileRoute('/studio/')({ component: StudioHome })

function StudioHome() {
  const dashboard = useStudioDashboard()
  const benchmark = useStudioBenchmark()
  const queryClient = useQueryClient()
  const user = useAuthStore((s) => s.user)
  const refreshing = dashboard.isFetching || benchmark.isFetching

  return (
    <div className="mx-auto max-w-[1600px] space-y-8 pb-10 font-brand">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-primary/40 pb-6">
        <div>
          <p className="mb-2 text-xs text-muted">Visão do estúdio</p>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-label text-2xl font-medium text-foreground-strong">
              Bem-vindo
              {user && (
                <>
                  {' '}
                  <span className="text-highlight">{user.displayName}</span>
                </>
              )}
            </h1>
            {user && (
              <Badge className="bg-role-badge-background text-role-badge-foreground">
                {roleLabels[user.role]}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {dashboard.dataUpdatedAt > 0 && (
            <span className="text-xs text-muted">
              Atualizado às{' '}
              {new Date(dashboard.dataUpdatedAt).toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            disabled={refreshing}
            onClick={() => {
              void dashboard.refetch()
              void benchmark.refetch()
              void queryClient.invalidateQueries({ queryKey: reportsKeys.all })
            }}
          >
            <Icon
              name={refreshing ? 'loader' : 'refresh'}
              className={refreshing ? 'animate-spin' : undefined}
            />
            {refreshing ? 'Atualizando…' : 'Atualizar Home'}
          </Button>
        </div>
      </header>

      <QueryBoundary query={dashboard} isEmpty={() => false} loadingFallback={<HomeSkeleton />}>
        {(data) => (
          <>
            <StudioMetricsRow values={data.kpis} />
            <HomeGames games={data.games} />
            <section aria-labelledby="studio-stats-heading" className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 id="studio-stats-heading" className="font-label text-lg font-medium">
                  Estatísticas
                </h2>
                <span className="text-xs text-muted">Dados dos jogos da sua organização</span>
              </div>
              <div className="grid items-stretch gap-5 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
                <SessionsEvolutionCard block={data.stats} />
                <StudioResultsCard values={data.kpis} />
              </div>
              <div className="grid items-stretch gap-5 lg:grid-cols-2">
                <DashboardTelemetryCard tests={data.recentTests} />
                <QueryBoundary
                  query={benchmark}
                  isEmpty={() => false}
                  loadingFallback={<Skeleton className="min-h-72 w-full rounded-xl" />}
                >
                  {(data) => (
                    <BenchmarkCard
                      pages={data.pages}
                      hasNextPage={benchmark.hasNextPage}
                      isFetchingNextPage={benchmark.isFetchingNextPage}
                      onLoadMore={() => void benchmark.fetchNextPage()}
                      onRetry={() => void benchmark.refetch()}
                    />
                  )}
                </QueryBoundary>
              </div>
            </section>
            <HomeRecentTests data={data} />
          </>
        )}
      </QueryBoundary>
    </div>
  )
}

function HomeGames({ games }: { games: Game[] }) {
  return (
    <section aria-labelledby="studio-games-heading" className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id="studio-games-heading" className="font-label text-lg font-medium">
            Seus jogos
          </h2>
          <p className="mt-1 text-xs text-muted">Os jogos mais recentes do seu estúdio.</p>
        </div>
        <Button asChild variant="ghost" size="sm" className="text-primary">
          <Link to="/studio/games">
            Ir para meus jogos
            <Icon name="arrow-right" />
          </Link>
        </Button>
      </div>
      {games.length ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {games.map((game) => (
            <GameSummaryCard key={game.id} game={game} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="games"
          title="Nenhum jogo cadastrado"
          description="Cadastre seu primeiro jogo para começar a receber avaliações."
          action={
            <Button asChild>
              <Link to="/studio/games">
                <Icon name="plus" />
                Adicionar jogo
              </Link>
            </Button>
          }
        />
      )}
    </section>
  )
}

function HomeRecentTests({ data }: { data: StudioDashboard }) {
  return (
    <section aria-labelledby="studio-recent-heading" className="space-y-4">
      <h2 id="studio-recent-heading" className="font-label text-lg font-medium">
        Testes recentes
      </h2>
      {data.recentTests.length ? (
        <RecentTests tests={data.recentTests} games={data.games} />
      ) : (
        <EmptyState
          icon="tests"
          title="Nenhum teste criado"
          description="Abra um dos seus jogos e configure o primeiro teste."
          action={
            <Button asChild variant="outline">
              <Link to="/studio/games">
                Escolher um jogo
                <Icon name="arrow-right" />
              </Link>
            </Button>
          }
        />
      )}
    </section>
  )
}

/** Só busca a lista completa se um teste recente se referir a um jogo fora dos destaques. */
function RecentTests({ tests, games }: { tests: Test[]; games: Game[] }) {
  const needsMoreGames = tests.some((test) => !games.some((game) => game.id === test.gameId))
  const allGames = useGames(needsMoreGames)
  const models = useTestModels()
  const gameTitles = useMemo(
    () => new Map([...(allGames.data ?? []), ...games].map((game) => [game.id, game.title])),
    [allGames.data, games],
  )
  const modelNames = useMemo(
    () => new Map((models.data ?? []).map((model) => [model.key, model.name])),
    [models.data],
  )
  return <RecentTestsTable tests={tests} gameTitles={gameTitles} modelNames={modelNames} />
}

function HomeSkeleton() {
  return (
    <div aria-label="Carregando Home do estúdio" aria-busy="true" className="space-y-8">
      <Skeleton className="h-20 w-full" />
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <Skeleton key={item} className="h-64 w-full rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-80 w-full rounded-xl" />
    </div>
  )
}
