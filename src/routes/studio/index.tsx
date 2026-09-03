import { createFileRoute, Link } from '@tanstack/react-router'
import { EmptyState } from '@/components/common/EmptyState'
import { QueryBoundary } from '@/components/common/QueryBoundary'
import { DashboardPlaceholder } from '@/components/common/DashboardPlaceholder'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { GameSummaryCard } from '@/features/games/components/GameSummaryCard'
import { useGames } from '@/features/games/api/use-games'
import { roleLabels } from '@/features/auth/role-labels'
import { StudioMetricsRow } from '@/features/dashboard/components/StudioMetricsRow'
import { useStudioSummary } from '@/features/dashboard/api/use-studio-summary'
import { useAuthStore } from '@/lib/auth'

export const Route = createFileRoute('/studio/')({
  component: StudioHome,
})

function StudioHome() {
  const games = useGames()
  const summary = useStudioSummary()
  const user = useAuthStore((s) => s.user)

  return (
    <div className="space-y-6">
      {/* Bem-vindo + KPIs gerais (Tela 02) */}
      <div className="space-y-4 border-b border-border pb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-foreground">
            Bem-vindo <span className="italic text-highlight">{user?.name}</span>
          </h1>
          {user ? (
            <Badge className="rounded-tl-[16px] rounded-tr-none rounded-br-[16px] rounded-bl-none bg-role-badge-background text-role-badge-foreground">
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

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="italic text-sm font-medium text-foreground">Seus jogos</h2>
          <div className="flex items-center gap-4">
            <Link to="/studio/games" className="text-sm text-primary hover:underline">
              Ir para meus jogos →
            </Link>
          </div>
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

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <DashboardPlaceholder title="Telemetria / Orbit Plug-in" />
        <DashboardPlaceholder title="Benchmark de mercado" />
      </div>

      <DashboardPlaceholder title="Testes recentes" />
    </div>
  )
}
