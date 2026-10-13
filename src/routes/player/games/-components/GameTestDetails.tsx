import { useQuery } from '@tanstack/react-query'
import { ErrorState } from '@/components/common/ErrorState'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { gameDetailsErrorMessage } from '@/features/games/game-details-utils'
import type { Participation, PlayerTest } from '@/features/games/player-game-types'
import { api } from '@/lib/api-client'
import { formatCurrency } from '@/lib/format'

const statuses: Record<Participation['status'], string> = {
  reserved: 'Vaga reservada',
  tutorial: 'Tutorial',
  downloading: 'Baixando build',
  ready: 'Pronto para iniciar',
  playing: 'Em andamento',
  form_pending: 'Avaliação pendente',
  in_review: 'Em análise',
  completed: 'Concluído',
  rejected: 'Não aprovado',
  abandoned: 'Abandonado',
}

export function GameTestDetails({
  testId,
  onClose,
}: {
  testId: string | null
  onClose: () => void
}) {
  const test = useQuery({
    queryKey: ['player', 'test', testId],
    queryFn: ({ signal }) =>
      api.get<PlayerTest>(`/player/tests/${encodeURIComponent(testId!)}`, { signal }),
    enabled: Boolean(testId),
  })
  return (
    <Dialog
      open={Boolean(testId)}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DialogContent className="max-h-[80dvh] overflow-y-auto">
        <DialogTitle>{test.data?.title ?? 'Detalhes do teste'}</DialogTitle>
        <DialogDescription>Disponibilidade e participação</DialogDescription>
        {test.isPending ? (
          <Skeleton className="h-40 w-full" />
        ) : test.isError ? (
          <ErrorState
            message={gameDetailsErrorMessage(test.error)}
            onRetry={() => void test.refetch()}
          />
        ) : (
          <dl className="grid grid-cols-[1fr_1fr] gap-4 text-sm [&_dt]:text-muted [&_dd]:break-words">
            <dt>Duração estimada</dt>
            <dd>
              {test.data.durationMinutes == null
                ? 'Não informada'
                : `${test.data.durationMinutes} min`}
            </dd>
            <dt>Recompensa</dt>
            <dd>
              {test.data.rewardCents == null
                ? 'Não informada'
                : formatCurrency(test.data.rewardCents / 100)}
            </dd>
            <dt>Plataformas</dt>
            <dd>{test.data.platforms?.join(', ') || 'Não informadas'}</dd>
            {test.data.disabledReason ? (
              <>
                <dt>Disponibilidade</dt>
                <dd>{test.data.disabledReason}</dd>
              </>
            ) : null}
            {test.data.participation ? (
              <>
                <dt>Participação</dt>
                <dd>{statuses[test.data.participation.status]}</dd>
                {test.data.participation.resumePoint ? (
                  <>
                    <dt>Ponto de retomada</dt>
                    <dd>{test.data.participation.resumePoint}</dd>
                  </>
                ) : null}
              </>
            ) : null}
          </dl>
        )}
      </DialogContent>
    </Dialog>
  )
}
