import { useState } from 'react'
import { toast } from 'sonner'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { Icon } from '@/components/icon'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  useJoinTest,
  useMyGameTests,
  usePlayerAchievements,
  usePlayerGameTests,
} from '@/features/games/api/use-player-game-details'
import type { PlayerAchievement } from '@/features/games/player-game-types'
import { gameDetailsErrorMessage } from '@/features/games/game-details-utils'
import { GameTestTable } from './GameTestTable'
import { GameTestDetails } from './GameTestDetails'
import { GameChat } from './GameChat'
import {
  GamePostsContent,
  GameReviewsContent,
  GameSpecsContent as SpecsContent,
} from '@/features/games/components/GameContent'

export type GameDetailsTab = 'available' | 'mine' | 'achievements' | 'community' | 'specs'

type GameDetailsTabsProps = {
  gameId: string
  value: GameDetailsTab
  onValueChange: (value: GameDetailsTab) => void
}

const tabs: { value: GameDetailsTab; label: string }[] = [
  { value: 'available', label: 'Testes disponíveis' },
  { value: 'mine', label: 'Meus testes' },
  { value: 'achievements', label: 'Conquistas' },
  { value: 'community', label: 'Comunidade' },
  { value: 'specs', label: 'Especificações' },
]

const tabSkeleton = (
  <div className="space-y-3 rounded-2xl border border-white/20 bg-white/10 p-5">
    <Skeleton className="h-12 w-full" />
    {Array.from({ length: 5 }).map((_, index) => (
      <Skeleton key={index} className="h-12 w-full" />
    ))}
  </div>
)

function queryMessage(error: unknown) {
  return gameDetailsErrorMessage(error)
}

function TestsContent({ gameId, mine = false }: { gameId: string; mine?: boolean }) {
  const available = usePlayerGameTests(gameId, !mine)
  const myTests = useMyGameTests(gameId, mine)
  const tests = mine ? myTests : available
  const joinTest = useJoinTest(gameId)
  const [selectedTest, setSelectedTest] = useState<string | null>(null)

  if (tests.isPending) return tabSkeleton
  if (tests.isError) {
    return <ErrorState message={queryMessage(tests.error)} onRetry={() => void tests.refetch()} />
  }

  const rows = tests.data.data
  if (rows.length === 0) {
    return (
      <EmptyState
        icon="tests"
        title={mine ? 'Você ainda não iniciou testes deste jogo' : 'Nenhum teste disponível'}
        description={
          mine
            ? 'Quando você entrar em um teste, ele aparecerá aqui.'
            : 'Novas oportunidades aparecerão aqui quando forem publicadas.'
        }
      />
    )
  }

  return (
    <div className="space-y-3">
      {joinTest.isError ? (
        <ErrorState
          className="py-5"
          title="Não foi possível entrar no teste"
          message={queryMessage(joinTest.error)}
        />
      ) : null}
      <GameTestTable
        tests={rows}
        mode={mine ? 'mine' : 'available'}
        joiningTestId={joinTest.isPending ? joinTest.variables : undefined}
        onJoin={(testId) =>
          joinTest.mutate(testId, {
            onSuccess: () => {
              toast.success('Vaga reservada.')
              setSelectedTest(testId)
            },
          })
        }
        onDetails={setSelectedTest}
      />
      <GameTestDetails testId={selectedTest} onClose={() => setSelectedTest(null)} />
    </div>
  )
}

function AchievementCard({
  achievement,
  unlocked,
}: {
  achievement: PlayerAchievement['achievement']
  unlocked: boolean
}) {
  return (
    <article className="flex min-h-24 items-center gap-4">
      <div
        className={
          unlocked
            ? 'flex size-24 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#248ff7] to-[#875af2] shadow-[0_0_12px_rgba(36,143,247,0.7)]'
            : 'relative flex size-24 shrink-0 items-center justify-center rounded-lg border border-white/20 bg-[#080321]'
        }
      >
        {!unlocked ? (
          <Icon name="lock" className="absolute top-2 left-2 size-5 text-[#585d68]" />
        ) : null}
        {achievement.iconUrl ? (
          <img src={achievement.iconUrl} alt="" className="size-12 object-contain" />
        ) : (
          <Icon
            name="trophy"
            className={unlocked ? 'size-12 text-white' : 'size-12 text-[#585d68]'}
          />
        )}
      </div>
      <div className="min-w-0">
        <h3 className={unlocked ? 'font-semibold text-white' : 'font-semibold text-white/55'}>
          {achievement.name}
        </h3>
        {achievement.description ? (
          <p className={unlocked ? 'text-sm text-white/75' : 'text-sm text-white/40'}>
            {achievement.description}
          </p>
        ) : null}
      </div>
    </article>
  )
}

/**
 * Conquistas do jogador (`GET /player/achievements`). No backend o catálogo de
 * conquistas é global — não existe conquista por jogo (`achievements` não tem
 * `game_id`), então a aba mostra as conquistas da conta, bloqueadas e
 * desbloqueadas.
 */
function AchievementsContent() {
  const player = usePlayerAchievements()

  if (player.isPending) return tabSkeleton
  if (player.isError) {
    return <ErrorState message={queryMessage(player.error)} onRetry={() => void player.refetch()} />
  }
  if (player.data.data.length === 0) {
    return (
      <EmptyState
        icon="trophy"
        title="Nenhuma conquista disponível"
        description="As conquistas da sua conta aparecerão aqui."
      />
    )
  }

  return (
    <div className="grid grid-cols-2 gap-x-14 gap-y-5 xl:grid-cols-4">
      {player.data.data.map((item) => (
        <AchievementCard
          key={item.achievement.key}
          achievement={item.achievement}
          unlocked={item.unlocked}
        />
      ))}
    </div>
  )
}

function CommunityFeedContent({ gameId }: { gameId: string }) {
  return (
    <div className="grid gap-10 xl:grid-cols-2">
      <GamePostsContent gameId={gameId} />
      <GameReviewsContent gameId={gameId} />
    </div>
  )
}

function CommunityContent({ gameId }: { gameId: string }) {
  return (
    <Tabs defaultValue="chat" className="gap-4">
      <TabsList aria-label="Visões da comunidade" className="w-fit bg-white/10">
        <TabsTrigger value="chat">Chat</TabsTrigger>
        <TabsTrigger value="posts">Publicações e avaliações</TabsTrigger>
      </TabsList>
      <TabsContent value="chat">
        <GameChat gameId={gameId} />
      </TabsContent>
      <TabsContent value="posts">
        <CommunityFeedContent gameId={gameId} />
      </TabsContent>
    </Tabs>
  )
}

export function GameDetailsTabs({ gameId, value, onValueChange }: GameDetailsTabsProps) {
  return (
    <Tabs
      value={value}
      onValueChange={(nextValue) => onValueChange(nextValue as GameDetailsTab)}
      className="gap-0"
    >
      <TabsList
        variant="line"
        aria-label="Informações do jogo"
        className="h-[50px] w-full justify-start gap-0 border-b border-white/70 p-0"
      >
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="h-[50px] flex-none rounded-none px-3 text-base font-normal text-white/70 after:bottom-[-1px] after:h-0.5 after:bg-[#248ff7] data-[state=active]:font-semibold data-[state=active]:text-[#248ff7]"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      <div className="pt-5">
        <TabsContent value="available">
          <TestsContent gameId={gameId} />
        </TabsContent>
        <TabsContent value="mine">
          <TestsContent gameId={gameId} mine />
        </TabsContent>
        <TabsContent value="achievements">
          <AchievementsContent />
        </TabsContent>
        <TabsContent value="community">
          <CommunityContent gameId={gameId} />
        </TabsContent>
        <TabsContent value="specs">
          <SpecsContent gameId={gameId} />
        </TabsContent>
      </div>
    </Tabs>
  )
}
