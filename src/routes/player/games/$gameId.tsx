import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import referenceBanner from '@/assets/game-details/horizon-chase-2-banner.jpg'
import { ErrorState } from '@/components/common/ErrorState'
import { Icon } from '@/components/icon'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { usePlayerGameDetails } from '@/features/games/api/use-player-game-details'
import { gameDetailsErrorMessage, isGameId } from '@/features/games/game-details-utils'
import { formatCompactNumber, formatCurrency } from '@/lib/format'
import { GameDetailsTabs, type GameDetailsTab } from './-components/GameDetailsTabs'

export const Route = createFileRoute('/player/games/$gameId')({
  component: PlayerGameDetailsPage,
})

function PlayerGameDetailsPage() {
  const { gameId } = Route.useParams()
  const [activeTab, setActiveTab] = useState<GameDetailsTab>('available')
  const details = usePlayerGameDetails(gameId)

  if (!isGameId(gameId)) {
    return (
      <div className="space-y-6">
        <Link to="/player" className="text-primary">
          Voltar para jogos
        </Link>
        <ErrorState
          title="Endereço de jogo inválido"
          message="Abra os detalhes a partir de um jogo para continuar."
        />
      </div>
    )
  }

  if (details.isPending) {
    return (
      <div className="space-y-6 pt-3">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-[340px] w-full rounded-2xl" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-[330px] w-full rounded-2xl" />
      </div>
    )
  }

  if (details.isError) {
    return (
      <div className="space-y-6 pt-6">
        <Link to="/player" className="inline-flex items-center gap-3 text-primary">
          <Icon name="arrow-left" />
          Voltar para jogos
        </Link>
        <h1 className="text-3xl font-medium">Detalhes</h1>
        <ErrorState
          title="Não foi possível abrir o jogo"
          message={gameDetailsErrorMessage(details.error)}
          onRetry={() => void details.refetch()}
        />
        <GameDetailsTabs
          key={gameId}
          gameId={gameId}
          value={activeTab}
          onValueChange={setActiveTab}
        />
      </div>
    )
  }

  const { game, playersTotal, openTests, maxRewardCents } = details.data
  const bannerUrl =
    game.bannerUrl ?? game.coverUrl ?? (game.slug === 'horizon-chase-2' ? referenceBanner : null)

  return (
    <div className="min-w-[1120px] pb-12 font-login-body">
      <nav aria-label="breadcrumb" className="mb-5 text-sm text-white/50">
        <Link to="/player" className="hover:text-white">
          Home
        </Link>
        <span aria-hidden> &gt; </span>
        <span>Jogos</span>
        <span aria-hidden> &gt; </span>
        <span>Detalhes</span>
      </nav>

      <div className="mb-6 flex h-12 items-center gap-5 border-b border-[#248ff7] pb-5">
        <Link
          to="/player"
          aria-label="Voltar para jogos"
          className="text-[#168cf3] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Icon name="arrow-left" className="size-8" />
        </Link>
        <h1 className="font-login-display text-3xl font-medium text-white">Detalhes</h1>
      </div>

      <section aria-labelledby="game-title">
        <div className="relative aspect-[4/1] overflow-hidden rounded-2xl bg-white/10">
          {bannerUrl ? (
            <img
              src={bannerUrl}
              alt=""
              className="size-full object-cover"
              onError={(event) => {
                event.currentTarget.style.display = 'none'
              }}
            />
          ) : null}
        </div>

        <div className="flex items-start justify-between gap-10 py-6">
          <div className="flex min-w-0 flex-wrap items-center gap-5">
            <h2 id="game-title" className="break-words font-login-display text-3xl font-medium">
              {game.title}
            </h2>
            <Badge
              className={
                game.status === 'active'
                  ? 'bg-[#00ff78]/20 text-[#00ff78]'
                  : 'bg-white/10 text-white/60'
              }
            >
              {game.status === 'active' ? 'Disponível' : 'Indisponível'}
            </Badge>
          </div>

          <dl className="grid shrink-0 grid-cols-3 gap-12 text-center">
            <div>
              <dt className="flex items-center justify-center gap-1 text-xl font-semibold">
                <Icon name="users" className="size-5" />
                {playersTotal == null ? '—' : formatCompactNumber(playersTotal)}
              </dt>
              <dd className="text-sm text-white/60">Jogadores</dd>
            </div>
            <div>
              <dt className="flex items-center justify-center gap-1 text-xl font-semibold">
                <Icon name="tests" className="size-5" />
                {openTests}
              </dt>
              <dd className="text-sm text-white/60">Testes abertos</dd>
            </div>
            <div>
              <dt className="text-xl font-semibold">
                {maxRewardCents == null ? '—' : formatCurrency(maxRewardCents / 100)}
              </dt>
              <dd className="text-sm text-white/60">Prêmio máximo</dd>
            </div>
          </dl>
        </div>
      </section>

      <GameDetailsTabs gameId={gameId} value={activeTab} onValueChange={setActiveTab} />
    </div>
  )
}
