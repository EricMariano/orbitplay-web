import { createFileRoute } from '@tanstack/react-router'
import { QueryBoundary } from '@/components/common/QueryBoundary'
import { Skeleton } from '@/components/ui/skeleton'
import { useStudioBenchmark } from '@/features/dashboard/api/use-studio-benchmark'
import { BenchmarkCard } from '@/features/dashboard/components/BenchmarkCard'

export const Route = createFileRoute('/studio/benchmark')({ component: StudioBenchmarkPage })

function StudioBenchmarkPage() {
  const benchmark = useStudioBenchmark()
  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-10 font-brand">
      <header className="border-b border-primary/35 pb-6">
        <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">Seus jogos</p>
        <h1 className="mt-2 font-label text-3xl font-medium text-foreground-strong">Benchmark</h1>
        <p className="mt-2 text-sm text-muted">Compare os indicadores dos jogos deste estúdio.</p>
      </header>
      <QueryBoundary
        query={benchmark}
        isEmpty={() => false}
        loadingFallback={<Skeleton className="h-80 w-full" />}
      >
        {(data) => (
          <BenchmarkCard
            pages={data.pages}
            hasNextPage={benchmark.hasNextPage}
            isFetchingNextPage={benchmark.isFetchingNextPage}
            onLoadMore={() => void benchmark.fetchNextPage()}
            onRetry={() => void benchmark.refetch()}
          />
        )}
      </QueryBoundary>
    </div>
  )
}
