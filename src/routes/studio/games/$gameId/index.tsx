import { createFileRoute, Link } from '@tanstack/react-router'
import type { GameSummary } from '@/api-types'
import { EmptyState } from '@/components/common/EmptyState'
import { QueryBoundary } from '@/components/common/QueryBoundary'
import { RoleGate } from '@/components/common/RoleGate'
import { Icon, type IconName } from '@/components/icon'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useGameSummary } from '@/features/games/api/use-game-summary'
import {
  GamePostsContent,
  GameReviewsContent,
  GameSpecsContent,
} from '@/features/games/components/GameContent'
import { gameStatusLabels } from '@/features/games/game-status'
import { STUDIO_ROLES } from '@/lib/auth'
import { formatCompactNumber, formatDecimal } from '@/lib/format'
import { StudioGameTests } from './-components/StudioGameTests'

const TABS = [
  { value: 'active', label: 'Testes ativos' },
  { value: 'all', label: 'Todos os testes' },
  { value: 'reviews', label: 'Avaliações' },
  { value: 'achievements', label: 'Conquistas' },
  { value: 'community', label: 'Comunidade' },
  { value: 'specs', label: 'Especificações' },
] as const

type GameTab = (typeof TABS)[number]['value']

function isGameTab(value: unknown): value is GameTab {
  return TABS.some((tab) => tab.value === value)
}

// Uma rota index: chat, novo teste e relatórios continuam como páginas irmãs.
export const Route = createFileRoute('/studio/games/$gameId/')({
  validateSearch: (search: Record<string, unknown>): { tab?: GameTab } => ({
    tab: isGameTab(search.tab) ? search.tab : 'active',
  }),
  component: StudioGameDetailsPage,
})

function StudioGameDetailsPage() {
  const { gameId } = Route.useParams()
  const { tab = 'active' } = Route.useSearch()
  const navigate = Route.useNavigate()
  const summary = useGameSummary(gameId)

  return (
    <div className="mx-auto max-w-[1600px] pb-12 font-brand">
      <nav
        aria-label="breadcrumb"
        className="mb-5 flex flex-wrap items-center gap-2 text-xs text-muted"
      >
        <Link to="/studio" className="hover:text-foreground">
          Home
        </Link>
        <span aria-hidden>/</span>
        <Link to="/studio/games" className="hover:text-foreground">
          Meus jogos
        </Link>
        <span aria-hidden>/</span>
        <span aria-current="page">{summary.data?.game.title ?? 'Detalhes do jogo'}</span>
      </nav>

      <header className="mb-6 flex items-center gap-4 border-b border-primary/50 pb-5">
        <Button asChild variant="ghost" size="icon" className="text-primary">
          <Link to="/studio/games" aria-label="Voltar para meus jogos">
            <Icon name="arrow-left" className="size-7" />
          </Link>
        </Button>
        <h1 className="font-label text-2xl font-medium text-foreground-strong">
          Configuração de testes
        </h1>
      </header>

      <QueryBoundary query={summary}>
        {(data) => (
          <>
            <GameHeader summary={data} />
            <Tabs
              value={tab}
              onValueChange={(next) => {
                if (isGameTab(next)) void navigate({ search: { tab: next }, resetScroll: false })
              }}
              className="gap-6"
            >
              <div className="overflow-x-auto border-b border-field-border/40">
                <TabsList
                  variant="line"
                  aria-label="Informações do jogo"
                  className="h-12! w-max justify-start gap-0 p-0"
                >
                  {TABS.map((item) => (
                    <TabsTrigger
                      key={item.value}
                      value={item.value}
                      className="h-12 flex-none rounded-none px-4 font-label text-sm font-normal after:bg-primary data-[state=active]:text-primary"
                    >
                      {item.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {(['active', 'all'] as const).map((scope) => (
                <TabsContent key={scope} value={scope} className="space-y-5">
                  {data.canEdit && (
                    <RoleGate allow={STUDIO_ROLES}>
                      <div className="flex flex-wrap items-center gap-3">
                        <Button
                          asChild
                          className="bg-highlight text-highlight-foreground hover:bg-highlight/90"
                        >
                          <Link to="/studio/games/$gameId/tests/new" params={{ gameId }}>
                            <Icon name="plus" />
                            Novo teste
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          disabled
                          title="A configuração do Orbit Plug-in estará disponível em breve."
                        >
                          <Icon name="plug" />
                          Configurar Orbit Plug-in
                        </Button>
                      </div>
                    </RoleGate>
                  )}
                  <StudioGameTests gameId={gameId} scope={scope} />
                </TabsContent>
              ))}
              <TabsContent value="reviews">
                <GameReviewsContent gameId={gameId} />
              </TabsContent>
              <TabsContent value="achievements">
                <EmptyState
                  icon="trophy"
                  title="Conquistas do jogo em breve"
                  description="O catálogo de conquistas deste jogo ainda não está disponível."
                />
              </TabsContent>
              <TabsContent value="community" className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-field-border/20 bg-field p-5">
                  <div>
                    <h2 className="font-label text-lg font-medium">Comunidade do jogo</h2>
                    <p className="mt-1 text-sm text-muted">
                      Acompanhe as publicações e converse com seus jogadores.
                    </p>
                  </div>
                  <RoleGate allow={STUDIO_ROLES}>
                    <Button asChild variant="outline">
                      <Link to="/studio/games/$gameId/chat" params={{ gameId }}>
                        <Icon name="message-circle" />
                        Gerenciar chat
                      </Link>
                    </Button>
                  </RoleGate>
                </div>
                <GamePostsContent gameId={gameId} />
              </TabsContent>
              <TabsContent value="specs">
                <GameSpecsContent gameId={gameId} />
              </TabsContent>
            </Tabs>
          </>
        )}
      </QueryBoundary>
    </div>
  )
}

function GameHeader({ summary: { game, availability, metrics } }: { summary: GameSummary }) {
  const banner = game.bannerUrl ?? game.coverUrl
  return (
    <section aria-labelledby="studio-game-title">
      <div className="relative flex aspect-[4/1] min-h-40 w-full items-center justify-center overflow-hidden rounded-2xl border border-field-border/20 bg-field">
        <div className="flex flex-col items-center gap-2 text-muted">
          <Icon name="games" className="size-12" />
          <span className="text-sm">Banner do jogo</span>
        </div>
        {banner && (
          <img
            src={banner}
            alt={`Banner de ${game.title}`}
            className="absolute inset-0 size-full object-cover"
            onError={(event) => {
              event.currentTarget.hidden = true
            }}
          />
        )}
      </div>
      <div className="flex flex-col justify-between gap-6 py-6 xl:flex-row xl:items-center">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <Icon name="games" className="size-6 text-primary" />
            <h2
              id="studio-game-title"
              className="break-words font-label text-2xl font-semibold text-foreground-strong"
            >
              {game.title}
            </h2>
            <Badge
              className={
                availability === 'available'
                  ? 'bg-availability-available-background text-availability-available-foreground'
                  : 'bg-availability-unavailable-background text-availability-unavailable-foreground'
              }
            >
              {gameStatusLabels[game.status]}
            </Badge>
          </div>
          {(game.genre || game.platform) && (
            <p className="mt-2 text-sm text-muted">
              {[game.genre, game.platform].filter(Boolean).join(' · ')}
            </p>
          )}
          {game.description && (
            <p className="mt-3 max-w-3xl whitespace-pre-wrap text-sm leading-6 text-foreground/80">
              {game.description}
            </p>
          )}
        </div>
        <dl className="grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-4 xl:shrink-0">
          <Metric
            icon="users"
            label="Jogadores"
            value={formatCompactNumber(metrics.playersTotal)}
          />
          <Metric
            icon="tests"
            label="Testes ativos"
            value={formatCompactNumber(metrics.testsActive)}
          />
          <Metric
            icon="checklist"
            label="Sessões válidas"
            value={formatCompactNumber(metrics.sessionsValid)}
          />
          <Metric
            icon="star"
            label="Nota média"
            value={
              metrics.averageRating == null ? '—' : `${formatDecimal(metrics.averageRating)} / 5`
            }
          />
        </dl>
      </div>
    </section>
  )
}

function Metric({ icon, label, value }: { icon: IconName; label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 sm:items-end">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="order-first flex items-center gap-2 font-label text-xl font-semibold text-foreground-strong">
        <Icon name={icon} className="size-4 text-primary" />
        {value}
      </dd>
    </div>
  )
}
