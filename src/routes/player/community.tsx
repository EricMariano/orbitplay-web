import { Link, createFileRoute } from '@tanstack/react-router'
import { EmptyState } from '@/components/common/EmptyState'
import { QueryBoundary } from '@/components/common/QueryBoundary'
import { Icon } from '@/components/icon'
import { Button } from '@/components/ui/button'
import { usePlayerLibrary } from '@/features/player/api/use-player-library'

export const Route = createFileRoute('/player/community')({ component: PlayerCommunityPage })

function PlayerCommunityPage() {
  const library = usePlayerLibrary()
  return (
    <QueryBoundary
      query={library}
      emptyFallback={
        <EmptyState
          icon="users"
          title="Sua comunidade aparecerá aqui"
          description="Participe de um teste para acessar a comunidade do jogo."
        />
      }
    >
      {(games) => (
        <div className="mx-auto max-w-5xl space-y-6 font-login-body">
          <header>
            <p className="text-sm text-white/55">Jogos de que você participa</p>
            <h1 className="mt-1 font-login-display text-3xl">Comunidade</h1>
          </header>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {games.map((game) => (
              <article
                key={game.id}
                className="overflow-hidden rounded-2xl border border-white/15 bg-white/5"
              >
                <div className="aspect-[16/7] bg-white/10">
                  {game.coverUrl ? (
                    <img src={game.coverUrl} alt="" className="size-full object-cover" />
                  ) : null}
                </div>
                <div className="p-4">
                  <h2 className="font-semibold">{game.title}</h2>
                  <p className="mt-1 text-sm text-white/60">
                    Acesse chat, publicações e avaliações da comunidade.
                  </p>
                  <Button asChild size="sm" className="mt-4">
                    <Link to="/player/games/$gameId" params={{ gameId: game.id }}>
                      <Icon name="users" /> Abrir jogo
                    </Link>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </QueryBoundary>
  )
}
