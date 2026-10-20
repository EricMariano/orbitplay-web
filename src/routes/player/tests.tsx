import { createFileRoute } from '@tanstack/react-router'
import { QueryBoundary } from '@/components/common/QueryBoundary'
import { usePlayerHome } from '@/features/player/api/use-player-home'
import { EarningsSummaryCard } from './-components/EarningsSummaryCard'
import { MyTestsCard } from './-components/MyTestsCard'

export const Route = createFileRoute('/player/tests')({ component: PlayerTestsPage })

function PlayerTestsPage() {
  const home = usePlayerHome()
  return (
    <QueryBoundary query={home}>
      {(data) => (
        <div className="mx-auto max-w-5xl space-y-6 font-login-body">
          <header>
            <p className="text-sm text-white/55">Seu histórico</p>
            <h1 className="mt-1 font-login-display text-3xl">Meus testes e ganhos</h1>
          </header>
          <EarningsSummaryCard earnings={data.earnings} />
          <MyTestsCard tests={data.tests} />
        </div>
      )}
    </QueryBoundary>
  )
}
