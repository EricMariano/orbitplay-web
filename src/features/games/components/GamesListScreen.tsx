import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { GamesLibraryScreen } from './GamesLibraryScreen'

/**
 * Studio's "Jogos" screen — the admin game library from GameLibraryAdmin,
 * wired to GET /games instead of hardcoded cards.
 */
export function GamesListScreen() {
  return (
    <GamesLibraryScreen
      title="Gerenciar jogos"
      breadcrumbs={[{ label: 'Painel', to: '/studio' }, { label: 'Jogos' }]}
      emptyTitle="Nenhum jogo ainda"
      emptyDescription="Cadastre um jogo e publique uma build para testes. A lista vem de GET /games."
      emptyAction={
        <Button asChild size="sm">
          <Link to="/studio/games/new">Cadastrar jogo</Link>
        </Button>
      }
    />
  )
}
