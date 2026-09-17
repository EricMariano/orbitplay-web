import { Icon, type IconName } from '@/components/icon'
import { cn } from '@/lib/utils'
import type { TestModelOption } from '../types'

const iconByKey: Record<TestModelOption['key'], IconName> = {
  free_exploration_telemetry: 'plug',
  free_exploration: 'compass',
  ab_test: 'ab-test',
  ab_test_images: 'ab-test-images',
}

function formatPrice(cents: number) {
  return (cents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })
}

type TestModelCardProps = {
  model: TestModelOption
  isRecommended?: boolean
  selected: boolean
  onSelect: () => void
}

export function TestModelCard({ model, isRecommended, selected, onSelect }: TestModelCardProps) {
  const disabled = !model.available

  return (
    <div className="relative h-full">
      {isRecommended ? (
        <span className="absolute -top-6 left-0 text-sm font-semibold text-highlight italic">
          Recomendado!
        </span>
      ) : null}

      <button
        type="button"
        disabled={disabled}
        onClick={onSelect}
        className={cn(
          'flex h-full w-full flex-col rounded-lg border p-5 text-left transition-colors',
          'bg-transparent',
          isRecommended
            ? 'border-highlight bg-gradient-to-b from-transparent to-highlight/60'
            : 'border-border',
          disabled && 'cursor-not-allowed opacity-60',
          !disabled && !isRecommended && 'hover:border-primary',
          !disabled && selected && !isRecommended && 'border-primary',
        )}
      >
        <div className="mb-3 flex items-center gap-2">
          <Icon name={iconByKey[model.key]} className="size-5 text-white" />
          <h3 className="font-semibold text-white">{model.name}</h3>
        </div>

        <p className="mb-4 text-sm text-white/80">{model.description}</p>

        <p className="mb-2 text-xs font-medium text-white/70">O que entrega:</p>
        <ul className="mb-4 flex-1 space-y-1 text-sm text-white">
          {model.deliverables.map((item) => (
            <li key={item} className="flex gap-2">
              <span aria-hidden>•</span>
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex items-center justify-between pt-2">
          <div>
            <span className="text-xs text-white/70">R$</span>
            <span className="ml-0.5 text-lg font-bold text-white">
              {formatPrice(model.priceCents)}
            </span>
            <span className="ml-1 text-xs text-white/70">Por teste</span>
          </div>
          <span
            className={cn(
              'size-5 rounded-full border-2',
              selected && !disabled ? 'border-white bg-white' : 'border-white/60',
            )}
          />
        </div>
      </button>

      {disabled && model.unavailableReason ? (
        <p className="absolute top-full right-0 left-0 mt-2 text-xs text-tint-warning-foreground">
          {model.unavailableReason}
        </p>
      ) : null}
    </div>
  )
}
