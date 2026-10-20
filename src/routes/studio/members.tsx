import { useState, type FormEvent } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import type { OrgMember } from '@/api-types'
import { EmptyState } from '@/components/common/EmptyState'
import { QueryBoundary } from '@/components/common/QueryBoundary'
import { RoleGate } from '@/components/common/RoleGate'
import { Icon } from '@/components/icon'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { roleLabels } from '@/features/auth/role-labels'
import {
  useAuditLogs,
  useChangeOrgMemberRole,
  useChangeOrgMemberStatus,
  useInviteOrgMember,
  useOrgMembers,
  useRemoveOrgMember,
  useTriggerMemberPasswordReset,
} from '@/features/access/api/use-org-members'
import { ApiError } from '@/lib/api-client'
import { useAuthStore } from '@/lib/auth'

export const Route = createFileRoute('/studio/members')({ component: StudioMembersPage })

type MemberRole = OrgMember['role']
type MemberStatus = OrgMember['status']
type PendingChange =
  | { type: 'role'; member: OrgMember; value: MemberRole }
  | { type: 'status'; member: OrgMember; value: MemberStatus }

const roles: MemberRole[] = ['owner', 'admin', 'studio', 'player']
const statuses: Array<{ value: MemberStatus; label: string }> = [
  { value: 'active', label: 'Ativo' },
  { value: 'invited', label: 'Convite pendente' },
  { value: 'disabled', label: 'Desativado' },
]

const statusClass: Record<MemberStatus, string> = {
  active: 'border-success/30 bg-success/10 text-success',
  invited: 'border-highlight/30 bg-highlight/10 text-highlight',
  disabled: 'border-border bg-surface-raised text-muted',
}

const statusLabel: Record<MemberStatus, string> = Object.fromEntries(
  statuses.map((status) => [status.value, status.label]),
) as Record<MemberStatus, string>

function StudioMembersPage() {
  const members = useOrgMembers()
  const user = useAuthStore((state) => state.user)
  const invite = useInviteOrgMember()
  const [inviteOpen, setInviteOpen] = useState(false)
  const [inviteError, setInviteError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<MemberRole | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<MemberStatus | 'all'>('all')
  const [pendingChange, setPendingChange] = useState<PendingChange | null>(null)
  const roleChange = useChangeOrgMemberRole(pendingChange?.member.userId ?? '')
  const statusChange = useChangeOrgMemberStatus(pendingChange?.member.userId ?? '')
  const inviteRoles = user?.role === 'owner' ? roles : roles.filter((role) => role !== 'owner')

  async function submitInvite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const email = String(form.get('email') ?? '')
    const displayName = String(form.get('displayName') ?? '').trim()
    const role = String(form.get('role') ?? 'studio') as MemberRole
    setInviteError(null)
    try {
      await invite.mutateAsync({ email, role, ...(displayName ? { displayName } : {}) })
      setInviteOpen(false)
      event.currentTarget.reset()
    } catch (error) {
      setInviteError(
        error instanceof ApiError ? error.message : 'Não foi possível enviar o convite.',
      )
    }
  }

  async function confirmChange() {
    if (!pendingChange) return
    try {
      if (pendingChange.type === 'role') {
        await roleChange.mutateAsync({ role: pendingChange.value, confirm: true })
      } else {
        await statusChange.mutateAsync({ status: pendingChange.value, confirm: true })
      }
      setPendingChange(null)
    } catch {
      // The dialog retains context and exposes the error below for a safe retry.
    }
  }

  const changeError =
    roleChange.error instanceof ApiError
      ? roleChange.error.message
      : statusChange.error instanceof ApiError
        ? statusChange.error.message
        : null

  return (
    <div className="mx-auto max-w-[1480px] space-y-7 pb-10 font-brand">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-primary/35 pb-6">
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
            Acesso do estúdio
          </p>
          <h1 className="mt-2 font-label text-3xl font-medium text-foreground-strong">
            Membros do estúdio
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Convide pessoas, defina o nível de acesso e acompanhe mudanças que afetam sua
            organização.
          </p>
        </div>
        <RoleGate allow={['owner', 'admin']}>
          <Button onClick={() => setInviteOpen(true)}>
            <Icon name="plus" /> Convidar membro
          </Button>
        </RoleGate>
      </header>

      <QueryBoundary query={members} isEmpty={() => false} loadingFallback={<MembersSkeleton />}>
        {(allMembers) => {
          const visibleMembers = filterMembers(allMembers, query, roleFilter, statusFilter)
          const overview = countMembers(allMembers)
          return (
            <>
              <section className="grid gap-3 sm:grid-cols-3" aria-label="Resumo de membros">
                <Metric value={overview.active} label="Membros ativos" tone="primary" />
                <Metric value={overview.invited} label="Convites pendentes" tone="highlight" />
                <Metric value={overview.disabled} label="Acessos desativados" tone="muted" />
              </section>

              <section
                className="rounded-2xl border border-border bg-surface shadow-sm"
                aria-labelledby="members-list-heading"
              >
                <div className="flex flex-col gap-4 border-b border-border p-5 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <h2
                      id="members-list-heading"
                      className="font-label text-xl font-medium text-foreground-strong"
                    >
                      Pessoas e permissões
                    </h2>
                    <p className="mt-1 text-sm text-muted">
                      As permissões entram em vigor pela próxima sessão da pessoa.
                    </p>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-[minmax(14rem,1fr)_10rem_11rem]">
                    <label className="relative block">
                      <span className="sr-only">Buscar membro</span>
                      <Icon
                        name="search"
                        className="absolute top-1/2 left-3 -translate-y-1/2 text-muted"
                      />
                      <Input
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Buscar por nome ou e-mail"
                        className="pl-9"
                      />
                    </label>
                    <MemberFilter value={roleFilter} onValueChange={setRoleFilter} kind="role" />
                    <MemberFilter
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                      kind="status"
                    />
                  </div>
                </div>

                {visibleMembers.length ? (
                  <Table aria-label="Membros da organização">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Membro</TableHead>
                        <TableHead>Papel</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {visibleMembers.map((member) => (
                        <MemberRow
                          key={member.userId}
                          member={member}
                          isCurrentUser={member.userId === user?.id}
                          onChange={setPendingChange}
                        />
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <EmptyState
                    icon="users"
                    title={
                      allMembers.length
                        ? 'Nenhum membro encontrado'
                        : 'Ainda não há membros além de você'
                    }
                    description={
                      allMembers.length
                        ? 'Ajuste os filtros ou tente outra busca.'
                        : 'Envie um convite para começar a organizar o acesso do estúdio.'
                    }
                  />
                )}
              </section>
            </>
          )
        }}
      </QueryBoundary>

      <AuditTrail />

      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Convidar pessoa</DialogTitle>
            <DialogDescription>
              O convite cria um acesso pendente. A pessoa define a própria senha pelo e-mail
              recebido.
            </DialogDescription>
          </DialogHeader>
          <form className="grid gap-4" onSubmit={(event) => void submitInvite(event)}>
            <label
              className="grid gap-1.5 text-sm font-medium text-foreground"
              htmlFor="member-email"
            >
              E-mail do convite
              <Input
                id="member-email"
                name="email"
                type="email"
                required
                placeholder="nome@estudio.com"
              />
            </label>
            <label
              className="grid gap-1.5 text-sm font-medium text-foreground"
              htmlFor="member-name"
            >
              Nome de exibição <span className="font-normal text-muted">(opcional)</span>
              <Input
                id="member-name"
                name="displayName"
                placeholder="Como a pessoa será identificada"
              />
            </label>
            <label
              className="grid gap-1.5 text-sm font-medium text-foreground"
              htmlFor="member-role"
            >
              Papel inicial
              <select
                id="member-role"
                name="role"
                defaultValue="studio"
                className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
              >
                {inviteRoles.map((role) => (
                  <option key={role} value={role}>
                    {roleLabels[role]}
                  </option>
                ))}
              </select>
            </label>
            {inviteError ? <p className="text-sm text-destructive">{inviteError}</p> : null}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setInviteOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={invite.isPending}>
                <Icon
                  name={invite.isPending ? 'loader' : 'send'}
                  className={invite.isPending ? 'animate-spin' : undefined}
                />
                {invite.isPending ? 'Enviando…' : 'Enviar convite'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={pendingChange !== null}
        onOpenChange={(open) => !open && setPendingChange(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {pendingChange?.type === 'role'
                ? 'Confirmar mudança de papel'
                : 'Confirmar mudança de status'}
            </DialogTitle>
            <DialogDescription>
              {pendingChange
                ? pendingChange.type === 'role'
                  ? `${pendingChange.member.displayName} passará a ser ${roleLabels[pendingChange.value]}.`
                  : `${pendingChange.member.displayName} ficará com o status “${statusLabel[pendingChange.value]}”.`
                : ''}
            </DialogDescription>
          </DialogHeader>
          <p className="rounded-lg border border-highlight/25 bg-highlight/10 p-3 text-sm text-foreground">
            Esta é uma alteração crítica e será registrada na trilha de auditoria.
          </p>
          {changeError ? <p className="text-sm text-destructive">{changeError}</p> : null}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setPendingChange(null)}>
              Cancelar
            </Button>
            <Button
              type="button"
              variant={
                pendingChange?.type === 'status' && pendingChange.value === 'disabled'
                  ? 'destructive'
                  : 'default'
              }
              onClick={() => void confirmChange()}
              disabled={roleChange.isPending || statusChange.isPending}
            >
              Confirmar alteração
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function MemberRow({
  member,
  isCurrentUser,
  onChange,
}: {
  member: OrgMember
  isCurrentUser: boolean
  onChange: (change: PendingChange) => void
}) {
  const remove = useRemoveOrgMember()
  const passwordReset = useTriggerMemberPasswordReset()
  const nextStatus = member.status === 'disabled' ? 'active' : 'disabled'
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
            {initials(member.displayName)}
          </span>
          <span className="min-w-0">
            <span className="block truncate font-medium text-foreground">{member.displayName}</span>
            <span className="block truncate text-xs text-muted">{member.email}</span>
          </span>
        </div>
      </TableCell>
      <TableCell>
        <RoleGate
          allow="owner"
          fallback={<Badge variant="outline">{roleLabels[member.role]}</Badge>}
        >
          <Select
            value={member.role}
            onValueChange={(value) =>
              onChange({ type: 'role', member, value: value as MemberRole })
            }
            disabled={isCurrentUser}
          >
            <SelectTrigger aria-label={`Papel de ${member.displayName}`} size="sm" className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role} value={role}>
                  {roleLabels[role]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </RoleGate>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className={statusClass[member.status]}>
          <span className="size-1.5 rounded-full bg-current" />
          {statusLabel[member.status]}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <RoleGate allow={['owner', 'admin']}>
          <div className="flex justify-end gap-1">
            <Button
              variant="ghost"
              size="sm"
              disabled={isCurrentUser || passwordReset.isPending}
              onClick={() => void passwordReset.mutateAsync(member.userId)}
              title="Enviar e-mail de redefinição de senha"
            >
              <Icon name="key" />
              <span className="sr-only">Redefinir senha de {member.displayName}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={isCurrentUser}
              onClick={() => onChange({ type: 'status', member, value: nextStatus })}
            >
              <Icon name={nextStatus === 'disabled' ? 'lock' : 'user-check'} />
              {nextStatus === 'disabled' ? 'Desativar' : 'Reativar'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={isCurrentUser || remove.isPending}
              onClick={() => {
                if (window.confirm(`Remover ${member.displayName} da organização?`))
                  void remove.mutateAsync(member.userId)
              }}
            >
              <Icon name="trash" />
              <span className="sr-only">Remover {member.displayName}</span>
            </Button>
          </div>
        </RoleGate>
      </TableCell>
    </TableRow>
  )
}

function MemberFilter({
  value,
  onValueChange,
  kind,
}: {
  value: MemberRole | MemberStatus | 'all'
  onValueChange: (value: never) => void
  kind: 'role' | 'status'
}) {
  const options =
    kind === 'role' ? roles.map((value) => ({ value, label: roleLabels[value] })) : statuses
  return (
    <Select value={value} onValueChange={(next) => onValueChange(next as never)}>
      <SelectTrigger
        aria-label={kind === 'role' ? 'Filtrar por papel' : 'Filtrar por status'}
        className="w-full"
      >
        <SelectValue placeholder={kind === 'role' ? 'Todos os papéis' : 'Todos os status'} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">
          {kind === 'role' ? 'Todos os papéis' : 'Todos os status'}
        </SelectItem>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function AuditTrail() {
  const role = useAuthStore((state) => state.role)
  const canReadAudit = role === 'owner' || role === 'admin'
  const audit = useAuditLogs(canReadAudit)

  if (!canReadAudit) {
    return (
      <section
        className="rounded-2xl border border-border bg-surface p-5"
        aria-labelledby="audit-heading"
      >
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-lg bg-surface-raised text-muted">
            <Icon name="lock" />
          </span>
          <div>
            <h2
              id="audit-heading"
              className="font-label text-xl font-medium text-foreground-strong"
            >
              Trilha de auditoria
            </h2>
            <p className="mt-1 text-sm text-muted">
              Disponível para proprietários e administradores da organização.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      className="rounded-2xl border border-border bg-surface"
      aria-labelledby="audit-heading"
    >
      <div className="flex items-center gap-3 border-b border-border p-5">
        <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon name="list-checks" />
        </span>
        <div>
          <h2 id="audit-heading" className="font-label text-xl font-medium text-foreground-strong">
            Trilha de auditoria
          </h2>
          <p className="mt-1 text-sm text-muted">
            Mudanças de acesso e administração da organização.
          </p>
        </div>
      </div>
      <QueryBoundary
        query={audit}
        loadingFallback={
          <div className="p-5">
            <Skeleton className="h-24 w-full" />
          </div>
        }
        emptyFallback={
          <EmptyState
            icon="list-checks"
            title="Nenhuma alteração registrada"
            description="As próximas mudanças de acesso aparecerão aqui."
          />
        }
      >
        {(entries) => (
          <ol className="divide-y divide-border" aria-label="Eventos de auditoria">
            {entries.slice(0, 8).map((entry) => (
              <li
                key={entry.id}
                className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{auditLabel(entry.action)}</p>
                  <p className="mt-1 truncate text-xs text-muted">
                    {entry.actorEmail ?? 'Sistema'} · {entry.entity}
                  </p>
                </div>
                <time className="shrink-0 text-xs text-muted" dateTime={entry.createdAt}>
                  {new Intl.DateTimeFormat('pt-BR', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  }).format(new Date(entry.createdAt))}
                </time>
              </li>
            ))}
          </ol>
        )}
      </QueryBoundary>
    </section>
  )
}

function Metric({
  value,
  label,
  tone,
}: {
  value: number
  label: string
  tone: 'primary' | 'highlight' | 'muted'
}) {
  const toneClass = {
    primary: 'border-primary/30 bg-primary/10 text-primary',
    highlight: 'border-highlight/30 bg-highlight/10 text-highlight',
    muted: 'border-border bg-surface-raised text-muted',
  }[tone]
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div
        className={`mb-3 flex size-8 items-center justify-center rounded-lg border ${toneClass}`}
      >
        <Icon name="users" />
      </div>
      <p className="font-label text-2xl font-medium text-foreground-strong">{value}</p>
      <p className="mt-1 text-xs text-muted">{label}</p>
    </div>
  )
}

function MembersSkeleton() {
  return (
    <div className="space-y-4" aria-label="Carregando membros" aria-busy="true">
      <div className="grid gap-3 sm:grid-cols-3">
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
      </div>
      <Skeleton className="h-80 w-full" />
    </div>
  )
}

function filterMembers(
  members: OrgMember[],
  query: string,
  role: MemberRole | 'all',
  status: MemberStatus | 'all',
) {
  const normalized = query.trim().toLocaleLowerCase('pt-BR')
  return members.filter((member) => {
    const matchesQuery =
      !normalized ||
      `${member.displayName} ${member.email}`.toLocaleLowerCase('pt-BR').includes(normalized)
    return (
      matchesQuery &&
      (role === 'all' || member.role === role) &&
      (status === 'all' || member.status === status)
    )
  })
}

function countMembers(members: OrgMember[]) {
  return members.reduce(
    (total, member) => ({ ...total, [member.status]: total[member.status] + 1 }),
    { active: 0, invited: 0, disabled: 0 } satisfies Record<MemberStatus, number>,
  )
}

function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

function auditLabel(action: string) {
  const labels: Record<string, string> = {
    'org.member_invited': 'Convite enviado',
    'org.member_role_changed': 'Papel de membro alterado',
    'org.member_status_changed': 'Status de membro alterado',
    'org.member_removed': 'Membro removido',
    'org.member_password_reset_triggered': 'Redefinição de senha solicitada',
  }
  return labels[action] ?? action.replaceAll('_', ' ').replaceAll('.', ' · ')
}
