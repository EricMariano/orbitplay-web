import { Link, createFileRoute } from '@tanstack/react-router'
import { EmptyState } from '@/components/common/EmptyState'
import { QueryBoundary } from '@/components/common/QueryBoundary'
import { Icon } from '@/components/icon'
import { Button } from '@/components/ui/button'
import { useGames } from '@/features/games/api/use-games'

export const Route = createFileRoute('/studio/community')({ component: StudioCommunityPage })

function StudioCommunityPage() {
  const games = useGames()
  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-10 font-brand">
      <header className="border-b border-primary/35 pb-6">
        <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
          Feedback dos jogadores
        </p>
        <h1 className="mt-2 font-label text-3xl font-medium text-foreground-strong">Comunidade</h1>
        <p className="mt-2 text-sm text-muted">
          Abra um jogo para acompanhar publicações, avaliações e conversas dos participantes.
        </p>
      </header>
      <QueryBoundary
        query={games}
        emptyFallback={
          <EmptyState
            icon="users"
            title="Nenhum jogo cadastrado"
            description="Cadastre um jogo para receber feedback da comunidade."
          />
        }
      >
        {(items) => (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((game) => (
              <article
                key={game.id}
                className="overflow-hidden rounded-xl border border-border bg-surface"
              >
                <div className="aspect-[16/7] bg-surface-raised">
                  {game.coverUrl ? (
                    <img src={game.coverUrl} alt="" className="size-full object-cover" />
                  ) : null}
                </div>
                <div className="p-4">
                  <h2 className="font-medium text-foreground-strong">{game.title}</h2>
                  <Button asChild variant="outline" size="sm" className="mt-4">
                    <Link to="/studio/games/$gameId" params={{ gameId: game.id }}>
                      <Icon name="message-circle" /> Abrir feedback
                    </Link>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </QueryBoundary>
    </div>
  )
}
