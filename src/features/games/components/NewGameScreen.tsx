import { Link } from '@tanstack/react-router'
import { EmptyState } from '@/components/common/EmptyState'
import { PageHeader } from '@/components/common/PageHeader'
import { RoleGate } from '@/components/common/RoleGate'
import { Button } from '@/components/ui/button'

/**
 * Destination of "Cadastrar jogo". There is no create-game operation on the
 * provisional contract, so this stays an honest empty state instead of a
 * fake form (no mocks).
 */
export function NewGameScreen() {
  return (
    <div>
      <PageHeader
        title="Novo jogo"
        breadcrumbs={[
          { label: 'Painel', to: '/studio' },
          { label: 'Jogos', to: '/studio/games' },
          { label: 'Novo jogo' },
        ]}
      />
      <RoleGate allow="studio">
        <EmptyState
          icon="plus"
          title="Cadastro ainda não disponível"
          description="Quando a API expuser a criação de jogos, o formulário entra aqui. Por enquanto a biblioteca lista o que GET /games devolver."
          action={
            <Button asChild size="sm">
              <Link to="/studio/games">Voltar à biblioteca</Link>
            </Button>
          }
        />
      </RoleGate>
    </div>
  )
}
