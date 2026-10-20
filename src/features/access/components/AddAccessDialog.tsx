import { useState } from 'react'
import type { OrgGroup, OrgMember } from '@/api-types'
import { Icon } from '@/components/icon'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { entryKey, type AccessDraftEntry } from '../access-draft'

type AddAccessDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  groups: OrgGroup[]
  members: OrgMember[]
  entries: AccessDraftEntry[]
  onConfirm: (selection: { groups: OrgGroup[]; members: OrgMember[] }) => void
}

/** Modal "Adicionar membro ou grupo" (Tela 04): escolhe quem aparece na matriz de permissões. */
export function AddAccessDialog(props: AddAccessDialogProps) {
  // O conteúdo remonta a cada abertura: a seleção sempre parte do que já está na matriz.
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      {props.open ? <AddAccessContent {...props} /> : null}
    </Dialog>
  )
}

function AddAccessContent({
  onOpenChange,
  groups,
  members,
  entries,
  onConfirm,
}: AddAccessDialogProps) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(() => new Set(entries.map(entryKey)))

  // "@nome" procura só entre membros, como pede o texto do modal.
  const membersOnly = query.trimStart().startsWith('@')
  const term = query.replace(/^\s*@/, '').trim().toLowerCase()
  const matches = (text: string) => !term || text.toLowerCase().includes(term)
  const visibleGroups = membersOnly ? [] : groups.filter((group) => matches(group.name))
  const visibleMembers = members.filter(
    (member) => matches(member.displayName) || matches(member.email),
  )

  function toggle(key: string, checked: boolean) {
    setSelected((current) => {
      const next = new Set(current)
      if (checked) next.add(key)
      else next.delete(key)
      return next
    })
  }

  function confirm() {
    onConfirm({
      groups: groups.filter((group) => selected.has(`group:${group.id}`)),
      members: members.filter((member) => selected.has(`member:${member.userId}`)),
    })
    onOpenChange(false)
  }

  return (
    <DialogContent className="max-w-lg">
      <DialogHeader>
        <DialogTitle>Adicionar membro ou grupo</DialogTitle>
        <DialogDescription>
          Adicione membros individualmente começando com @, ou digite o nome de um Grupo.
        </DialogDescription>
      </DialogHeader>

      <div className="relative">
        <Icon
          name="search"
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted"
        />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Pesquisa..."
          aria-label="Pesquisar membros ou grupos"
          className="pl-9"
        />
      </div>

      <div className="max-h-72 space-y-4 overflow-y-auto pr-1">
        <section aria-label="Grupos">
          <h3 className="mb-2 text-sm font-bold text-foreground-strong">Grupos:</h3>
          {visibleGroups.length === 0 ? (
            <p className="text-sm text-muted">
              {groups.length === 0 ? 'Nenhum grupo cadastrado.' : 'Nenhum grupo encontrado.'}
            </p>
          ) : (
            <ul className="space-y-1">
              {visibleGroups.map((group) => (
                <li key={group.id}>
                  <label className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 text-sm hover:bg-accent">
                    <Checkbox
                      checked={selected.has(`group:${group.id}`)}
                      onCheckedChange={(checked) => toggle(`group:${group.id}`, checked === true)}
                    />
                    <Icon name="users" className="text-primary" />
                    {group.name} ({group.memberCount} perfis)
                  </label>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-label="Membros">
          <h3 className="mb-2 text-sm font-bold text-foreground-strong">Membros:</h3>
          {visibleMembers.length === 0 ? (
            <p className="text-sm text-muted">
              {members.length === 0 ? 'Nenhum membro disponível.' : 'Nenhum membro encontrado.'}
            </p>
          ) : (
            <ul className="space-y-1">
              {visibleMembers.map((member) => (
                <li key={member.userId}>
                  <label className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 text-sm hover:bg-accent">
                    <Checkbox
                      checked={selected.has(`member:${member.userId}`)}
                      onCheckedChange={(checked) =>
                        toggle(`member:${member.userId}`, checked === true)
                      }
                    />
                    <span className="flex size-6 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
                      {member.displayName.slice(0, 1).toUpperCase()}
                    </span>
                    <span className="min-w-0 truncate">{member.displayName}</span>
                    <span className="min-w-0 truncate text-xs text-muted">{member.email}</span>
                  </label>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <DialogFooter className="sm:justify-between">
        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
          Cancelar
        </Button>
        <Button
          type="button"
          onClick={confirm}
          className="bg-gradient-to-br from-cta-configure-from to-cta-configure-to font-bold"
        >
          Finalizar
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}
