import { Link } from '@tanstack/react-router'
import type { TestList } from '@/api-types'
import { EmptyState } from '@/components/common/EmptyState'
import { QueryBoundary } from '@/components/common/QueryBoundary'
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
import { useGameTests } from '@/features/tests/api/use-game-tests'
import { useTestModels } from '@/features/tests/api/use-test-models'
import { testStatusConfig, pluginStatusView } from '@/features/tests/test-status'
import { formatCurrency } from '@/lib/format'

const dateFormatter = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' })
function dateLabel(value: string | null) {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '—' : dateFormatter.format(date)
}

export function StudioGameTests({ gameId, scope }: { gameId: string; scope: 'active' | 'all' }) {
  const tests = useGameTests(gameId, scope)
  const models = useTestModels()

  return (
    <QueryBoundary
      query={tests}
      isEmpty={(data) => data.pages.every((page) => page.data.length === 0)}
      emptyFallback={
        <EmptyState
          icon="tests"
          title={scope === 'active' ? 'Nenhum teste ativo' : 'Nenhum teste criado'}
          description={
            scope === 'active'
              ? 'Os testes em andamento aparecerão aqui. Consulte o histórico em Todos os testes.'
              : 'Os testes criados para este jogo aparecerão aqui.'
          }
        />
      }
    >
      {(data) => (
        <div className="overflow-hidden rounded-xl border border-field-border/40 bg-field">
          <Table
            aria-label={scope === 'active' ? 'Testes ativos do jogo' : 'Todos os testes do jogo'}
          >
            <TableHeader className="bg-report-table-header [&_th]:text-report-table-header-foreground">
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-5">Teste</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data de início</TableHead>
                <TableHead>Término previsto</TableHead>
                <TableHead>Orbit Plug-in</TableHead>
                <TableHead className="text-right">Recompensa</TableHead>
                <TableHead className="pr-5 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.pages
                .flatMap((page) => page.data)
                .map((test) => (
                  <TestRow
                    key={test.id}
                    gameId={gameId}
                    test={test}
                    modelLabel={models.data?.find((model) => model.key === test.testModelKey)?.name}
                  />
                ))}
            </TableBody>
          </Table>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-field-border/20 px-5 py-4">
            <p className="text-xs text-muted">
              {data.pages.reduce((total, page) => total + page.data.length, 0)} testes carregados
            </p>
            {tests.hasNextPage && (
              <Button
                variant="outline"
                size="sm"
                disabled={tests.isFetchingNextPage}
                onClick={() => void tests.fetchNextPage()}
              >
                {tests.isFetchingNextPage ? (
                  <>
                    <Icon name="loader" className="animate-spin" />
                    Carregando…
                  </>
                ) : (
                  'Carregar mais testes'
                )}
              </Button>
            )}
          </div>
        </div>
      )}
    </QueryBoundary>
  )
}

function TestRow({
  test,
  gameId,
  modelLabel,
}: {
  test: TestList['data'][number]
  gameId: string
  modelLabel?: string
}) {
  const status = testStatusConfig[test.status]
  const isFinal = test.status === 'finished' || test.status === 'expired'
  const plugin = pluginStatusView(test.build)
  return (
    <TableRow className="border-field-border/15 hover:bg-field/60">
      <TableCell className="max-w-64 whitespace-normal pl-5 font-medium">
        {test.title ?? 'Teste sem nome'}
      </TableCell>
      <TableCell>
        <Badge variant="secondary" className="font-normal">
          {modelLabel ?? 'Modelo não informado'}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge className={status.className}>{status.label}</Badge>
      </TableCell>
      <TableCell>{dateLabel(test.publishedAt)}</TableCell>
      <TableCell>{dateLabel(test.expiresAt)}</TableCell>
      <TableCell>
        <span className={plugin.className}>{plugin.label}</span>
      </TableCell>
      <TableCell className="text-right">
        {test.rewardCents == null ? '—' : formatCurrency(test.rewardCents / 100)}
      </TableCell>
      <TableCell className="pr-5 text-right">
        <Button
          asChild
          size="sm"
          className={
            isFinal
              ? 'bg-highlight text-highlight-foreground hover:bg-highlight/90'
              : 'bg-linear-to-r from-report-action-start to-report-action-end text-primary-foreground'
          }
        >
          <Link to="/studio/games/$gameId/tests/$testId" params={{ gameId, testId: test.id }}>
            <Icon name="reports" />
            {isFinal ? 'Relatório final' : 'Relatório'}
          </Link>
        </Button>
      </TableCell>
    </TableRow>
  )
}
