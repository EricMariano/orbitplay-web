import type { TestModel } from '@/api-types'
import { Icon, type IconName } from '@/components/icon'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { PLAYER_TIER_OPTIONS, formatCents, type AudienceDraft, type Budget } from '../audience'

const PAYMENT_METHODS: { icon: IconName; label: string }[] = [
  { icon: 'qr-code', label: 'Pix BR$' },
  { icon: 'barcode', label: 'Boleto' },
  { icon: 'credit-card', label: 'Cartão de crédito' },
  { icon: 'wallet', label: 'PayPal' },
]

type PurchaseSummaryProps = {
  model: TestModel | undefined
  draft: AudienceDraft
  budget: Budget
  canFinish: boolean
  isFinishing: boolean
  onBack: () => void
  onFinish: () => void
}

/**
 * "Resumo da compra" (Tela 09). Os valores são do front (a API não tem preço);
 * "Pagar e finalizar!" salva o público e publica, sem cobrança.
 */
export function PurchaseSummary({
  model,
  draft,
  budget,
  canFinish,
  isFinishing,
  onBack,
  onFinish,
}: PurchaseSummaryProps) {
  const tier = PLAYER_TIER_OPTIONS.find((option) => option.key === draft.playerTier)
  const [whole, fraction] = formatCents(budget.totalCents ?? 0)
    .replace('R$', '')
    .trim()
    .split(',')

  return (
    <aside className="flex flex-col gap-6 rounded-3xl border border-foreground bg-stat-card-background p-8 text-foreground-strong lg:sticky lg:top-6">
      <h2 className="text-3xl font-bold">Resumo da compra</h2>
      <Separator />

      <p className="flex flex-wrap items-baseline gap-2">
        <strong className="text-2xl">{formatCents(budget.baseCents)}/teste</strong>
        <span className="text-base">Modelo base {model?.name ?? ''}</span>
      </p>
      <p className="flex items-baseline gap-2">
        <strong className="text-2xl">
          {draft.keepActive ? 'Sem limite' : draft.quantity.toLocaleString('pt-BR')}
        </strong>
        <span className="text-base">{draft.keepActive ? 'até desativar' : 'Testes'}</span>
      </p>
      {budget.tierExtraCents > 0 ? (
        <SummaryExtra amount={budget.tierExtraCents} label={`Tester ${tier?.label ?? ''}`} />
      ) : null}
      {budget.boostCents > 0 ? (
        <SummaryExtra amount={budget.boostCents} label="Impulsionar teste" />
      ) : null}

      <hr className="border-dashed border-foreground/60" />

      <p className="text-right text-2xl font-bold">{formatCents(budget.perTestCents)}/teste</p>
      <p className="flex items-baseline justify-end gap-1">
        {budget.totalCents === null ? (
          <span className="text-base text-muted">Cobrado por teste realizado</span>
        ) : (
          <>
            <span className="text-2xl font-light">R$</span>
            <span className="text-5xl font-bold">
              {whole},{fraction}
            </span>
            <span className="text-base font-light">Total</span>
          </>
        )}
      </p>

      <ul className="flex flex-wrap justify-end gap-x-3 gap-y-2 text-base">
        {PAYMENT_METHODS.map((method) => (
          <li key={method.label} className="flex items-center gap-1">
            <Icon name={method.icon} className="size-6" />
            {method.label}
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap items-center justify-end gap-6">
        <button
          type="button"
          onClick={onBack}
          className="mr-auto flex items-center gap-1 text-base font-bold text-primary hover:opacity-80"
        >
          <Icon name="arrow-left" className="size-6" />
          Voltar
        </button>
        <Button
          size="lg"
          disabled={!canFinish || isFinishing}
          onClick={onFinish}
          className="h-12 bg-gradient-to-br from-cta-configure-from to-cta-configure-to px-8 text-base font-bold"
        >
          {isFinishing ? 'Finalizando...' : 'Pagar e finalizar!'}
        </Button>
      </div>
    </aside>
  )
}

function SummaryExtra({ amount, label }: { amount: number; label: string }) {
  return (
    <p className="flex items-center gap-2 text-base">
      <Icon name="plus" className="size-6 text-primary" />
      <strong>{formatCents(amount)}/teste</strong>
      {label}
    </p>
  )
}
