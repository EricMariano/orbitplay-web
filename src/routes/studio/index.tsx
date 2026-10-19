import { createFileRoute, Link } from '@tanstack/react-router'
import { useMemo } from 'react'
import type { Test } from '@/api-types'
import { DashboardPlaceholder } from '@/components/common/DashboardPlaceholder'
import { EmptyState } from '@/components/common/EmptyState'
import { QueryBoundary } from '@/components/common/QueryBoundary'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { roleLabels } from '@/features/auth/role-labels'
import { useStudioBenchmark } from '@/features/dashboard/api/use-studio-benchmark'
import { useStudioDashboard } from '@/features/dashboard/api/use-studio-dashboard'
import { BenchmarkCard } from '@/features/dashboard/components/BenchmarkCard'
import { SessionsEvolutionCard } from '@/features/dashboard/components/SessionsEvolutionCard'
import { StudioMetricsRow } from '@/features/dashboard/components/StudioMetricsRow'
import { useGames } from '@/features/games/api/use-games'
import { GameSummaryCard } from '@/features/games/components/GameSummaryCard'
import { useTestModels } from '@/features/tests/api/use-test-models'
import { RecentTestsTable } from '@/features/tests/components/RecentTestsTable'
import { useAuthStore } from '@/lib/auth'

export const Route = createFileRoute('/studio/')({
  component: StudioHome,
})

function StudioHome() {
  const dashboard = useStudioDashboard()
  const benchmark = useStudioBenchmark()
  const user = useAuthStore((s) => s.user)

  return (
    <div className="space-y-6">
      {/* Bem-vindo + KPIs (Tela 02) */}
      <div className="space-y-4 border-b border-border pb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-foreground">
            Bem-vindo <span className="italic text-highlight">{user?.displayName}</span>
          </h1>
          {user ? (
            <Badge className="bg-role-badge-background text-role-badge-foreground">
              {roleLabels[user.role]}
            </Badge>
          ) : null}
        </div>
        <QueryBoundary
          query={dashboard}
          loadingFallback={<Skeleton className="h-10 w-full" />}
          isEmpty={() => false}
        >
          {(data) => <StudioMetricsRow values={data.kpis} />}
        </QueryBoundary>
      </div>

      {/* Seus jogos (Tela 02 / Tela 03) — os 5 mais recentes */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-foreground italic">Seus jogos</h2>
          <Link to="/studio/games" className="text-sm text-primary hover:underline">
            Ir para meus jogos →
          </Link>
        </div>

        <QueryBoundary
          query={dashboard}
          isEmpty={(data) => data.games.length === 0}
          emptyFallback={
            <EmptyState
              icon="games"
              title="Nenhum jogo cadastrado"
              description="Cadastre seu primeiro jogo para começar a receber testes."
              action={
                <Button size="sm" asChild>
                  <Link to="/studio/games">Adicionar jogo</Link>
                </Button>
              }
            />
          }
        >
          {(data) => (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.games.map((game) => (
                <GameSummaryCard key={game.id} game={game} />
              ))}
            </div>
          )}
        </QueryBoundary>
      </section>

      {/* Estatísticas (Tela 02) */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-foreground italic">Estatísticas</h2>
        <QueryBoundary query={dashboard} isEmpty={() => false}>
          {(data) => <SessionsEvolutionCard block={data.stats} />}
        </QueryBoundary>
      </section>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Sem endpoint: o modelo com Orbit Plug-in ainda está indisponível na API. */}
        <DashboardPlaceholder title="Telemetria / Orbit Plug-in" />
        <QueryBoundary query={benchmark} isEmpty={() => false}>
          {(block) => <BenchmarkCard block={block} />}
        </QueryBoundary>
      </div>

      {/* Testes recentes (Tela 02) — os 5 mais recentes */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-foreground italic">Testes recentes</h2>
        <QueryBoundary
          query={dashboard}
          isEmpty={(data) => data.recentTests.length === 0}
          emptyFallback={
            <EmptyState
              icon="tests"
              title="Nenhum teste criado"
              description="Configure um teste em um dos seus jogos para vê-lo aqui."
            />
          }
        >
          {(data) => <RecentTests tests={data.recentTests} />}
        </QueryBoundary>
      </section>
    </div>
  )
}

/** Resolve título do jogo e nome do modelo de cada teste antes de montar a tabela. */
function RecentTests({ tests }: { tests: Test[] }) {
  const games = useGames()
  const models = useTestModels()

  const gameTitles = useMemo(
    () => new Map((games.data ?? []).map((game) => [game.id, game.title])),
    [games.data],
  )
  const modelNames = useMemo(
    () => new Map((models.data ?? []).map((model) => [model.key, model.name])),
    [models.data],
  )

  return <RecentTestsTable tests={tests} gameTitles={gameTitles} modelNames={modelNames} />
}
