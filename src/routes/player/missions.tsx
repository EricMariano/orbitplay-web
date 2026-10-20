import { createFileRoute } from '@tanstack/react-router'
import { MissionsRankingCard } from './-components/MissionsRankingCard'

export const Route = createFileRoute('/player/missions')({ component: PlayerMissionsPage })

function PlayerMissionsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 font-login-body">
      <header>
        <p className="text-sm text-white/55">Progresso da comunidade</p>
        <h1 className="mt-1 font-login-display text-3xl">Missões e ranking</h1>
      </header>
      <MissionsRankingCard />
    </div>
  )
}
