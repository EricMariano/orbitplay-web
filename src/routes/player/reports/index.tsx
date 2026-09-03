import { createFileRoute } from '@tanstack/react-router'
import { ReportsScreen } from '@/features/reports/components/ReportsScreen'
import { parseReportSearch } from '@/features/reports/lib/report-search'

export const Route = createFileRoute('/player/reports/')({
  validateSearch: parseReportSearch,
  component: PlayerReportsRoute,
})

function PlayerReportsRoute() {
  const { testId } = Route.useSearch()
  return <ReportsScreen audience="player" testId={testId} />
}
