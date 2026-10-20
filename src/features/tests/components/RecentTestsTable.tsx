import { Link } from '@tanstack/react-router'
import type { Test } from '@/api-types'
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
import { pluginStatusView, testStatusConfig } from '../test-status'

const dateFormatter = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' })
function formatDate(iso: string | null) {
  if (!iso) return '—'
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? '—' : dateFormatter.format(date)
}

type RecentTestsTableProps = {
  tests: Test[]
  gameTitles: ReadonlyMap<string, string>
  modelNames: ReadonlyMap<string, string>
}

export function RecentTestsTable({ tests, gameTitles, modelNames }: RecentTestsTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-field-border/30 bg-field">
      <Table aria-label="Testes recentes do estúdio">
        <TableHeader className="bg-report-table-header [&_th]:text-report-table-header-foreground">
          <TableRow className="hover:bg-transparent">
            <TableHead className="pl-5">Jogo</TableHead>
            <TableHead>Teste</TableHead>
            <TableHead>Tipo de teste</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Publicado em</TableHead>
            <TableHead>Término previsto</TableHead>
            <TableHead>Orbit Plug-in</TableHead>
            <TableHead className="pr-5 text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tests.map((test) => {
            const status = testStatusConfig[test.status]
            const plugin = pluginStatusView(test.build)
            const final = test.status === 'finished' || test.status === 'expired'
            return (
              <TableRow key={test.id} className="border-field-border/15 hover:bg-field/60">
                <TableCell className="pl-5 font-medium">
                  <Link
                    to="/studio/games/$gameId"
                    params={{ gameId: test.gameId }}
                    className="hover:text-primary hover:underline"
                  >
                    {gameTitles.get(test.gameId) ?? 'Jogo indisponível'}
                  </Link>
                </TableCell>
                <TableCell className="max-w-64 whitespace-normal">
                  {test.title ?? 'Teste sem nome'}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="font-normal">
                    {modelNames.get(test.testModelKey) ?? 'Modelo não informado'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={status.className}>{status.label}</Badge>
                </TableCell>
                <TableCell>{formatDate(test.publishedAt)}</TableCell>
                <TableCell>{formatDate(test.expiresAt)}</TableCell>
                <TableCell>
                  <span className={plugin.className}>{plugin.label}</span>
                </TableCell>
                <TableCell className="pr-5 text-right">
                  <Button
                    asChild
                    size="sm"
                    className={
                      final
                        ? 'bg-highlight text-highlight-foreground hover:bg-highlight/90'
                        : 'bg-linear-to-r from-report-action-start to-report-action-end text-primary-foreground'
                    }
                  >
                    <Link
                      to="/studio/games/$gameId/tests/$testId"
                      params={{ gameId: test.gameId, testId: test.id }}
                    >
                      <Icon name="reports" />
                      {final ? 'Relatório final' : 'Relatório'}
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
