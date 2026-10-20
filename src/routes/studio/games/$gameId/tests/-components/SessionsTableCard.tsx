import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Link } from '@tanstack/react-router'
import { useState, type ReactNode } from 'react'
import type { ReportSession } from '@/api-types'
import { QueryBoundary } from '@/components/common/QueryBoundary'
import { PageSizeSelect, Pagination } from '@/components/common/TablePagination'
import { Tag } from '@/components/common/Tag'
import { Icon } from '@/components/icon'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useReportSessions } from '@/features/reports/api/use-report-sessions'
import { archetypeView, playerTierView } from '@/features/reports/report-labels'
import { formatDecimal, formatDuration } from '@/lib/format'
import { cn } from '@/lib/utils'
import { AI_PENDING_HINT } from './ReportCard'

type SortKey = 'archetype' | 'duration'
type Sort = { key: SortKey; direction: 'asc' | 'desc' }

function sortSessions(sessions: ReportSession[], sort: Sort | null): ReportSession[] {
  if (!sort) return sessions
  const value = (s: ReportSession) =>
    sort.key === 'duration'
      ? (s.durationMs ?? -1)
      : s.archetype
        ? archetypeView(s.archetype).label
        : ''
  const factor = sort.direction === 'asc' ? 1 : -1
  return [...sessions].sort((a, b) => {
    const [x, y] = [value(a), value(b)]
    return (x < y ? -1 : x > y ? 1 : 0) * factor
  })
}

type SessionsTableCardProps = {
  gameId: string
  testId: string
  defaultPageSize?: number
  onSeeAll?: () => void
}

/**
 * Sessões do teste (tabela da Tela 11). A API pagina por cursor: as páginas já
 * visitadas ficam guardadas para voltar/pular, e a seta avança para a próxima.
 * A ordenação reordena só a página atual.
 */
export function SessionsTableCard({
  gameId,
  testId,
  defaultPageSize = 5,
  onSeeAll,
}: SessionsTableCardProps) {
  const [pageSize, setPageSize] = useState(defaultPageSize)
  const [cursors, setCursors] = useState<(string | null)[]>([null])
  const [pageIndex, setPageIndex] = useState(0)
  const [sort, setSort] = useState<Sort | null>(null)
  const sessions = useReportSessions({
    testId,
    limit: pageSize,
    cursor: cursors[pageIndex] ?? null,
  })

  function changePageSize(size: number) {
    setPageSize(size)
    setCursors([null])
    setPageIndex(0)
  }

  function goToPage(page: number) {
    const index = page - 1
    if (index < cursors.length) {
      setPageIndex(index)
    } else if (index === cursors.length && sessions.data?.nextCursor) {
      setCursors([...cursors, sessions.data.nextCursor])
      setPageIndex(index)
    }
  }

  function toggleSort(key: SortKey) {
    setSort((current) =>
      current?.key !== key
        ? { key, direction: 'asc' }
        : current.direction === 'asc'
          ? { key, direction: 'desc' }
          : null,
    )
  }

  return (
    <section className="flex flex-col gap-4 overflow-hidden rounded-3xl border border-report-card-border bg-stat-card-background pb-4 leading-[normal] text-foreground-strong">
      <QueryBoundary
        query={sessions}
        isEmpty={(data) => data.data.length === 0}
        loadingFallback={
          <SessionsTable sort={sort} onSort={toggleSort}>
            <SkeletonRows rows={pageSize} />
          </SessionsTable>
        }
        emptyFallback={
          <SessionsTable sort={sort} onSort={toggleSort}>
            <tr>
              <td colSpan={7} className="px-6 py-10 text-center text-[14px]">
                Nenhuma sessão registrada neste teste ainda.
              </td>
            </tr>
          </SessionsTable>
        }
      >
        {(page) => (
          <SessionsTable sort={sort} onSort={toggleSort}>
            {sortSessions(page.data, sort).map((session) => (
              <SessionRow
                key={session.sessionId}
                gameId={gameId}
                testId={testId}
                session={session}
              />
            ))}
          </SessionsTable>
        )}
      </QueryBoundary>

      <hr className="mx-14 border-report-card-border" />

      <div className="flex flex-wrap items-center gap-6 px-14">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2 text-[12px]">
          <PageSizeSelect
            value={pageSize}
            onChange={changePageSize}
            className="text-[12px] text-foreground-strong"
            triggerClassName="h-11.5 w-18.5 rounded-xl border-report-card-border bg-field text-[16px] text-foreground-strong"
          />
          {sessions.data ? (
            <>
              <span>
                {rangeLabel(pageIndex, pageSize, sessions.data.data.length, sessions.data.total)}
              </span>
              <span>
                Atualizado{' '}
                {formatDistanceToNow(sessions.dataUpdatedAt, { addSuffix: true, locale: ptBR })}
              </span>
            </>
          ) : null}
        </div>

        {sessions.data ? (
          <Pagination
            page={pageIndex + 1}
            totalPages={Math.max(1, Math.ceil(sessions.data.total / pageSize))}
            onPageChange={goToPage}
            isPageEnabled={(page) =>
              page <= cursors.length ||
              (page === cursors.length + 1 && Boolean(sessions.data?.nextCursor))
            }
            hasNextPage={Boolean(sessions.data.nextCursor)}
            pageClassName="h-8 min-w-8 rounded-full border-2 border-report-icon-button px-3 text-[14px] text-foreground-strong"
            activePageClassName="border-transparent bg-report-progress font-bold text-report-icon-button"
          />
        ) : null}

        <div className="flex flex-1 justify-end">
          {onSeeAll ? (
            <button
              type="button"
              onClick={onSeeAll}
              className="flex items-center gap-1 text-[16px] font-bold text-primary hover:underline"
            >
              Ir para Todos os testes
              <Icon name="arrow-right" className="size-5" />
            </button>
          ) : null}
        </div>
      </div>
    </section>
  )
}

function SessionsTable({
  sort,
  onSort,
  children,
}: {
  sort: Sort | null
  onSort: (key: SortKey) => void
  children: ReactNode
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1100px] table-fixed text-left">
        <caption className="sr-only">Sessões do teste</caption>
        <thead>
          <tr className="h-12 bg-report-table-header text-[16px] text-report-table-header-foreground">
            <th scope="col" className="ps-6 font-normal">
              Data
            </th>
            <SortableHeader label="Arquétipo" sortKey="archetype" sort={sort} onSort={onSort} />
            <th scope="col" className="font-normal">
              Tipo de jogador
            </th>
            <SortableHeader label="Duração" sortKey="duration" sort={sort} onSort={onSort} />
            <th scope="col" className="font-normal">
              Qualidade do teste IA
            </th>
            <th scope="col" className="font-normal">
              Orbit Plug-in
            </th>
            <th scope="col" className="w-[289px] pe-6 font-normal">
              Ações
            </th>
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}

function rangeLabel(pageIndex: number, pageSize: number, rows: number, total: number): string {
  if (total === 0) return 'Nenhum registro.'
  const first = pageIndex * pageSize + 1
  const last = pageIndex * pageSize + rows
  return `Mostrando ${first}-${last} de ${total.toLocaleString('pt-BR')} registros.`
}

function SortableHeader({
  label,
  sortKey,
  sort,
  onSort,
}: {
  label: string
  sortKey: SortKey
  sort: Sort | null
  onSort: (key: SortKey) => void
}) {
  const direction = sort?.key === sortKey ? sort.direction : null
  return (
    <th
      scope="col"
      className="font-normal"
      aria-sort={direction === 'asc' ? 'ascending' : direction === 'desc' ? 'descending' : 'none'}
    >
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className="flex items-center gap-2"
        title="Ordenar esta página"
      >
        {label}
        <span className="flex flex-col" aria-hidden>
          <Icon
            name="chevron-down"
            className={cn('-mb-1.5 size-3 rotate-180', direction === 'desc' && 'opacity-30')}
          />
          <Icon name="chevron-down" className={cn('size-3', direction === 'asc' && 'opacity-30')} />
        </span>
      </button>
    </th>
  )
}

function SessionRow({
  gameId,
  testId,
  session,
}: {
  gameId: string
  testId: string
  session: ReportSession
}) {
  const archetype = session.archetype ? archetypeView(session.archetype) : null
  const tier = session.playerTier ? playerTierView(session.playerTier) : null
  return (
    <tr className="h-16 text-[14px]">
      <td className="ps-6">{new Date(session.startedAt).toLocaleDateString('pt-BR')}</td>
      <td>{archetype ? <Tag tone={archetype.tone}>{archetype.label}</Tag> : <NotInformed />}</td>
      <td>{tier ? <Tag tone={tier.tone}>{tier.label}</Tag> : <NotInformed />}</td>
      <td className="font-bold">
        {session.durationMs === null ? '—' : formatDuration(session.durationMs)}
      </td>
      <td
        className="font-bold"
        title={session.aiQualityScore === null ? AI_PENDING_HINT : undefined}
      >
        {session.aiQualityScore === null ? '—' : formatDecimal(session.aiQualityScore)}
      </td>
      <td>
        <Tag tone={session.telemetryConnected ? 'blue' : 'red'}>
          {session.telemetryConnected ? 'SIM' : 'NÃO'}
        </Tag>
      </td>
      <td className="pe-6">
        <div className="flex h-9 items-center gap-2.5">
          <Button
            asChild
            className="h-9 flex-1 rounded-lg bg-linear-to-br from-report-action-start to-report-action-end text-[16px] font-bold text-foreground-strong shadow-[inset_-2px_-2px_1px_0_rgb(255_255_255/25%)]"
          >
            <Link
              to="/studio/games/$gameId/tests/$testId/sessions/$sessionId"
              params={{ gameId, testId, sessionId: session.sessionId }}
            >
              Mostrar teste
            </Link>
          </Button>
          <Button
            disabled
            size="icon"
            title="Mais ações em breve"
            aria-label="Mais ações"
            className="rounded-lg bg-report-icon-button text-report-icon-button-foreground"
          >
            <Icon name="more" className="size-6" />
          </Button>
        </div>
      </td>
    </tr>
  )
}

function NotInformed() {
  return <span className="text-[12px]">Não informado</span>
}

function SkeletonRows({ rows }: { rows: number }) {
  return Array.from({ length: rows }, (_, i) => (
    <tr key={i} className="h-16" aria-busy="true">
      <td colSpan={7} className="px-6">
        <Skeleton className="h-6 w-full bg-white/10" />
      </td>
    </tr>
  ))
}
