import type { Game } from '@/api-types'
import { AddGameCard } from './AddGameCard'
import { GameCard } from './GameCard'

type GamesGridProps = {
  games: Game[]
}

/**
 * Lays out the studio's games as a responsive card grid, plus the trailing
 * "add game" tile. Pure/presentational — takes plain `Game[]`, no fetching
 * of its own, so `StudioHomeScreen` stays the only place that knows about
 * `useGames` (SRP / DIP).
 */
export function GamesGrid({ games }: GamesGridProps) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-5">
      {games.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
      <AddGameCard />
    </div>
  )
}
