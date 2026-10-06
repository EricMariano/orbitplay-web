import { createFileRoute } from '@tanstack/react-router'
import { DashboardPlaceholder } from '@/components/common/DashboardPlaceholder'
import { MissionsRankingCard } from './-components/MissionsRankingCard'
import { SectionHeader } from './-components/SectionHeader'
import { WelcomeHeader } from './-components/WelcomeHeader'

export const Route = createFileRoute('/player/')({
  component: PlayerHome,
})

// "Continue seu teste", destaques, ganhos e meus testes dependem de
// /tests/continue, /games/highlighted, /earnings/summary e /tests/mine, que a
// API ainda não expõe. Ficam como placeholder (sem mock); os componentes e
// hooks já existem em ./-components e features/.
function PlayerHome() {
  return (
    <div className="flex flex-col gap-8">
      <WelcomeHeader />
      <section>
        <SectionHeader title="Continue seu teste" />
        <DashboardPlaceholder title="Teste em andamento" />
      </section>
      <section>
        <SectionHeader title="Destaques para você" />
        <DashboardPlaceholder title="Jogos em destaque" />
      </section>
      <section>
        <SectionHeader title="Estatísticas" />
        <div className="flex flex-col gap-4">
          <DashboardPlaceholder title="Resumo de ganhos" />
          <div className="grid gap-4 lg:grid-cols-2">
            <MissionsRankingCard />
            <DashboardPlaceholder title="Meus testes" />
          </div>
        </div>
      </section>
    </div>
  )
}
