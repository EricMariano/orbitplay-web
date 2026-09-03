import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { OpportunitiesLibraryScreen } from './OpportunitiesLibraryScreen'

/**
 * Player home: browse open work from GET /opportunities.
 */
export function PlayerHomeScreen() {
  return (
    <OpportunitiesLibraryScreen
      title="Início"
      emptyTitle="Nenhuma oportunidade ainda"
      emptyDescription="Quando novos jogos abrirem para teste, eles aparecerão aqui."
      emptyAction={
        <Button asChild size="sm" variant="outline">
          <Link to="/player/games">Ir para meus jogos</Link>
        </Button>
      }
      showRequestAccess={false}
    />
  )
}
