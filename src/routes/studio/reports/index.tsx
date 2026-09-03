import { createFileRoute } from '@tanstack/react-router'
import { ReportsScreen } from '@/features/reports/components/ReportsScreen'
import { parseReportSearch } from '@/features/reports/lib/report-search'

export const Route = createFileRoute('/studio/reports/')({
  validateSearch: parseReportSearch,
  component: StudioReportsRoute,
})

function StudioReportsRoute() {
  const { testId } = Route.useSearch()
  return <ReportsScreen audience="studio" testId={testId} />
}
