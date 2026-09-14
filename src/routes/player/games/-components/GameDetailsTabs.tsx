import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { Icon } from '@/components/icon'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  useGameAchievements,
  useGameCommunity,
  useGameReviews,
  useGameSpecs,
  useJoinTest,
  useMyGameTests,
  usePlayerAchievements,
  usePlayerGameTests,
} from '@/features/games/api/use-player-game-details'
import type { Achievement } from '@/features/games/player-game-types'
import { gameDetailsErrorMessage } from '@/features/games/game-details-utils'
import { GameTestTable } from './GameTestTable'
import { GameTestDetails } from './GameTestDetails'

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
  achievement: Achievement
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

function AchievementsContent({ gameId }: { gameId: string }) {
  const configured = useGameAchievements(gameId)
  const player = usePlayerAchievements()

  const unlockedByKey = useMemo(
    () => new Map(player.data?.data.map((item) => [item.achievement.key, item.unlocked])),
    [player.data],
  )

  if (configured.isPending || player.isPending) return tabSkeleton
  if (configured.isError || player.isError) {
    const failed = configured.isError ? configured : player
    return (
      <ErrorState
        message={queryMessage(failed.error)}
        onRetry={() => {
          void configured.refetch()
          void player.refetch()
        }}
      />
    )
  }
  if (configured.data.data.length === 0) {
    return (
      <EmptyState
        icon="trophy"
        title="Nenhuma conquista configurada"
        description="As conquistas deste jogo aparecerão aqui."
      />
    )
  }

  return (
    <div className="grid grid-cols-2 gap-x-14 gap-y-5 xl:grid-cols-4">
      {configured.data.data.map((achievement) => (
        <AchievementCard
          key={achievement.key}
          achievement={achievement}
          unlocked={unlockedByKey.get(achievement.key) ?? false}
        />
      ))}
    </div>
  )
}

function CommunityContent({ gameId }: { gameId: string }) {
  const posts = useGameCommunity(gameId)
  const reviews = useGameReviews(gameId)

  if (posts.isPending || reviews.isPending) return tabSkeleton
  if (posts.isError || reviews.isError) {
    const failed = posts.isError ? posts : reviews
    return (
      <ErrorState
        message={queryMessage(failed.error)}
        onRetry={() => {
          void posts.refetch()
          void reviews.refetch()
        }}
      />
    )
  }
  if (posts.data.data.length === 0 && reviews.data.data.length === 0) {
    return (
      <EmptyState
        icon="users"
        title="A comunidade ainda está em silêncio"
        description="Publicações e avaliações deste jogo aparecerão aqui."
      />
    )
  }

  return (
    <div className="grid gap-10 xl:grid-cols-2">
      <section aria-labelledby="community-posts-title">
        <h2 id="community-posts-title" className="mb-4 text-lg font-semibold">
          Publicações
        </h2>
        <div className="space-y-3">
          {posts.data.data.map((post) => (
            <article key={post.id} className="rounded-lg border border-white/20 bg-white/10 p-4">
              <div className="mb-2 flex items-center justify-between gap-4">
                <strong className="text-sm">{post.authorDisplayName}</strong>
                {post.status === 'pinned' ? <Badge className="bg-primary">Fixado</Badge> : null}
              </div>
              <p className="text-sm leading-6 text-white/75">{post.body}</p>
            </article>
          ))}
        </div>
      </section>
      <section aria-labelledby="community-reviews-title">
        <div className="mb-4 flex items-center gap-3">
          <h2 id="community-reviews-title" className="text-lg font-semibold">
            Avaliações
          </h2>
          {reviews.data.averageRating != null ? (
            <span className="flex items-center gap-1 text-sm text-[#ffd52e]">
              <Icon name="star" className="fill-current" />
              {reviews.data.averageRating.toFixed(1)}
            </span>
          ) : null}
        </div>
        <div className="space-y-3">
          {reviews.data.data.map((review) => (
            <article key={review.id} className="rounded-lg border border-white/20 bg-white/10 p-4">
              <div className="mb-2 flex items-center justify-between gap-4">
                <strong className="text-sm">{review.authorDisplayName}</strong>
                <span className="flex items-center gap-1 text-sm text-[#ffd52e]">
                  <Icon name="star" className="fill-current" />
                  {review.rating}
                </span>
              </div>
              {review.body ? (
                <p className="text-sm leading-6 text-white/75">{review.body}</p>
              ) : null}
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

const platformLabels: Record<string, string> = {
  windows: 'Windows',
  macos: 'macOS',
  linux: 'Linux',
  android: 'Android',
  ios: 'iOS',
  web: 'Web',
}

function RequirementList({ title, values }: { title: string; values?: Record<string, string> }) {
  return (
    <section>
      <h2 className="mb-4 text-lg font-semibold">{title}</h2>
      {values && Object.keys(values).length > 0 ? (
        <dl className="divide-y divide-white/10 rounded-lg border border-white/20 bg-white/10 px-5">
          {Object.entries(values).map(([label, value]) => (
            <div key={label} className="grid grid-cols-[minmax(140px,0.45fr)_1fr] gap-6 py-4">
              <dt className="text-sm text-white/55">{label}</dt>
              <dd className="text-sm text-white/90">{value}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="text-sm text-white/55">Não informado.</p>
      )}
    </section>
  )
}

function SpecsContent({ gameId }: { gameId: string }) {
  const specs = useGameSpecs(gameId)
  if (specs.isPending) return tabSkeleton
  if (specs.isError) {
    return <ErrorState message={queryMessage(specs.error)} onRetry={() => void specs.refetch()} />
  }

  const hasContent =
    Object.keys(specs.data.minimumRequirements ?? {}).length > 0 ||
    Object.keys(specs.data.recommendedRequirements ?? {}).length > 0 ||
    (specs.data.supportedPlatforms?.length ?? 0) > 0 ||
    (specs.data.languages?.length ?? 0) > 0

  if (!hasContent) {
    return (
      <EmptyState
        icon="monitor"
        title="Especificações não informadas"
        description="Os requisitos técnicos deste jogo aparecerão aqui."
      />
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-10 xl:grid-cols-2">
        <RequirementList title="Requisitos mínimos" values={specs.data.minimumRequirements} />
        <RequirementList
          title="Requisitos recomendados"
          values={specs.data.recommendedRequirements}
        />
      </div>
      <div className="flex flex-wrap gap-8 border-t border-white/20 pt-6">
        <div>
          <h2 className="mb-3 text-sm font-semibold">Plataformas</h2>
          <div className="flex flex-wrap gap-2">
            {specs.data.supportedPlatforms?.map((platform) => (
              <Badge key={platform} variant="secondary">
                {platformLabels[platform] ?? platform}
              </Badge>
            ))}
          </div>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-semibold">Idiomas</h2>
          <p className="text-sm text-white/70">
            {specs.data.languages?.join(', ') || 'Não informado'}
          </p>
        </div>
      </div>
    </div>
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
          <AchievementsContent gameId={gameId} />
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
