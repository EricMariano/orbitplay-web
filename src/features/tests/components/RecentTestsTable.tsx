import type { Test, TestModel } from '@/api-types'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { testStatusConfig } from '../test-status'

/** O Orbit Plug-in só existe no modelo com telemetria. */
const PLUGIN_MODEL: TestModel['key'] = 'free_exploration_telemetry'

function formatDate(iso: string | null) {
  if (!iso) return '-'
  return new Date(iso).toLocaleDateString('pt-BR')
}

type RecentTestsTableProps = {
  tests: Test[]
  /** Título de cada jogo, por id. */
  gameTitles: ReadonlyMap<string, string>
  /** Nome de cada modelo de teste, por chave. */
  modelNames: ReadonlyMap<string, string>
}

/** Tabela "Testes recentes" (Tela 02). Puramente apresentacional. */
export function RecentTestsTable({ tests, gameTitles, modelNames }: RecentTestsTableProps) {
  return (
    <Card className="rounded-lg border border-white bg-stat-card-background py-4">
      <CardContent className="px-0">
        <Table>
          <TableHeader className="bg-stat-card-header-background">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-stat-card-muted">Jogo</TableHead>
              <TableHead className="text-stat-card-muted">Teste</TableHead>
              <TableHead className="text-stat-card-muted">Tipo de teste</TableHead>
              <TableHead className="text-stat-card-muted">Status</TableHead>
              <TableHead className="text-stat-card-muted">Publicado em</TableHead>
              <TableHead className="text-stat-card-muted">Expira em</TableHead>
              <TableHead className="text-stat-card-muted">Orbit Plug-in</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tests.map((test) => {
              const status = testStatusConfig[test.status]
              const hasPlugin = test.testModelKey === PLUGIN_MODEL
              return (
                <TableRow key={test.id} className="hover:bg-white/5">
                  <TableCell className="text-stat-card-foreground">
                    {gameTitles.get(test.gameId) ?? '-'}
                  </TableCell>
                  <TableCell className="text-stat-card-foreground">
                    {test.title ?? 'Sem título'}
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-tint-olive-background text-tint-olive-foreground">
                      {(modelNames.get(test.testModelKey) ?? test.testModelKey).toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={status.className}>{status.label}</Badge>
                  </TableCell>
                  <TableCell className="text-stat-card-muted">
                    {formatDate(test.publishedAt)}
                  </TableCell>
                  <TableCell className="text-stat-card-muted">
                    {formatDate(test.expiresAt)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        hasPlugin
                          ? 'bg-tint-info-background text-tint-info-foreground'
                          : 'bg-tint-danger-background text-tint-danger-foreground'
                      }
                    >
                      {hasPlugin ? 'SIM' : 'NÃO'}
                    </Badge>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
