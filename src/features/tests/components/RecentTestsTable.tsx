import { PageSizeSelect, Pagination } from '@/components/common/TablePagination'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Icon } from '@/components/icon'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { PaginatedRecentTests, RecentTest } from '../types'

const statusConfig: Record<RecentTest['status'], { label: string; className: string }> = {
  in_progress: {
    label: 'Em andamento',
    className: 'bg-tint-warning-background text-tint-warning-foreground',
  },
  completed: {
    label: 'Finalizado',
    className: 'bg-tint-success-background text-tint-success-foreground',
  },
  generating_insights: {
    label: 'Gerando insights IA',
    className: 'bg-tint-violet-background text-tint-violet-foreground',
  },
}

function formatDate(iso: string | null) {
  if (!iso) return '-'
  return new Date(iso).toLocaleDateString('pt-BR')
}

function DetailsAction({ status }: { status: RecentTest['status'] }) {
  if (status === 'in_progress') return null // sem relatório enquanto o teste está rodando (RN-02, Tela 05)
  if (status === 'completed') {
    return (
      <Button size="sm" variant="highlight">
        Detalhes
      </Button>
    )
  }
  return (
    <Button size="sm" className="bg-gradient-to-r from-cta-configure-from to-cta-configure-to">
      Detalhes
    </Button>
  )
}

type RecentTestsTableProps = {
  data: PaginatedRecentTests
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

/** Tabela "Testes recentes" (Tela 02). Puramente apresentacional. */
export function RecentTestsTable({ data, onPageChange, onPageSizeChange }: RecentTestsTableProps) {
  const totalPages = Math.max(1, Math.ceil(data.totalCount / data.pageSize))
  const firstRow = (data.page - 1) * data.pageSize + 1
  const lastRow = Math.min(data.page * data.pageSize, data.totalCount)

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
              <TableHead className="text-stat-card-muted">Data início</TableHead>
              <TableHead className="text-stat-card-muted">Data fim</TableHead>
              <TableHead className="text-stat-card-muted">Orbit Plug-in</TableHead>
              <TableHead className="text-center text-stat-card-muted">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.items.map((test) => {
              const status = statusConfig[test.status]
              return (
                <TableRow key={test.id} className="hover:bg-white/5">
                  <TableCell className="text-stat-card-foreground">{test.gameTitle}</TableCell>
                  <TableCell className="text-stat-card-foreground">{test.testName}</TableCell>
                  <TableCell>
                    <Badge className="bg-tint-olive-background text-tint-olive-foreground">
                      {test.testType.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={status.className}>{status.label}</Badge>
                  </TableCell>
                  <TableCell className="text-stat-card-muted">
                    {formatDate(test.startDate)}
                  </TableCell>
                  <TableCell className="text-stat-card-muted">{formatDate(test.endDate)}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        test.hasOrbitPlugin
                          ? 'bg-tint-info-background text-tint-info-foreground'
                          : 'bg-tint-danger-background text-tint-danger-foreground'
                      }
                    >
                      {test.hasOrbitPlugin ? 'SIM' : 'NÃO'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <DetailsAction status={test.status} />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon-sm" aria-label="Mais ações">
                            <Icon name="more" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Ver sessões</DropdownMenuItem>
                          <DropdownMenuItem>Duplicar teste</DropdownMenuItem>
                          <DropdownMenuItem variant="destructive">Encerrar teste</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between px-4 pt-4">
          <div className="flex items-center gap-3">
            <PageSizeSelect value={data.pageSize} onChange={onPageSizeChange} />
            <span className="text-sm text-stat-card-muted">
              Mostrando {firstRow}-{lastRow} de {data.totalCount.toLocaleString('pt-BR')} registros.
              Atualizado há 1 minuto
            </span>
          </div>

          <Pagination page={data.page} totalPages={totalPages} onPageChange={onPageChange} />

          <span className="text-sm text-primary">Ir para Testes →</span>
        </div>
      </CardContent>
    </Card>
  )
}
