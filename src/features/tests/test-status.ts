import type { TestStatus } from '@/api-types'

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
