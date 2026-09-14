import type { UseQueryResult } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { ApiError } from '@/lib/api-client'
import { Skeleton } from '@/components/ui/skeleton'

type QueryBoundaryProps<T> = {
  query: UseQueryResult<T>
  children: (data: NonNullable<T>) => ReactNode
  /** Return true when `data` should render the empty state instead of children. */
  isEmpty?: (data: T) => boolean
  loadingFallback?: ReactNode
  emptyFallback?: ReactNode
}

const defaultSkeleton = (
  <div className="space-y-3" aria-busy="true" aria-live="polite">
    <Skeleton className="h-8 w-1/3" />
    <Skeleton className="h-24 w-full" />
    <Skeleton className="h-24 w-full" />
  </div>
)

/**
 * Resolves the four mandatory data states (loading / error / empty / ready) in
 * one place so no screen has to reimplement them (handoff requirement).
 */
export function QueryBoundary<T>({
  query,
  children,
  isEmpty,
  loadingFallback,
  emptyFallback,
}: QueryBoundaryProps<T>) {
  if (query.isPending) {
    return <>{loadingFallback ?? defaultSkeleton}</>
  }

  if (query.isError) {
    const message = query.error instanceof ApiError ? query.error.message : undefined
    return <ErrorState message={message} onRetry={() => void query.refetch()} />
  }

  const data = query.data
  const empty = isEmpty?.(data) ?? (Array.isArray(data) ? data.length === 0 : data == null)
  if (empty) {
    return <>{emptyFallback ?? <EmptyState title="Nada por aqui ainda" />}</>
  }

  return <>{children(data as NonNullable<T>)}</>
}
