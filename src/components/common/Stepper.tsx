import { Icon } from '@/components/icon'
import { cn } from '@/lib/utils'

type StepperProps = {
  steps: string[]
  currentStep: number // 0-indexed
}

/** Indicador de progresso em etapas (fluxos tipo wizard). Não conhece o conteúdo de cada etapa. */
export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-3">
        {steps.map((label, index) => (
          <div key={label} className="flex items-center gap-3">
            <div className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  'flex size-9 items-center justify-center rounded-full border-2',
                  index < currentStep && 'border-primary bg-primary text-primary-foreground',
                  index === currentStep && 'border-primary text-primary',
                  index > currentStep && 'border-dashed border-muted text-muted',
                )}
              >
                {index < currentStep ? <Icon name="check" className="size-4" /> : index + 1}
              </div>
              <span
                className={cn('text-sm', index === currentStep ? 'text-primary' : 'text-muted')}
              >
                {label}
              </span>
            </div>
            {index < steps.length - 1 ? (
              <div className={cn('h-px w-16', index < currentStep ? 'bg-primary' : 'bg-muted')} />
            ) : null}
          </div>
        ))}
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/30">
        <div
          className="h-full bg-primary transition-all"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />
      </div>
    </div>
  )
}
