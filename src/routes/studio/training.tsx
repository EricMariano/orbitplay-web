import { createFileRoute } from '@tanstack/react-router'
import { EmptyState } from '@/components/common/EmptyState'
import { QueryBoundary } from '@/components/common/QueryBoundary'
import { Badge } from '@/components/ui/badge'
import { useTestModels } from '@/features/tests/api/use-test-models'

export const Route = createFileRoute('/studio/training')({ component: StudioTrainingPage })

function StudioTrainingPage() {
  const models = useTestModels()
  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-10 font-brand">
      <header className="border-b border-primary/35 pb-6">
        <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
          Conhecimento de produto
        </p>
        <h1 className="mt-2 font-label text-3xl font-medium text-foreground-strong">
          Tutorial e formação
        </h1>
        <p className="mt-2 text-sm text-muted">
          Escolha o modelo de teste que melhor responde à pergunta do seu estúdio.
        </p>
      </header>
      <QueryBoundary
        query={models}
        emptyFallback={
          <EmptyState
            icon="graduation-cap"
            title="Nenhum modelo disponível"
            description="Os modelos liberados para sua organização aparecerão aqui."
          />
        }
      >
        {(items) => (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((model) => (
              <article key={model.key} className="rounded-xl border border-border bg-surface p-5">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-label text-lg text-foreground-strong">{model.name}</h2>
                  <Badge variant="outline">{model.key}</Badge>
                </div>
                <p className="mt-3 text-sm text-muted">
                  Use este modelo ao criar um teste para aplicar o questionário e os indicadores
                  compatíveis.
                </p>
              </article>
            ))}
          </div>
        )}
      </QueryBoundary>
    </div>
  )
}
