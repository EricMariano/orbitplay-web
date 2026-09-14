import type { MyTestProgress } from '@/api-types'
import { EmptyState } from '@/components/common/EmptyState'
import { QueryBoundary } from '@/components/common/QueryBoundary'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useMyTests } from '@/features/tests/api/use-my-tests'
import { formatCurrency } from '@/lib/format'
import { GoToLink } from './GoToLink'

const actionLabel: Record<MyTestProgress['action'], string> = {
  start: 'Iniciar',
  continue: 'Continuar',
  complete: 'Completar',
}

export function MyTestsCard() {
  const tests = useMyTests()

  return (
    <Card className="bg-surface">
      <CardHeader>
        <CardTitle className="text-sm">Meus testes</CardTitle>
      </CardHeader>
      <CardContent>
        <QueryBoundary
          query={tests}
          emptyFallback={
            <EmptyState
              icon="tests"
              title="Nenhum teste por aqui"
              description="Os testes que você iniciar aparecem aqui."
            />
          }
        >
          {(data) => (
            <ul className="flex flex-col gap-4">
              {data.map((test) => (
                <li key={test.id} className="flex items-center gap-3">
                  <span className="w-28 shrink-0 truncate text-sm text-foreground">
                    {test.title}
                  </span>
                  <Progress value={test.progress} className="h-2 flex-1" />
                  <span className="w-10 shrink-0 text-right text-xs text-muted">
                    {test.progress}%
                  </span>
                  <span className="w-16 shrink-0 text-right text-xs text-success">
                    + {formatCurrency(test.reward)}
                  </span>
                  <Button
                    size="sm"
                    variant={test.action === 'complete' ? 'default' : 'secondary'}
                    className="shrink-0"
                  >
                    {actionLabel[test.action]}
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </QueryBoundary>
      </CardContent>
      <CardFooter className="justify-end">
        <GoToLink label="Ir para Meus testes" />
      </CardFooter>
    </Card>
  )
}
