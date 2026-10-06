import { createFileRoute, Link } from '@tanstack/react-router'
import { EmptyState } from '@/components/common/EmptyState'
import { QueryBoundary } from '@/components/common/QueryBoundary'
import { DashboardPlaceholder } from '@/components/common/DashboardPlaceholder'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { GameSummaryCard } from '@/features/games/components/GameSummaryCard'
import { useGames } from '@/features/games/api/use-games'
import { roleLabels } from '@/features/auth/role-labels'
import { useAuthStore } from '@/lib/auth'

export const Route = createFileRoute('/studio/')({
  component: StudioHome,
})

// KPIs, estatísticas, benchmark e testes recentes dependem de /studio/summary,
// /studio/benchmark e /tests/recent, que a API ainda não expõe. Os blocos
// ficam como placeholder (sem mock) até o backend entregar — os hooks e
// componentes já existem em features/dashboard e features/tests.
function StudioHome() {
  const games = useGames()
  const user = useAuthStore((s) => s.user)

  return (
    <div className="space-y-6">
      {/* Bem-vindo (Tela 02) */}
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

      {/* Estatísticas (Tela 02) — sem endpoint no contrato */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-foreground italic">Estatísticas</h2>
        <DashboardPlaceholder title="Visão geral, fatores chave e plug-in" />
      </section>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <DashboardPlaceholder title="Telemetria / Orbit Plug-in" />
        <DashboardPlaceholder title="Benchmark de mercado" />
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-foreground italic">Testes recentes</h2>
        <DashboardPlaceholder title="Testes recentes" />
      </section>
    </div>
  )
}
