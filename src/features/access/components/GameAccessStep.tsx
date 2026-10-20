import { useState } from 'react'
import { QueryBoundary } from '@/components/common/QueryBoundary'
import { Icon } from '@/components/icon'
import { Skeleton } from '@/components/ui/skeleton'
import { useOrgGroups } from '../api/use-org-groups'
import { useOrgMembers } from '../api/use-org-members'
import {
  applySelection,
  isEligibleMember,
  removeEntry,
  togglePermission,
  type AccessDraftEntry,
} from '../access-draft'
import { AccessMatrix } from './AccessMatrix'
import { AddAccessDialog } from './AddAccessDialog'

type GameAccessStepProps = {
  entries: AccessDraftEntry[]
  onChange: (entries: AccessDraftEntry[]) => void
}

/** Conteúdo da etapa "Responsáveis e permissões": matriz + modal para adicionar grupos e membros. */
export function GameAccessStep({ entries, onChange }: GameAccessStepProps) {
  const members = useOrgMembers()
  const groups = useOrgGroups()
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <QueryBoundary
      query={members}
      isEmpty={() => false}
      loadingFallback={<Skeleton className="h-40 w-full" />}
    >
      {(allMembers) => (
        <div className="flex flex-col gap-4">
          <AccessMatrix
            entries={entries}
            onToggle={(entry, key, value) => onChange(togglePermission(entries, entry, key, value))}
            onRemove={(entry) => onChange(removeEntry(entries, entry))}
          />

          <button
            type="button"
            onClick={() => setDialogOpen(true)}
            disabled={groups.isPending}
            className="flex w-fit items-center gap-1 text-sm font-bold text-primary hover:opacity-80 disabled:opacity-60"
          >
            Adicionar membros ou grupo
            <Icon name="arrow-right" />
          </button>

          <AddAccessDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            groups={groups.data ?? []}
            members={allMembers.filter(isEligibleMember)}
            entries={entries}
            onConfirm={(selection) => onChange(applySelection(entries, selection))}
          />
        </div>
      )}
    </QueryBoundary>
  )
}
