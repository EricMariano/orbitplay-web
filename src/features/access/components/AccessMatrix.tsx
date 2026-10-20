import { Icon } from '@/components/icon'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  PERMISSION_COLUMNS,
  entryKey,
  type AccessDraftEntry,
  type PermissionKey,
} from '../access-draft'

type AccessMatrixProps = {
  entries: AccessDraftEntry[]
  onToggle: (entry: AccessDraftEntry, key: PermissionKey, value: boolean) => void
  onRemove: (entry: AccessDraftEntry) => void
}

/** Matriz grupos/membros × permissões da etapa "Responsáveis e permissões" (Tela 04). */
export function AccessMatrix({ entries, onToggle, onRemove }: AccessMatrixProps) {
  const groups = entries.filter((entry) => entry.subjectType === 'group')
  const members = entries.filter((entry) => entry.subjectType === 'member')

  if (entries.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-field-border/60 p-6 text-center text-sm text-foreground-strong/80">
        Ninguém tem acesso ainda. Adicione membros ou grupos para definir as permissões.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-field-border/30 bg-field">
      <Table aria-label="Permissões por membro e grupo">
        <TableHeader>
          <TableRow className="border-field-border/20 hover:bg-transparent">
            <TableHead className="text-foreground-strong">Nome</TableHead>
            {PERMISSION_COLUMNS.map((column) => (
              <TableHead key={column.key} className="text-center text-foreground-strong">
                {column.label}
              </TableHead>
            ))}
            <TableHead className="w-10">
              <span className="sr-only">Remover</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...groups, ...members].map((entry) => (
            <TableRow key={entryKey(entry)} className="border-field-border/15 hover:bg-field/60">
              <TableCell className="text-foreground-strong">
                <span className="flex items-center gap-2">
                  {entry.subjectType === 'group' ? (
                    <Icon name="users" className="text-primary" />
                  ) : (
                    <span className="flex size-6 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
                      {entry.name.slice(0, 1).toUpperCase()}
                    </span>
                  )}
                  {entry.name}
                  {entry.subjectType === 'group' ? ` (${entry.memberCount ?? 0} perfis)` : null}
                </span>
              </TableCell>
              {PERMISSION_COLUMNS.map((column) => (
                <TableCell key={column.key} className="text-center">
                  <Switch
                    checked={entry.permissions[column.key]}
                    onCheckedChange={(value) => onToggle(entry, column.key, value)}
                    aria-label={`${entry.name}: ${column.label}`}
                  />
                </TableCell>
              ))}
              <TableCell>
                <button
                  type="button"
                  onClick={() => onRemove(entry)}
                  aria-label={`Remover ${entry.name}`}
                  className="text-foreground-strong/70 hover:text-destructive"
                >
                  <Icon name="trash" />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
