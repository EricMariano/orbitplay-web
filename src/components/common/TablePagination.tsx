import { Icon } from '@/components/icon'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

const PAGE_SIZES = [5, 10, 25, 50]

type PageSizeSelectProps = {
  value: number
  onChange: (value: number) => void
  className?: string
  triggerClassName?: string
}

/** "Mostrar: [5 ▾]" — tamanho de página das tabelas paginadas. */
export function PageSizeSelect({
  value,
  onChange,
  className,
  triggerClassName,
}: PageSizeSelectProps) {
  return (
    <div className={cn('flex items-center gap-2 text-sm text-stat-card-muted', className)}>
      <span>Mostrar:</span>
      <Select value={String(value)} onValueChange={(v) => onChange(Number(v))}>
        <SelectTrigger className={cn('h-8 w-16', triggerClassName)} aria-label="Itens por página">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {PAGE_SIZES.map((size) => (
            <SelectItem key={size} value={String(size)}>
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

type PaginationProps = {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  /**
   * Páginas que dá para abrir direto. Listas por cursor só alcançam páginas
   * já visitadas (+ a próxima pela seta); as demais ficam desabilitadas.
   */
  isPageEnabled?: (page: number) => boolean
  /** Próxima página existe mesmo sem `totalPages` saber (cursor). */
  hasNextPage?: boolean
  className?: string
  pageClassName?: string
  activePageClassName?: string
}

/** Paginação "← 1 2 3 … 9 →" das tabelas. */
export function Pagination({
  page,
  totalPages,
  onPageChange,
  isPageEnabled = () => true,
  hasNextPage = page < totalPages,
  className,
  pageClassName,
  activePageClassName,
}: PaginationProps) {
  const pages =
    totalPages <= 5
      ? Array.from({ length: totalPages }, (_, i) => i + 1)
      : [1, 2, 3, -1, totalPages]

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <Button
        variant="ghost"
        size="icon-sm"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="Página anterior"
      >
        <Icon name="arrow-left" />
      </Button>

      {pages.map((p, i) =>
        p === -1 ? (
          <span key={`ellipsis-${i}`} className="px-1 text-sm text-stat-card-muted">
            …
          </span>
        ) : (
          <Button
            key={p}
            size="icon-sm"
            variant={p === page ? 'default' : 'ghost'}
            className={cn(pageClassName, p === page && activePageClassName)}
            aria-current={p === page ? 'page' : undefined}
            disabled={p !== page && !isPageEnabled(p)}
            onClick={() => onPageChange(p)}
          >
            {p}
          </Button>
        ),
      )}

      <Button
        variant="ghost"
        size="icon-sm"
        disabled={!hasNextPage}
        onClick={() => onPageChange(page + 1)}
        aria-label="Próxima página"
      >
        <Icon name="arrow-right" />
      </Button>
    </div>
  )
}
