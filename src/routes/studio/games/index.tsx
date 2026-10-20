import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { EmptyState } from '@/components/common/EmptyState'
import { PageHeader } from '@/components/common/PageHeader'
import { QueryBoundary } from '@/components/common/QueryBoundary'
import { RoleGate } from '@/components/common/RoleGate'
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
import { GameSummaryCard } from '@/features/games/components/GameSummaryCard'
import { useGames } from '@/features/games/api/use-games'
import { gameStatusLabels } from '@/features/games/game-status'
import { STUDIO_ROLES } from '@/lib/auth'
import { NewGameDialog } from './-components/NewGameDialog'

export const Route = createFileRoute('/studio/games/')({
  component: GamesList,
})

function GamesList() {
  const games = useGames()
  const [view, setView] = useState<'grid' | 'table'>('grid')

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
      <div className="mb-4 flex gap-2" role="group" aria-label="Visualização dos jogos">
        <Button
          size="sm"
          variant={view === 'grid' ? 'default' : 'outline'}
          aria-pressed={view === 'grid'}
          onClick={() => setView('grid')}
        >
          Cartões
        </Button>
        <Button
          size="sm"
          variant={view === 'table' ? 'default' : 'outline'}
          aria-pressed={view === 'table'}
          onClick={() => setView('table')}
        >
          Tabela
        </Button>
      </div>
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
          <div className="space-y-6">
            <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {[
                ['Total de jogos', data.length],
                ['Ativos', data.filter((game) => game.status === 'active').length],
                ['Rascunhos', data.filter((game) => game.status === 'draft').length],
                ['Arquivados', data.filter((game) => game.status === 'archived').length],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg border border-border bg-surface p-4">
                  <dt className="text-sm text-muted">{label}</dt>
                  <dd className="text-xl font-semibold">{value}</dd>
                </div>
              ))}
            </dl>
            {view === 'grid' ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {data.map((game) => (
                  <div key={game.id} className="space-y-2">
                    <GameSummaryCard game={game} />
                    <Button asChild size="sm" variant="outline" className="w-full">
                      <Link to="/studio/games/$gameId/chat" params={{ gameId: game.id }}>
                        Gerenciar chat
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
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
                    <TableHead className="text-right">Comunidade</TableHead>
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
                      <TableCell className="text-right">
                        <Button asChild variant="outline" size="sm">
                          <Link to="/studio/games/$gameId/chat" params={{ gameId: game.id }}>
                            Gerenciar chat
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        )}
      </QueryBoundary>
    </div>
  )
}
