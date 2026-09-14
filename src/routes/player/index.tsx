import { createFileRoute } from '@tanstack/react-router'
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
  return (
    <div className="flex flex-col gap-8">
      <WelcomeHeader />
      <ContinueTestSection />
      <HighlightedGamesSection />
      <section>
        <SectionHeader title="Estatísticas" />
        <div className="flex flex-col gap-4">
          <EarningsSummaryCard />
          <div className="grid gap-4 lg:grid-cols-2">
            <MissionsRankingCard />
            <MyTestsCard />
          </div>
        </div>
      </section>
    </div>
  )
}
