import type { DashboardBlock } from '@/api-types'
import { BlockState } from '@/components/common/BlockState'
import { Icon } from '@/components/icon'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

/**
 * Card "Benchmark de mercado" (Tela 02). A fonte de dados do benchmark ainda
 * não foi definida no backend (pendência 7), que responde sempre
 * `unavailable` — o card mostra o estado do bloco, nunca um número inventado.
 */
export function BenchmarkCard({ block }: { block: DashboardBlock }) {
  return (
    <Card className="rounded-lg border border-white bg-stat-card-background py-4">
      <CardHeader className="px-4">
        <CardTitle className="text-sm font-medium text-stat-card-foreground">
          Benchmark de mercado
        </CardTitle>
        <CardAction>
          <Icon name="info" className="size-4 text-stat-card-muted" />
        </CardAction>
      </CardHeader>
      <CardContent className="px-4">
        <BlockState status={block.status === 'ready' ? 'unavailable' : block.status} />
      </CardContent>
    </Card>
  )
}
