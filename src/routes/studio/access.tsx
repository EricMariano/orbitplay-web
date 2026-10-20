import { useState, type FormEvent } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import type { OrgGroup } from '@/api-types'
import { EmptyState } from '@/components/common/EmptyState'
import { QueryBoundary } from '@/components/common/QueryBoundary'
import { RoleGate } from '@/components/common/RoleGate'
import { Icon } from '@/components/icon'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { GameAccessStep } from '@/features/access/components/GameAccessStep'
import { toSetGameAccessRequest, type AccessDraftEntry } from '@/features/access/access-draft'
import { useGameAccess } from '@/features/access/api/use-game-access'
import { useSetGameAccess } from '@/features/access/api/use-set-game-access'
import {
  useCreateOrgGroup,
  useDeleteOrgGroup,
  useOrgGroups,
  useUpdateOrgGroup,
} from '@/features/access/api/use-org-groups'
import { useOrgMembers } from '@/features/access/api/use-org-members'
import { useGames } from '@/features/games/api/use-games'
import { STUDIO_ROLES } from '@/lib/auth'

export const Route = createFileRoute('/studio/access')({ component: StudioAccessPage })

function StudioAccessPage() {
  return (
    <div className="mx-auto max-w-[1480px] space-y-7 pb-10 font-brand">
      <header className="border-b border-primary/35 pb-6">
        <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
          Segurança e colaboração
        </p>
        <h1 className="mt-2 font-label text-3xl font-medium text-foreground-strong">
          Gerenciamento de acessos
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Organize grupos e defina, por jogo, quem pode editar, testar e acessar relatórios.
        </p>
      </header>
      <GroupsPanel />
      <GameAccessPanel />
    </div>
  )
}

function GroupsPanel() {
  const groups = useOrgGroups()
  const members = useOrgMembers()
  const create = useCreateOrgGroup()
  const [editing, setEditing] = useState<OrgGroup | null>(null)
  const [open, setOpen] = useState(false)
  const update = useUpdateOrgGroup(editing?.id ?? '')
  const remove = useDeleteOrgGroup()

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const name = String(form.get('name') ?? '').trim()
    const memberUserIds = (members.data ?? [])
      .filter((member) => form.get(`member-${member.userId}`) === 'on')
      .map((member) => member.userId)
    if (editing) await update.mutateAsync({ name, memberUserIds })
    else await create.mutateAsync({ name, memberUserIds })
    setOpen(false)
    setEditing(null)
  }

  return (
    <section
      className="rounded-2xl border border-border bg-surface"
      aria-labelledby="groups-heading"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border p-5">
        <div>
          <h2 id="groups-heading" className="font-label text-xl font-medium text-foreground-strong">
            Grupos da organização
          </h2>
          <p className="mt-1 text-sm text-muted">
            Use grupos para aplicar o mesmo acesso a várias pessoas.
          </p>
        </div>
        <RoleGate allow={['owner', 'admin']}>
          <Button
            onClick={() => {
              setEditing(null)
              setOpen(true)
            }}
          >
            <Icon name="plus" /> Novo grupo
          </Button>
        </RoleGate>
      </div>
      <QueryBoundary
        query={groups}
        loadingFallback={
          <div className="p-5">
            <Skeleton className="h-32 w-full" />
          </div>
        }
      >
        {(items) =>
          items.length ? (
            <ul className="grid gap-3 p-5 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((group) => (
                <li
                  key={group.id}
                  className="rounded-xl border border-border bg-surface-raised p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Icon name="users" className="text-primary" />
                      <h3 className="font-medium text-foreground">{group.name}</h3>
                    </div>
                    <Badge variant="outline">{group.memberCount} pessoas</Badge>
                  </div>
                  <RoleGate allow={['owner', 'admin']}>
                    <div className="mt-4 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditing(group)
                          setOpen(true)
                        }}
                      >
                        <Icon name="edit" /> Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={remove.isPending}
                        onClick={() => void remove.mutateAsync(group.id)}
                      >
                        <Icon name="trash" /> Remover
                      </Button>
                    </div>
                  </RoleGate>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon="users"
              title="Nenhum grupo criado"
              description="Crie um grupo para organizar o acesso da equipe."
            />
          )
        }
      </QueryBoundary>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar grupo' : 'Novo grupo'}</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={(event) => void save(event)}>
            <label className="grid gap-1.5 text-sm font-medium">
              Nome do grupo
              <Input
                name="name"
                required
                defaultValue={editing?.name ?? ''}
                placeholder="Ex.: QA externo"
              />
            </label>
            <fieldset className="max-h-52 space-y-2 overflow-y-auto rounded-lg border border-border p-3">
              <legend className="px-1 text-sm font-medium">Participantes</legend>
              {(members.data ?? []).map((member) => (
                <label key={member.userId} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    name={`member-${member.userId}`}
                    defaultChecked={editing?.memberUserIds.includes(member.userId)}
                  />
                  {member.displayName}
                  <span className="text-muted">{member.email}</span>
                </label>
              ))}
            </fieldset>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={create.isPending || update.isPending}>
                Salvar grupo
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  )
}

function GameAccessPanel() {
  const games = useGames()
  const [gameId, setGameId] = useState<string | null>(null)
  return (
    <QueryBoundary query={games} loadingFallback={<Skeleton className="h-80 w-full" />}>
      {(items) => {
        const selectedGameId =
          gameId && items.some((game) => game.id === gameId) ? gameId : items[0]?.id
        return items.length ? (
          <section
            className="rounded-2xl border border-border bg-surface p-5"
            aria-labelledby="game-access-heading"
          >
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2
                  id="game-access-heading"
                  className="font-label text-xl font-medium text-foreground-strong"
                >
                  Permissões por jogo
                </h2>
                <p className="mt-1 text-sm text-muted">
                  A matriz substitui o acesso atual ao salvar.
                </p>
              </div>
              <Select value={selectedGameId} onValueChange={setGameId}>
                <SelectTrigger aria-label="Jogo para configurar" className="w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {items.map((game) => (
                    <SelectItem key={game.id} value={game.id}>
                      {game.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedGameId ? <AccessEditor gameId={selectedGameId} /> : null}
          </section>
        ) : (
          <EmptyState icon="games" title="Cadastre um jogo antes de configurar acessos" />
        )
      }}
    </QueryBoundary>
  )
}

function AccessEditor({ gameId }: { gameId: string }) {
  const access = useGameAccess(gameId)
  return (
    <QueryBoundary query={access} loadingFallback={<Skeleton className="mt-5 h-52 w-full" />}>
      {(entries) => <AccessEditorContent key={gameId} gameId={gameId} initialEntries={entries} />}
    </QueryBoundary>
  )
}

function AccessEditorContent({
  gameId,
  initialEntries,
}: {
  gameId: string
  initialEntries: AccessDraftEntry[]
}) {
  const save = useSetGameAccess()
  const [entries, setEntries] = useState<AccessDraftEntry[]>(initialEntries)
  return (
    <div className="mt-5 space-y-4">
      <GameAccessStep entries={entries} onChange={setEntries} />
      <RoleGate allow={STUDIO_ROLES}>
        <Button
          disabled={save.isPending}
          onClick={() => void save.mutateAsync({ gameId, ...toSetGameAccessRequest(entries) })}
        >
          <Icon name="save" />
          {save.isPending ? 'Salvando…' : 'Salvar permissões'}
        </Button>
      </RoleGate>
    </div>
  )
}
