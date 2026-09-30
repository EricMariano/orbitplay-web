import type { PlayerTest, TestCta } from '@/features/games/player-game-types'
import { useEffect, useState } from 'react'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { Icon } from '@/components/icon'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatCurrency } from '@/lib/format'
import { remainingTime, testProgress } from '@/features/games/game-details-utils'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'

type GameTestTableProps = {
  tests: PlayerTest[]
  mode: 'available' | 'mine'
  joiningTestId?: string
  onJoin: (testId: string) => void
  onDetails: (testId: string) => void
}

const modelLabels: Record<string, string> = {
  free_exploration_telemetry: 'Qualitativo',
  free_exploration: 'Qualitativo',
  ab_test: 'A/B',
  ab_test_images: 'A/B',
}

const ctaLabels: Record<TestCta, string> = {
  start: 'Começar!',
  continue: 'Continuar!',
  completed: 'Completo!',
  in_review: 'Completo! (Em análise)',
  downloading: 'Baixando build...',
  unavailable: 'Indisponível',
}

function TestAction({
  test,
  joining,
  busy,
  onJoin,
}: {
  test: PlayerTest
  joining: boolean
  busy: boolean
  onJoin: () => void
}) {
  if (test.cta === 'start') {
    return (
      <Button
        type="button"
        size="sm"
        className="h-9 min-w-40 bg-gradient-to-r from-[#248ff7] to-[#875af2] font-semibold"
        disabled={test.disabled || busy}
        onClick={onJoin}
      >
        {joining ? <Icon name="loader" className="animate-spin" /> : null}
        {joining ? 'Entrando...' : ctaLabels[test.cta]}
      </Button>
    )
  }

  if (test.cta === 'continue') {
    return (
      <Button
        disabled
        title={
          test.disabledReason || 'A execução do teste ainda não está disponível nesta aplicação.'
        }
        className="h-9 min-w-40 bg-gradient-to-r from-[#f8643b] to-[#ee7e5f] px-3 text-sm font-semibold text-white"
      >
        {ctaLabels[test.cta]}
      </Button>
    )
  }

  if (test.cta === 'downloading') {
    return (
      <div className="min-w-40 space-y-2 text-center text-sm font-semibold text-foreground">
        <span>{ctaLabels[test.cta]}</span>
        <Progress value={undefined} className="h-0.5 bg-white/70" />
      </div>
    )
  }

  return (
    <span
      className={
        test.cta === 'completed' || test.cta === 'in_review'
          ? 'font-semibold text-[#00ff78]'
          : 'text-muted'
      }
    >
      {test.disabledReason || ctaLabels[test.cta]}
    </span>
  )
}

export function GameTestTable({
  tests,
  mode,
  joiningTestId,
  onJoin,
  onDetails,
}: GameTestTableProps) {
  const [now, setNow] = useState(() => Date.now())
  const [sort, setSort] = useState<{ field: 'modelKey' | 'rewardCents'; direction: 1 | -1 } | null>(
    null,
  )
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [])
  const sorted = sort
    ? [...tests].sort((a, b) => {
        const left = a[sort.field]
        const right = b[sort.field]
        if (left == null) return right == null ? 0 : 1
        if (right == null) return -1
        return (
          (typeof left === 'number' && typeof right === 'number'
            ? left - right
            : String(left).localeCompare(String(right))) * sort.direction
        )
      })
    : tests
  function sortButton(field: 'modelKey' | 'rewardCents', label: string) {
    const SortIcon =
      sort?.field !== field ? ArrowUpDown : sort.direction === 1 ? ArrowUp : ArrowDown
    return (
      <button
        type="button"
        className="inline-flex items-center gap-2"
        onClick={() =>
          setSort({ field, direction: sort?.field === field && sort.direction === 1 ? -1 : 1 })
        }
      >
        {label}
        <SortIcon className="size-3" />
      </button>
    )
  }
  return (
    <div className="overflow-hidden rounded-2xl border border-white/60 bg-white/25">
      <Table className="min-w-[1220px] font-login-body">
        <TableHeader className="bg-[#e8edf9]">
          <TableRow className="border-0 hover:bg-transparent">
            <TableHead className="h-12 px-6 text-[#33323d]">Nome do teste</TableHead>
            <TableHead
              aria-sort={
                sort?.field === 'modelKey'
                  ? sort.direction === 1
                    ? 'ascending'
                    : 'descending'
                  : 'none'
              }
              className="h-12 px-4 text-[#33323d]"
            >
              {sortButton('modelKey', 'Tipo')}
            </TableHead>
            <TableHead className="h-12 px-4 text-[#33323d]">Expira</TableHead>
            <TableHead className="h-12 px-4 text-[#33323d]">Duração estimada</TableHead>
            <TableHead className="h-12 px-4 text-[#33323d]">Vagas disponíveis</TableHead>
            <TableHead className="h-12 px-4 text-[#33323d]">
              {mode === 'mine' ? 'Progresso' : 'Seu progresso'}
            </TableHead>
            <TableHead
              aria-sort={
                sort?.field === 'rewardCents'
                  ? sort.direction === 1
                    ? 'ascending'
                    : 'descending'
                  : 'none'
              }
              className="h-12 px-4 text-[#33323d]"
            >
              {sortButton('rewardCents', 'Recompensa')}
            </TableHead>
            <TableHead className="h-12 px-4 text-[#33323d]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((test) => {
            const progress = testProgress(test)
            return (
              <TableRow key={test.testId} className="h-12 border-0 hover:bg-white/5">
                <TableCell className="px-6 text-sm text-white/80">{test.title}</TableCell>
                <TableCell className="px-4">
                  <Badge
                    className={
                      test.modelKey?.startsWith('ab_')
                        ? 'bg-[#5a0080] text-[#d2a8ff]'
                        : 'bg-[#806b17] text-[#ffd52e]'
                    }
                  >
                    {modelLabels[test.modelKey ?? ''] ?? 'Não informado'}
                  </Badge>
                </TableCell>
                <TableCell className="px-4 font-semibold text-white/85">
                  {remainingTime(test.expiresAt, now)}
                </TableCell>
                <TableCell className="px-4 text-white/80">
                  {test.durationMinutes ? `${test.durationMinutes} min` : 'Não informado'}
                </TableCell>
                <TableCell className="px-4 text-white/80">
                  {test.spotsLeft == null ? 'Não informado' : `${test.spotsLeft} vagas`}
                </TableCell>
                <TableCell className="px-4">
                  <div className="flex min-w-36 items-center gap-2">
                    <span className="min-w-8 text-xs text-white/80">
                      {progress == null ? 'Não informado' : `${progress}%`}
                    </span>
                    {progress != null ? (
                      <Progress
                        value={progress}
                        className="h-2 bg-white"
                        indicatorClassName={progress === 100 ? 'bg-[#00ff78]' : 'bg-[#248ff7]'}
                      />
                    ) : null}
                  </div>
                </TableCell>
                <TableCell className="px-4 text-white/80">
                  {test.rewardCents == null
                    ? 'Não informado'
                    : formatCurrency(test.rewardCents / 100)}
                </TableCell>
                <TableCell className="px-4">
                  <div className="flex items-center justify-between gap-2">
                    <TestAction
                      test={test}
                      joining={joiningTestId === test.testId}
                      busy={Boolean(joiningTestId)}
                      onJoin={() => onJoin(test.testId)}
                    />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          className="shrink-0 bg-[#e7e8e9] text-[#33323d] hover:bg-white"
                          aria-label={`Mais ações para ${test.title}`}
                        >
                          <Icon name="more" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => onDetails(test.testId)}>
                          Ver detalhes do teste
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
