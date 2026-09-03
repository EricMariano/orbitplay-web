import { createFileRoute, Link } from '@tanstack/react-router'
import { EmptyState } from '@/components/common/EmptyState'
import { QueryBoundary } from '@/components/common/QueryBoundary'
import { DashboardPlaceholder } from '@/components/common/DashboardPlaceholder'
import { StatCard } from '@/components/common/StatCard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { GameSummaryCard } from '@/features/games/components/GameSummaryCard'
import { useGames } from '@/features/games/api/use-games'
import { roleLabels } from '@/features/auth/role-labels'
import { StudioMetricsRow } from '@/features/dashboard/components/StudioMetricsRow'
import { useStudioSummary } from '@/features/dashboard/api/use-studio-summary'
import { useAuthStore } from '@/lib/auth'
import { BenchmarkCard } from '@/features/dashboard/components/BenchmarkCard'
import { useBenchmarkEntries } from '@/features/dashboard/api/use-benchmark-entries'
import { useState } from 'react'
import { RecentTestsTable } from '@/features/tests/components/RecentTestsTable'
import { useRecentTests } from '@/features/tests/api/use-recent-tests'

export const Route = createFileRoute('/studio/')({
  component: StudioHome,
})

function StudioHome() {
  const games = useGames()
  const summary = useStudioSummary()
  const benchmark = useBenchmarkEntries()
  const user = useAuthStore((s) => s.user)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const recentTests = useRecentTests({ page, pageSize })

  return (
    <div className="space-y-6">
      {/* Bem-vindo + KPIs gerais (Tela 02) */}
      <div className="space-y-4 border-b border-border pb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-foreground">
            Bem-vindo <span className="italic text-highlight">{user?.name}</span>
          </h1>
          {user ? (
            <Badge className="bg-role-badge-background text-role-badge-foreground">
              {roleLabels[user.role]}
            </Badge>
          ) : null}
        </div>

        <QueryBoundary
          query={summary}
          loadingFallback={<Skeleton className="h-10 w-full" />}
          emptyFallback={null}
        >
          {(data) => <StudioMetricsRow summary={data} />}
        </QueryBoundary>
      </div>

      {/* Seus jogos (Tela 02 / Tela 03) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-foreground italic">Seus jogos</h2>
          <Link to="/studio/games" className="text-sm text-primary hover:underline">
            Ir para meus jogos →
          </Link>
        </div>

        <QueryBoundary
          query={games}
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
              {data.map((game) => (
                <GameSummaryCard key={game.id} game={game} />
              ))}
            </div>
          )}
        </QueryBoundary>
      </section>

      {/* Estatísticas (Tela 02) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-foreground italic">Estatísticas</h2>
          <Link to="/studio/games" className="text-sm text-primary hover:underline">
            Ir para jogos →
          </Link>
        </div>

        <QueryBoundary
          query={summary}
          loadingFallback={<Skeleton className="h-40 w-full" />}
          emptyFallback={null}
        >
          {(data) => (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 ">
              <StatCard
                title="Visão geral"
                subtitle="Lorem ipsum"
                stats={[
                  { label: 'Testes ativos', value: String(data.activeTestsCount) },
                  { label: 'Testadores jogando', value: String(data.activeTestersCount) },
                  {
                    label: 'Testes por hora',
                    value: data.testsPerHour.toFixed(1).replace('.', ','),
                  },
                ]}
                linkLabel="Ir para relatórios"
                // linkTo="/studio/reports" — ativar quando a tela existir
              />
              <StatCard
                title="Fatores chave"
                subtitle="Lorem ipsum"
                stats={[
                  { label: 'Fator diversão', value: String(data.funFactorScore) },
                  { label: 'Bugs e Glitches', value: String(data.bugsAndGlitchesCount) },
                  { label: 'Retenção', value: `${Math.round(data.retentionRate * 100)}%` },
                ]}
                linkLabel="Ir para configurações"
                // linkTo="/studio/settings" — ativar quando a tela existir
              />
              <StatCard
                title="Plug-in telemetria"
                subtitle="Lorem ipsum"
                stats={[
                  { label: 'Pontos ativos', value: String(data.telemetryActivePointsCount) },
                  { label: 'Acionamentos', value: String(data.telemetryTriggersCount) },
                  { label: 'Insights de IA', value: String(data.aiInsightsGeneratedCount) },
                ]}
                linkLabel="Ir para Orbit Plug-in"
                // linkTo="/studio/plugin" — ativar quando a tela existir
              />
            </div>
          )}
        </QueryBoundary>
      </section>

      {/* Ainda sem endpoint no contrato */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <DashboardPlaceholder title="Telemetria / Orbit Plug-in" />
        <QueryBoundary
          query={benchmark}
          loadingFallback={<Skeleton className="h-64 w-full" />}
          emptyFallback={null}
        >
          {(data) => <BenchmarkCard entries={data} />}
        </QueryBoundary>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-foreground italic">Testes recentes</h2>
        <QueryBoundary
          query={recentTests}
          loadingFallback={<Skeleton className="h-80 w-full" />}
          emptyFallback={
            <EmptyState
              icon="tests"
              title="Nenhum teste recente"
              description="Assim que você criar um teste, ele aparece aqui."
            />
          }
        >
          {(data) => (
            <RecentTestsTable
              data={data}
              onPageChange={setPage}
              onPageSizeChange={(size) => {
                setPageSize(size)
                setPage(1)
              }}
            />
          )}
        </QueryBoundary>
      </section>
    </div>
  )
}
