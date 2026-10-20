import type { TestStatus, Test } from '@/api-types'

/** O modelo escolhido não confirma a presença do plug-in: a validação da build confirma. */
export function pluginStatusView(build: Test['build']) {
  const status = build?.validationSteps.find((step) => step.key === 'plugin_manifest')?.status
  if (status === 'ready') return { label: 'Sim', className: 'text-success' }
  if (status === 'unavailable') return { label: 'Não', className: 'text-muted' }
  return { label: 'Não confirmado', className: 'text-muted' }
}

export const testStatusConfig: Record<TestStatus, { label: string; className: string }> = {
  draft: {
    label: 'Rascunho',
    className: 'bg-tint-olive-background text-tint-olive-foreground',
  },
  published: {
    label: 'Em andamento',
    className: 'bg-tint-warning-background text-tint-warning-foreground',
  },
  paused: {
    label: 'Pausado',
    className: 'bg-tint-info-background text-tint-info-foreground',
  },
  finished: {
    label: 'Finalizado',
    className: 'bg-tint-success-background text-tint-success-foreground',
  },
  expired: {
    label: 'Expirado',
    className: 'bg-tint-danger-background text-tint-danger-foreground',
  },
}
