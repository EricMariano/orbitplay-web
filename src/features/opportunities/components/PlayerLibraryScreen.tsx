import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { OpportunitiesLibraryScreen } from './OpportunitiesLibraryScreen'

/**
 * Player game library ("Meus jogos") — GameLibraryUser, fed by the
 * opportunities API (the player's assigned tests on the provisional contract).
 */
export function PlayerLibraryScreen() {
  return (
    <OpportunitiesLibraryScreen
      title="Meus jogos"
      breadcrumbs={[{ label: 'Início', to: '/player' }, { label: 'Jogos em teste' }]}
      emptyTitle="Nenhum jogo em teste"
      emptyDescription="Solicite acesso a novos títulos ou volte ao início para ver oportunidades abertas."
      emptyAction={
        <Button asChild size="sm">
          <Link to="/player">Ver oportunidades</Link>
        </Button>
      }
      showSummary={false}
      showRequestAccess
    />
  )
}
