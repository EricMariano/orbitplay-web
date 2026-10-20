import { Link } from '@tanstack/react-router'
import type { PlayerHome } from '@/api-types'
import { EmptyState } from '@/components/common/EmptyState'
import { Icon } from '@/components/icon'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { formatCents, formatCountdown } from '@/lib/format'
import { SectionHeader } from './SectionHeader'

type ContinueTestSectionProps = {
  test: PlayerHome['continuing']
}

const statusLabel: Record<NonNullable<PlayerHome['continuing']>['status'], string> = {
  reserved: 'Pronto para começar',
  tutorial: 'Tutorial em andamento',
  downloading: 'Preparando a build',
  ready: 'Pronto para jogar',
  playing: 'Sessão em andamento',
  form_pending: 'Avaliação pendente',
  in_review: 'Em análise',
  completed: 'Concluído',
  rejected: 'Sessão não validada',
  abandoned: 'Não concluído',
}

export function ContinueTestSection({ test }: ContinueTestSectionProps) {
  return (
    <section>
      <SectionHeader title="Continue seu teste" />
      {!test ? (
        <EmptyState
          icon="tests"
          title="Nenhum teste em andamento"
          description="Comece um teste nos destaques abaixo para continuá-lo por aqui."
        />
      ) : (
        <div className="grid overflow-hidden rounded-xl border border-border bg-surface sm:grid-cols-[280px_1fr]">
          <div className="relative h-44 sm:h-full">
            {test.coverUrl ? (
              <img src={test.coverUrl} alt="" className="size-full object-cover" />
            ) : (
              <div className="flex size-full items-center justify-center bg-surface-raised">
                <Icon name="games" className="size-10 text-muted" />
              </div>
            )}
            {test.endsAt && formatCountdown(test.endsAt) ? (
              <span className="absolute top-3 left-3 rounded-full bg-background/80 px-2 py-1 text-xs text-foreground">
                Termina em {formatCountdown(test.endsAt)}
              </span>
            ) : null}
          </div>
          <div className="flex flex-col gap-4 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-foreground">{test.title}</h3>
                <p className="mt-1 text-sm text-muted">{statusLabel[test.status]}</p>
              </div>
              {test.rewardCents != null ? (
                <span className="text-sm font-medium text-success">
                  + {formatCents(test.rewardCents)}
                </span>
              ) : null}
            </div>
            <div className="flex items-center gap-3">
              <Progress value={test.progress} className="h-2 flex-1" />
              <span className="text-sm text-muted">{test.progress}%</span>
            </div>
            <Button asChild size="lg" className="mt-auto self-start">
              <Link to="/player/tests/$testId/tutorial" params={{ testId: test.testId }}>
                Continuar
              </Link>
            </Button>
          </div>
        </div>
      )}
    </section>
  )
}
