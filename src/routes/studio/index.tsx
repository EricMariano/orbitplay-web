import { createFileRoute } from '@tanstack/react-router'
import { PageHeader } from '@/components/common/PageHeader'
import { QueryBoundary } from '@/components/common/QueryBoundary'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useGames } from '@/features/games/api/use-games'

export const Route = createFileRoute('/studio/')({
  component: StudioHome,
})

function StudioHome() {
  const games = useGames()

  return (
    <div>
      <PageHeader title="Início do Estúdio" />
      {/* Placeholder screen — real content lands once the API exists. The
          QueryBoundary drives loading/error/empty states end to end. */}
      <QueryBoundary query={games}>
        {(data) => (
          <Card className="bg-surface">
            <CardHeader>
              <CardTitle>Seus jogos</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted">
              {data.length} jogo(s) carregado(s).
            </CardContent>
          </Card>
        )}
      </QueryBoundary>
    </div>
  )
}
