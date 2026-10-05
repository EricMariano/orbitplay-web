import type { ReactNode } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { Icon, type IconName } from '@/components/icon'
import { ErrorState } from '@/components/common/ErrorState'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useParticipationResult } from '@/features/sessions/api/use-participation-result'
import type { ParticipationResult } from '@/features/sessions/session-summary'
import { ApiError } from '@/lib/api-client'
import { useAuthStore } from '@/lib/auth'

export const Route = createFileRoute('/player/participations/$participationId/result')({
  component: ParticipationResultPage,
})

function ParticipationResultPage() {
  const { participationId } = Route.useParams()
  const result = useParticipationResult(participationId)
  const user = useAuthStore((state) => state.user)

  return (
    <div className="mx-auto max-w-6xl space-y-5 py-2">
      <div className="space-y-3">
        <p className="text-xs text-muted">
          <Link to="/player" className="hover:text-foreground">
            Home
          </Link>
          <span aria-hidden="true"> / </span>
          <span>Meus testes</span>
          <span aria-hidden="true"> / </span>
          <span>Avaliação do jogo</span>
        </p>
        <h1 className="border-b border-primary/60 pb-4 text-xl font-semibold text-foreground-strong">
          Avaliação do jogo
        </h1>
      </div>

      {result.isPending ? (
        <div className="space-y-4" aria-label="Carregando resultado" aria-busy="true">
          <Skeleton className="h-[480px] w-full rounded-2xl" />
        </div>
      ) : result.isError && !result.data ? (
        <ErrorState
          className="min-h-80"
          title="Não foi possível carregar o resultado"
          message={resultErrorMessage(result.error)}
          onRetry={() => void result.refetch()}
        />
      ) : (
        <section
          className="overflow-hidden rounded-2xl border border-border bg-surface p-5 shadow-lg sm:p-8"
          aria-live="polite"
        >
          {result.isError && (
            <div
              className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-surface-raised px-4 py-3 text-sm text-muted"
              role="status"
            >
              <span>
                Não foi possível atualizar. Exibindo o último estado recebido do servidor.
              </span>
              <Button variant="outline" size="sm" onClick={() => void result.refetch()}>
                Tentar atualizar
              </Button>
            </div>
          )}
          <div className="mb-7 flex flex-wrap items-center justify-center gap-3 text-sm sm:gap-4">
            <span className="grid size-8 place-items-center rounded-full bg-surface-raised font-semibold text-foreground">
              {user?.displayName?.trim().charAt(0).toUpperCase() || '?'}
            </span>
            <span className="text-foreground-strong">{user?.displayName || 'Jogador'}</span>
            <Icon name="gamepad" className="text-primary" />
            <span className="text-primary">Testou</span>
            <span className="text-foreground-strong">
              Participação #{participationId.slice(0, 8)}
            </span>
          </div>

          <div className="mb-5 flex items-center justify-center gap-4" aria-hidden="true">
            <span className="h-px w-24 bg-success/80" />
            <span className="grid size-8 place-items-center rounded-full bg-success text-background">
              <Icon name="check" className="size-5" />
            </span>
            <span className="h-px w-24 bg-success/80" />
          </div>

          <StatusMessage result={result.data!} />

          <div className="my-6 border-t border-border" />

          {result.data!.status === 'in_review' ? (
            <ProcessingState />
          ) : result.data!.status === 'completed' ? (
            <ResultCards result={result.data!} />
          ) : (
            <RejectedState reason={result.data!.rejectedReason} />
          )}

          <div className="mt-7 flex justify-end border-t border-border pt-5">
            <Button asChild>
              <Link to="/player">
                Voltar para a Home
                <Icon name="home" />
              </Link>
            </Button>
          </div>
        </section>
      )}
    </div>
  )
}

function StatusMessage({ result }: { result: ParticipationResult }) {
  if (result.status === 'in_review') {
    return (
      <section className="flex flex-col items-center gap-2 text-center">
        <h2 className="text-lg font-semibold text-foreground-strong">Avaliação enviada!</h2>
        <ol className="space-y-2 text-sm text-foreground-strong">
          <li className="flex items-center justify-center gap-2">
            <Icon name="check" className="text-success" aria-label="Concluído" />
            Formulário recebido
          </li>
          <li className="flex items-center justify-center gap-2">
            <Icon name="loader" className="animate-spin text-highlight" aria-label="Em análise" />
            Análise da participação
          </li>
        </ol>
      </section>
    )
  }

  if (result.status === 'completed') {
    return (
      <section className="flex flex-col items-center gap-2 text-center">
        <h2 className="text-lg font-semibold text-foreground-strong">Avaliação concluída!</h2>
        <p className="text-sm text-muted">
          Os dados abaixo foram retornados para esta participação.
        </p>
      </section>
    )
  }

  return (
    <section className="flex flex-col items-center gap-2 text-center">
      <Icon name="alert" className="size-7 text-destructive" />
      <h2 className="text-lg font-semibold text-foreground-strong">Avaliação rejeitada</h2>
    </section>
  )
}

function ProcessingState() {
  return (
    <section
      className="flex flex-col items-center gap-3 py-5 text-center"
      aria-label="Resultado em análise"
    >
      <p className="text-sm font-medium text-foreground-strong">Recompensas</p>
      <Icon name="loader" className="size-8 animate-spin text-highlight" />
      <p className="max-w-xl text-sm text-muted">
        A participação está em análise. O resultado será atualizado quando o servidor concluir a
        validação.
      </p>
    </section>
  )
}

function ResultCards({ result }: { result: ParticipationResult }) {
  return (
    <section
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      aria-label="Resultado da avaliação"
    >
      <ResultCard title="Conquistas" icon="trophy">
        {result.achievementsUnlocked?.length ? (
          <ul className="space-y-3">
            {result.achievementsUnlocked.map((achievement) => (
              <li key={achievement.key} className="flex items-start gap-3">
                {achievement.iconUrl ? (
                  <img
                    src={achievement.iconUrl}
                    alt=""
                    className="size-8 shrink-0 rounded-lg object-cover"
                  />
                ) : (
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-surface-raised">
                    <Icon name="trophy" className="text-primary" />
                  </span>
                )}
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-foreground-strong">
                    {achievement.name}
                  </span>
                  {achievement.description && (
                    <span className="block text-xs text-muted">{achievement.description}</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-sm text-muted">Nenhuma conquista retornada.</p>
        )}
      </ResultCard>

      <ResultCard title="Qualidade de Feedback" icon="score">
        <Metric value={result.feedbackQuality} suffix=" / 10" />
      </ResultCard>

      <ResultCard title="Nível" icon="target">
        <div className="space-y-2 text-center">
          <Metric value={result.level} />
          <Metric value={result.xpEarned} prefix="+" suffix=" XP" />
        </div>
      </ResultCard>

      <ResultCard title="Recompensa" icon="wallet">
        <div className="space-y-2 text-center">
          <p className="text-2xl font-semibold text-foreground-strong">
            {result.rewardCents == null ? 'Indisponível' : formatCents(result.rewardCents)}
          </p>
          <p className="text-xs text-muted">{rewardStatusLabel(result.rewardStatus)}</p>
        </div>
      </ResultCard>
    </section>
  )
}

function ResultCard({
  title,
  icon,
  children,
}: {
  title: string
  icon: IconName
  children: ReactNode
}) {
  return (
    <article className="flex min-h-44 flex-col gap-5 rounded-xl border border-border p-4">
      <h3 className="flex items-center justify-center gap-2 text-center text-sm font-semibold text-foreground-strong">
        <Icon name={icon} className="text-primary" />
        {title}
      </h3>
      <div className="flex flex-1 flex-col justify-center">{children}</div>
    </article>
  )
}

function Metric({
  value,
  prefix = '',
  suffix = '',
}: {
  value: number | null | undefined
  prefix?: string
  suffix?: string
}) {
  return (
    <p className="text-center text-2xl font-semibold text-foreground-strong">
      {value == null ? 'Indisponível' : `${prefix}${value.toLocaleString('pt-BR')}${suffix}`}
    </p>
  )
}

function RejectedState({ reason }: { reason?: string | null }) {
  return (
    <section className="rounded-xl border border-destructive/40 bg-destructive/5 p-5 text-center">
      <p className="text-sm text-foreground-strong">
        {reason || 'A participação foi rejeitada durante a validação.'}
      </p>
    </section>
  )
}

function rewardStatusLabel(status: ParticipationResult['rewardStatus']) {
  switch (status) {
    case 'pending':
      return 'Aguardando crédito na carteira'
    case 'credited':
      return 'Crédito confirmado'
    case 'rejected':
      return 'Recompensa rejeitada'
    default:
      return 'Status indisponível'
  }
}

function formatCents(value: number) {
  return (value / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function resultErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    if (error.status === 403) return 'Você não tem acesso ao resultado desta participação.'
    if (error.status === 404) return 'Esta participação ou resultado não foi encontrado.'
  }
  return 'O resultado está indisponível. Tente novamente.'
}
