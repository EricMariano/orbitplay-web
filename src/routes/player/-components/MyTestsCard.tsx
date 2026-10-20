import { Link } from '@tanstack/react-router'
import type { PlayerHome } from '@/api-types'
import { EmptyState } from '@/components/common/EmptyState'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { formatCents } from '@/lib/format'

type MyTestsCardProps = {
  tests: PlayerHome['tests']
}

const statusLabel: Record<PlayerHome['tests'][number]['status'], string> = {
  reserved: 'Aguardando início',
  tutorial: 'Tutorial',
  downloading: 'Preparando build',
  ready: 'Pronto para jogar',
  playing: 'Em andamento',
  form_pending: 'Avaliação pendente',
  in_review: 'Em análise',
  completed: 'Concluído',
  rejected: 'Não validado',
  abandoned: 'Não concluído',
}

export function MyTestsCard({ tests }: MyTestsCardProps) {
  return (
    <Card className="bg-surface">
      <CardHeader>
        <CardTitle className="text-sm">Meus testes</CardTitle>
      </CardHeader>
      <CardContent>
        {tests.length === 0 ? (
          <EmptyState
            icon="tests"
            title="Nenhum teste por aqui"
            description="Os testes que você iniciar aparecem aqui."
          />
        ) : (
          <ul className="flex flex-col gap-4">
            {tests.map((test) => {
              const isResult = ['completed', 'rejected', 'abandoned'].includes(test.status)
              return (
                <li key={test.participationId} className="flex items-center gap-3">
                  <div className="w-28 shrink-0">
                    <p className="truncate text-sm text-foreground">{test.title}</p>
                    <p className="truncate text-xs text-muted">{statusLabel[test.status]}</p>
                  </div>
                  <Progress value={test.progress} className="h-2 flex-1" />
                  <span className="w-10 shrink-0 text-right text-xs text-muted">
                    {test.progress}%
                  </span>
                  {test.rewardCents != null ? (
                    <span className="w-20 shrink-0 text-right text-xs text-success">
                      + {formatCents(test.rewardCents)}
                    </span>
                  ) : null}
                  <Button asChild size="sm" variant="secondary" className="shrink-0">
                    {isResult ? (
                      <Link
                        to="/player/participations/$participationId/result"
                        params={{ participationId: test.participationId }}
                      >
                        Ver resultado
                      </Link>
                    ) : (
                      <Link to="/player/tests/$testId/tutorial" params={{ testId: test.testId }}>
                        Continuar
                      </Link>
                    )}
                  </Button>
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted">
        Mostrando suas quatro participações mais recentes.
      </CardFooter>
    </Card>
  )
}
