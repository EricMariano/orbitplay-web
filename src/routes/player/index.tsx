import { createFileRoute } from '@tanstack/react-router'
import { QueryBoundary } from '@/components/common/QueryBoundary'
import { usePlayerHome } from '@/features/player/api/use-player-home'
import { ContinueTestSection } from './-components/ContinueTestSection'
import { EarningsSummaryCard } from './-components/EarningsSummaryCard'
import { HighlightedGamesSection } from './-components/HighlightedGamesSection'
import { MissionsRankingCard } from './-components/MissionsRankingCard'
import { MyTestsCard } from './-components/MyTestsCard'
import { SectionHeader } from './-components/SectionHeader'
import { WelcomeHeader } from './-components/WelcomeHeader'

export const Route = createFileRoute('/player/')({
  component: PlayerHome,
})

function PlayerHome() {
  const home = usePlayerHome()

  return (
    <QueryBoundary query={home}>
      {(data) => (
        <div className="flex flex-col gap-8">
          <WelcomeHeader />
          <ContinueTestSection test={data.continuing} />
          <HighlightedGamesSection />
          <section>
            <SectionHeader title="Estatísticas" />
            <div className="flex flex-col gap-4">
              <EarningsSummaryCard earnings={data.earnings} />
              <div className="grid gap-4 lg:grid-cols-2">
                <MissionsRankingCard />
                <MyTestsCard tests={data.tests} />
              </div>
            </div>
          </section>
        </div>
      )}
    </QueryBoundary>
  )
}
