import type { ReactNode } from 'react'
import type { ReportBlockKey, ReportBlockOf, ReportPayload } from '@/api-types'
import { Icon } from '@/components/icon'
import { Skeleton } from '@/components/ui/skeleton'

type BlockContentProps<K extends ReportBlockKey> = {
  block: ReportBlockOf<K> | undefined
  /** Por que o bloco não tem fonte de dados ainda (`status: unavailable`). */
  unavailableMessage: string
  children: (payload: ReportPayload<K>) => ReactNode
}

/**
 * Estado de UM bloco do relatório: cada bloco tem o próprio `status`, então
 * um bloco em processamento ou com falha não derruba os demais (Tela 11 RN-02).
 */
export function BlockContent<K extends ReportBlockKey>({
  block,
  unavailableMessage,
  children,
}: BlockContentProps<K>) {
  if (block?.status === 'ready' && block.payload) {
    return <>{children(block.payload as ReportPayload<K>)}</>
  }

  if (block?.status === 'processing') {
    return (
      <div className="flex flex-1 flex-col gap-3" aria-busy="true">
        <Skeleton className="h-6 w-1/2 bg-white/10" />
        <Skeleton className="w-full flex-1 bg-white/10" />
        <span className="text-[14px]">Processando os dados deste bloco…</span>
      </div>
    )
  }

  const failed = !block || block.status === 'failed'
  return (
    <BlockMessage icon={failed ? 'alert' : 'info'}>
      {failed
        ? 'Não foi possível calcular este bloco agora. Tente recarregar a página.'
        : unavailableMessage}
    </BlockMessage>
  )
}

/** Mensagem centralizada dentro de um cartão (indisponível, vazio, falha). */
export function BlockMessage({
  icon = 'info',
  children,
}: {
  icon?: 'info' | 'alert' | 'empty'
  children: ReactNode
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 py-6 text-center text-[14px]">
      <Icon name={icon} className="size-6" />
      <p className="max-w-sm">{children}</p>
    </div>
  )
}
