import type { BlockStatus } from '@/api-types'
import { EmptyState } from '@/components/common/EmptyState'
import type { IconName } from '@/components/icon'

const stateByStatus: Record<
  Exclude<BlockStatus, 'ready'>,
  { icon: IconName; title: string; description: string }
> = {
  processing: {
    icon: 'loader',
    title: 'Calculando…',
    description: 'Este bloco ainda está sendo processado. Volte em instantes.',
  },
  failed: {
    icon: 'alert',
    title: 'Não foi possível calcular',
    description: 'O cálculo deste bloco falhou. O restante da tela segue disponível.',
  },
  unavailable: {
    icon: 'empty',
    title: 'Indisponível',
    description: 'Ainda não há dados suficientes para este bloco.',
  },
}

/**
 * Estado de um bloco calculado de forma assíncrona (dashboard, relatórios)
 * que não está `ready`. Um bloco com falha nunca derruba a tela inteira.
 */
export function BlockState({ status }: { status: Exclude<BlockStatus, 'ready'> }) {
  const state = stateByStatus[status]
  return <EmptyState icon={state.icon} title={state.title} description={state.description} />
}
