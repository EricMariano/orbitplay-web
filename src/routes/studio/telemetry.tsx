import { createFileRoute } from '@tanstack/react-router'
import { QueryBoundary } from '@/components/common/QueryBoundary'
import { DashboardTelemetryCard } from '@/features/dashboard/components/DashboardTelemetryCard'
import { useStudioDashboard } from '@/features/dashboard/api/use-studio-dashboard'

export const Route = createFileRoute('/studio/telemetry')({ component: StudioTelemetryPage })

function StudioTelemetryPage() {
  const dashboard = useStudioDashboard()
  return (
    <QueryBoundary query={dashboard}>
      {(data) => (
        <div className="mx-auto max-w-5xl space-y-6 pb-10 font-brand">
          <header className="border-b border-primary/35 pb-6">
            <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
              Dados de testes
            </p>
            <h1 className="mt-2 font-label text-3xl font-medium text-foreground-strong">
              Plug-in de telemetria
            </h1>
            <p className="mt-2 text-sm text-muted">
              Acompanhe os testes que já receberam dados de telemetria.
            </p>
          </header>
          <DashboardTelemetryCard tests={data.recentTests} />
        </div>
      )}
    </QueryBoundary>
  )
}
