import { createFileRoute } from '@tanstack/react-router'
import { EmptyState } from '@/components/common/EmptyState'
import { PageHeader } from '@/components/common/PageHeader'
import { QueryBoundary } from '@/components/common/QueryBoundary'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PlayerGameCard } from '@/features/games/components/PlayerGameCard'
import { usePlayerCatalog, usePlayerLibrary } from '@/features/player/api/use-player-library'

export const Route = createFileRoute('/player/games/')({ component: PlayerLibrary })

function PlayerLibrary() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Jogos"
        breadcrumbs={[{ label: 'Início', href: '/player' }, { label: 'Jogos' }]}
      />
      <Tabs defaultValue="mine">
        <TabsList aria-label="Biblioteca de jogos">
          <TabsTrigger value="mine">Meus jogos</TabsTrigger>
          <TabsTrigger value="explore">Explorar jogos</TabsTrigger>
        </TabsList>
        <TabsContent value="mine">
          <MyGames />
        </TabsContent>
        <TabsContent value="explore">
          <ExploreGames />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function MyGames() {
  const games = usePlayerLibrary()
  return (
    <QueryBoundary
      query={games}
      emptyFallback={
        <EmptyState
          icon="games"
          title="Nenhum jogo em teste"
          description="Encontre novos títulos na aba Explorar jogos e participe de um teste para adicioná-los à sua biblioteca."
        />
      }
    >
      {(data) => (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {data.map((game) => (
            <PlayerGameCard key={game.id} game={game} />
          ))}
        </div>
      )}
    </QueryBoundary>
  )
}

function ExploreGames() {
  const games = usePlayerCatalog()
  return (
    <QueryBoundary
      query={games}
      emptyFallback={
        <EmptyState
          icon="games"
          title="Nenhum jogo disponível"
          description="Volte em breve para novas oportunidades de teste."
        />
      }
    >
      {(data) => (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {data.map((game) => (
            <PlayerGameCard key={game.id} game={game} />
          ))}
        </div>
      )}
    </QueryBoundary>
  )
}
