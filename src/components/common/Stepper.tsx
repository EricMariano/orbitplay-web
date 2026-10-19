import { Icon } from '@/components/icon'
import { cn } from '@/lib/utils'

type StepperProps = {
  steps: string[]
  currentStep: number // 0-indexed
}

/** Indicador de progresso em etapas (fluxos tipo wizard). Não conhece o conteúdo de cada etapa. */
export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="space-y-6">
      <ol className="mx-auto flex w-full max-w-[560px] items-start">
        {steps.map((label, index) => {
          const isDone = index < currentStep
          const isCurrent = index === currentStep
          return (
            <li
              key={label}
              aria-current={isCurrent ? 'step' : undefined}
              className="flex flex-1 flex-col items-center gap-1"
            >
              <div className="flex w-full items-center gap-3">
                <StepLine hidden={index === 0} done={index <= currentStep} />
                <div
                  className={cn(
                    'flex size-8 shrink-0 items-center justify-center rounded-full text-foreground-strong',
                    isDone && 'bg-success',
                    isCurrent && 'bg-primary',
                    !isDone && !isCurrent && 'border-2 border-dashed border-foreground',
                  )}
                >
                  {isDone ? <Icon name="check" className="size-5" /> : null}
                  {isCurrent ? <Icon name="edit" className="size-4" /> : null}
                </div>
                <StepLine hidden={index === steps.length - 1} done={index < currentStep} />
              </div>
              <span
                className={cn(
                  'text-center text-base',
                  isDone && 'font-bold text-success',
                  isCurrent && 'font-bold text-primary',
                  !isDone && !isCurrent && 'text-foreground',
                )}
              >
                {label}
              </span>
            </li>
          )
        })}
      </ol>

      <div className="h-1.5 w-full overflow-hidden bg-muted-foreground">
        <div
          className="h-full bg-gradient-to-r from-cta-configure-from to-cta-configure-to transition-all"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />
      </div>
    </div>
  )
}

function StepLine({ hidden, done }: { hidden: boolean; done: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        'h-[3px] flex-1 rounded-full',
        done ? 'bg-success' : 'bg-foreground',
        hidden && 'invisible',
      )}
    />
  )
}
