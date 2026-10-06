import { createFileRoute, Link } from '@tanstack/react-router'
import { EmptyState } from '@/components/common/EmptyState'
import { PageHeader } from '@/components/common/PageHeader'
import { QueryBoundary } from '@/components/common/QueryBoundary'
import { RoleGate } from '@/components/common/RoleGate'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useGames } from '@/features/games/api/use-games'
import { gameStatusLabels } from '@/features/games/game-status'
import { STUDIO_ROLES } from '@/lib/auth'
import { NewGameDialog } from './-components/NewGameDialog'

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
          <RoleGate allow={STUDIO_ROLES}>
            <NewGameDialog />
          </RoleGate>
        }
      />
      <QueryBoundary
        query={games}
        emptyFallback={
          <EmptyState
            icon="games"
            title="Nenhum jogo ainda"
            description="Cadastre seu primeiro jogo em “Novo jogo”."
          />
        }
      >
        {(data) => (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Gênero</TableHead>
                <TableHead>Plataforma</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Testes ativos</TableHead>
                <TableHead className="text-right">Jogadores</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((game) => (
                <TableRow key={game.id}>
                  <TableCell className="font-medium">{game.title}</TableCell>
                  <TableCell className="text-muted">{game.genre ?? '—'}</TableCell>
                  <TableCell className="text-muted">{game.platform ?? '—'}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{gameStatusLabels[game.status]}</Badge>
                  </TableCell>
                  <TableCell className="text-right">{game.metrics.testsActive}</TableCell>
                  <TableCell className="text-right">{game.metrics.playersTotal}</TableCell>
                  <TableCell className="text-right">
                    <RoleGate allow={STUDIO_ROLES}>
                      <Link
                        to="/studio/games/$gameId/tests/new"
                        params={{ gameId: game.id }}
                        className="text-sm text-primary hover:underline"
                      >
                        Novo teste
                      </Link>
                    </RoleGate>
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
