import type { ReactNode } from 'react'
import { EmptyState } from '@/components/common/EmptyState'
import { PageHeader, type Breadcrumb } from '@/components/common/PageHeader'
import { QueryBoundary } from '@/components/common/QueryBoundary'
import { useOpportunities } from '@/features/opportunities/api/use-opportunities'
import { OpportunitiesGrid } from './OpportunitiesGrid'
import { OpportunitiesSummaryStats } from './OpportunitiesSummaryStats'

type OpportunitiesLibraryScreenProps = {
  title: string
  breadcrumbs?: Breadcrumb[]
  emptyTitle: string
  emptyDescription: string
  emptyAction?: ReactNode
  showSummary?: boolean
  showRequestAccess?: boolean
}

/**
 * Shared composer for the player's opportunity/library grids. Home and
 * "Meus jogos" only change chrome; data still comes from `useOpportunities`.
 */
export function OpportunitiesLibraryScreen({
  title,
  breadcrumbs,
  emptyTitle,
  emptyDescription,
  emptyAction,
  showSummary = true,
  showRequestAccess = true,
}: OpportunitiesLibraryScreenProps) {
  const opportunities = useOpportunities()

  return (
    <div>
      <PageHeader title={title} breadcrumbs={breadcrumbs} />
      <QueryBoundary
        query={opportunities}
        emptyFallback={
          <EmptyState
            icon="opportunities"
            title={emptyTitle}
            description={emptyDescription}
            action={emptyAction}
          />
        }
      >
        {(data) => (
          <>
            {showSummary ? <OpportunitiesSummaryStats opportunities={data} /> : null}
            <OpportunitiesGrid opportunities={data} showRequestAccess={showRequestAccess} />
          </>
        )}
      </QueryBoundary>
    </div>
  )
}
