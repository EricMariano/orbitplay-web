import { Link } from '@tanstack/react-router'
import type { TestModel } from '@/api-types'
import { EmptyState } from '@/components/common/EmptyState'
import { PageHeader } from '@/components/common/PageHeader'
import { QueryBoundary } from '@/components/common/QueryBoundary'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useTestModels } from '@/features/tests/api/use-test-models'

function TestModelCard({ model }: { model: TestModel }) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-1 px-4 py-4">
        <p className="text-sm font-medium text-foreground">{model.name}</p>
        {model.description ? <p className="text-xs text-muted">{model.description}</p> : null}
      </CardContent>
    </Card>
  )
}

/**
 * Studio "Testes" screen — lists reusable test models from GET /test-models.
 */
export function TestModelsScreen() {
  const models = useTestModels()

  return (
    <div>
      <PageHeader
        title="Testes"
        breadcrumbs={[{ label: 'Painel', to: '/studio' }, { label: 'Testes' }]}
      />
      <QueryBoundary
        query={models}
        emptyFallback={
          <EmptyState
            icon="tests"
            title="Nenhum modelo de teste"
            description="Quando a API listar modelos, eles aparecerão aqui para vincular aos jogos da biblioteca."
            action={
              <Button asChild size="sm" variant="outline">
                <Link to="/studio/games">Ir para jogos</Link>
              </Button>
            }
          />
        }
      >
        {(data) => (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-5">
            {data.map((model) => (
              <TestModelCard key={model.id} model={model} />
            ))}
          </div>
        )}
      </QueryBoundary>
    </div>
  )
}
