import { createFileRoute } from '@tanstack/react-router'
import { EmptyState } from '@/components/common/EmptyState'
import { PageHeader } from '@/components/common/PageHeader'
import { QueryBoundary } from '@/components/common/QueryBoundary'
import { RoleGate } from '@/components/common/RoleGate'
import { Icon } from '@/components/icon'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useGames } from '@/features/games/api/use-games'

export const Route = createFileRoute('/studio/games/')({
  component: GamesList,
})

function GamesList() {
  const games = useGames()

  return (
    <div>
      <PageHeader
        title="Jogos"
        breadcrumbs={[{ label: 'Estúdio', href: '/studio' }, { label: 'Jogos' }]}
        actions={
          <RoleGate allow="studio">
            <Button size="sm">
              <Icon name="plus" />
              Novo jogo
            </Button>
          </RoleGate>
        }
      />
      <QueryBoundary
        query={games}
        emptyFallback={
          <EmptyState
            icon="games"
            title="Nenhum jogo ainda"
            description="Quando a API estiver no ar, seus jogos aparecerão aqui."
          />
        }
      >
        {(data) => (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((game) => (
                <TableRow key={game.id}>
                  <TableCell className="font-medium">{game.title}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{game.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </QueryBoundary>
    </div>
  )
}
