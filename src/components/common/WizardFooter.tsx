import type { ReactNode } from 'react'
import { Icon } from '@/components/icon'
import { Button } from '@/components/ui/button'

type WizardFooterProps = {
  onBack: () => void
  onNext: () => void
  canAdvance: boolean
  isSaving: boolean
  nextLabel?: string
  /** Ações secundárias à esquerda do botão principal (ex.: "Salvar", "Pré-visualizar"). */
  children?: ReactNode
}

/** Rodapé dos wizards: "Voltar" à esquerda, ações secundárias e o botão principal à direita. */
export function WizardFooter({
  onBack,
  onNext,
  canAdvance,
  isSaving,
  nextLabel = 'Próximo',
  children,
}: WizardFooterProps) {
  return (
    <div className="mt-6 flex flex-wrap items-center justify-end gap-6">
      <button
        type="button"
        onClick={onBack}
        className="mr-auto flex items-center gap-1 text-base font-bold text-primary hover:opacity-80"
      >
        <Icon name="arrow-left" className="size-6" />
        Voltar
      </button>
      {children}
      <Button
        size="lg"
        disabled={!canAdvance || isSaving}
        onClick={onNext}
        className="h-12 bg-gradient-to-br from-cta-configure-from to-cta-configure-to px-8 text-base font-bold"
      >
        {isSaving ? 'Salvando...' : nextLabel}
      </Button>
    </div>
  )
}
