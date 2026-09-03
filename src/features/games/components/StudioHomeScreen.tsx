import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { GamesLibraryScreen } from './GamesLibraryScreen'

/**
 * Studio home ("Painel"): same library building blocks as "Gerenciar jogos",
 * with dashboard copy. Data still comes from `useGames` via the composer.
 */
export function StudioHomeScreen() {
  return (
    <GamesLibraryScreen
      title="Painel"
      emptyTitle="Nenhum jogo ainda"
      emptyDescription="Cadastre seu primeiro jogo para começar a receber testadores."
      emptyAction={
        <Button asChild size="sm">
          <Link to="/studio/games/new">Cadastrar jogo</Link>
        </Button>
      }
    />
  )
}
