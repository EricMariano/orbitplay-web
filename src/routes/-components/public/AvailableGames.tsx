import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import type { Game } from '@/api-types'
import { EmptyState } from '@/components/common/EmptyState'
import { QueryBoundary } from '@/components/common/QueryBoundary'
import { Icon } from '@/components/icon'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { usePlayerFeed } from '@/features/player/api/use-player-feed'
import { useAuthStore } from '@/lib/auth'
import { formatCompactNumber } from '@/lib/format'

export function AvailableGames() {
  const role = useAuthStore((state) => state.role)
  return (
    <section id="jogos" className="available-games" aria-labelledby="games-title">
      <h2 id="games-title" className="public-section-title">
        Jogos disponíveis
      </h2>
      <p className="public-section-subtitle">Jogos em teste agora, escolha e participe!</p>
      <div className="public-game-categories" aria-label="Categorias de jogos">
        <span className="public-category-current">Para você</span>
        <button type="button" disabled title="Esta seleção ainda não está disponível.">
          Populares
        </button>
        <button type="button" disabled title="Esta seleção ainda não está disponível.">
          Pagando mais
        </button>
        <button type="button" disabled title="Esta seleção ainda não está disponível.">
          Novos jogos
        </button>
        <button type="button" disabled title="Esta seleção ainda não está disponível.">
          Exclusivos ELITE
        </button>
      </div>
      {role === 'player' ? (
        <PlayerGames />
      ) : (
        <div className="public-games-access">
          <Icon name="games" className="size-12" />
          <h3>{role ? 'Descubra a experiência de quem testa' : 'Seu próximo jogo começa aqui'}</h3>
          <p>
            {role
              ? 'Os testes disponíveis são selecionados para cada conta de jogador.'
              : 'Entre com sua conta de jogador para descobrir os jogos e testes disponíveis para você.'}
          </p>
          <Button asChild className="public-button public-button-cool">
            {role ? (
              <Link to="/tester">Conheça a experiência Tester</Link>
            ) : (
              <Link to="/login">Entrar para ver jogos</Link>
            )}
          </Button>
        </div>
      )}
    </section>
  )
}

function PlayerGames() {
  const games = usePlayerFeed(4)
  return (
    <div className="public-games-results">
      <QueryBoundary
        query={games}
        loadingFallback={
          <div
            className="public-games-grid"
            role="status"
            aria-label="Carregando jogos"
            aria-busy="true"
          >
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} className="h-[303px] rounded-xl" />
            ))}
          </div>
        }
        emptyFallback={
          <EmptyState
            icon="games"
            title="Nenhum jogo disponível"
            description="Volte em breve para novas oportunidades de teste."
          />
        }
      >
        {(data) => (
          <div className="public-games-grid">
            {data.map((game) => (
              <LandingGameCard key={game.id} game={game} />
            ))}
          </div>
        )}
      </QueryBoundary>
    </div>
  )
}

function LandingGameCard({ game }: { game: Game }) {
  const [failedImage, setFailedImage] = useState<string | null>(null)
  const available = game.status === 'active' && game.metrics.testsActive > 0
  return (
    <article className="public-game-card">
      <div className="public-game-cover">
        {game.coverUrl && failedImage !== game.coverUrl ? (
          <img
            src={game.coverUrl}
            alt=""
            loading="lazy"
            onError={() => setFailedImage(game.coverUrl)}
          />
        ) : (
          <div className="public-game-image-fallback">
            <Icon name="games" className="size-12" />
            <span>Imagem indisponível</span>
          </div>
        )}
        <span className="public-game-availability">
          {available ? 'Testes abertos' : 'Indisponível'}
        </span>
      </div>
      <div className="public-game-heading">
        <h3 title={game.title}>{game.title}</h3>
        <span title="Jogadores">
          <Icon name="users" />
          {formatCompactNumber(game.metrics.playersTotal)}
        </span>
      </div>
      <div className="public-game-metrics">
        <div>
          <strong>
            <Icon name="tests" />
            {game.metrics.testsActive}
          </strong>
          <span>Testes abertos</span>
        </div>
        <div>
          <strong>{game.metrics.testsTotal}</strong>
          <span>Total de testes</span>
        </div>
        <div>
          <strong>
            <Icon name="coins" />
          </strong>
          <span>
            Recompensas
            <br />
            nos detalhes
          </span>
        </div>
      </div>
      <Button asChild className="public-game-action public-button-cool">
        <Link to="/player/games/$gameId" params={{ gameId: game.id }}>
          {available ? 'Testar!' : 'Ver detalhes'}
          <span className="sr-only"> {game.title}</span>
        </Link>
      </Button>
    </article>
  )
}
