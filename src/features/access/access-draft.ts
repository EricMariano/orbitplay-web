import type {
  AccessPermissions,
  GameAccessEntry,
  OrgGroup,
  OrgMember,
  SetGameAccessRequest,
} from '@/api-types'

/** Linha da matriz de permissões enquanto o jogo ainda está sendo montado (ou editado). */
export type AccessDraftEntry = GameAccessEntry

export type PermissionKey = keyof AccessPermissions

/** Colunas da matriz "Responsáveis e permissões" (Tela 04), na ordem do design. */
export const PERMISSION_COLUMNS: { key: PermissionKey; label: string }[] = [
  { key: 'manageAccess', label: 'Editar permissões / excluir projeto' },
  { key: 'editInfo', label: 'Editar informações gerais' },
  { key: 'manageTests', label: 'Criar / editar testes' },
  { key: 'viewReports', label: 'Acessar relatórios' },
]

export const NO_PERMISSIONS: AccessPermissions = {
  manageAccess: false,
  editInfo: false,
  manageTests: false,
  viewReports: false,
}

export const ALL_PERMISSIONS: AccessPermissions = {
  manageAccess: true,
  editInfo: true,
  manageTests: true,
  viewReports: true,
}

/** Só membros ativos de papel de estúdio podem receber permissões (regra da API). */
export function isEligibleMember(member: OrgMember): boolean {
  return member.role !== 'player' && member.status !== 'disabled'
}

export function entryKey(entry: Pick<AccessDraftEntry, 'subjectType' | 'subjectId'>): string {
  return `${entry.subjectType}:${entry.subjectId}`
}

export function memberEntry(
  member: OrgMember,
  permissions: AccessPermissions = NO_PERMISSIONS,
): AccessDraftEntry {
  return {
    subjectType: 'member',
    subjectId: member.userId,
    name: member.displayName,
    email: member.email,
    memberCount: null,
    permissions,
  }
}

export function groupEntry(
  group: OrgGroup,
  permissions: AccessPermissions = NO_PERMISSIONS,
): AccessDraftEntry {
  return {
    subjectType: 'group',
    subjectId: group.id,
    name: group.name,
    email: null,
    memberCount: group.memberCount,
    permissions,
  }
}

/**
 * Aplica a seleção do modal "Adicionar membro ou grupo": quem já estava na
 * matriz mantém as permissões, quem entrou começa sem nenhuma e quem saiu é
 * removido.
 */
export function applySelection(
  entries: AccessDraftEntry[],
  selection: { groups: OrgGroup[]; members: OrgMember[] },
): AccessDraftEntry[] {
  const current = new Map(entries.map((entry) => [entryKey(entry), entry]))
  const next = [
    ...selection.groups.map((group) => current.get(`group:${group.id}`) ?? groupEntry(group)),
    ...selection.members.map(
      (member) => current.get(`member:${member.userId}`) ?? memberEntry(member),
    ),
  ]
  return next
}

export function togglePermission(
  entries: AccessDraftEntry[],
  target: Pick<AccessDraftEntry, 'subjectType' | 'subjectId'>,
  key: PermissionKey,
  value: boolean,
): AccessDraftEntry[] {
  const targetKey = entryKey(target)
  return entries.map((entry) =>
    entryKey(entry) === targetKey
      ? { ...entry, permissions: { ...entry.permissions, [key]: value } }
      : entry,
  )
}

export function removeEntry(
  entries: AccessDraftEntry[],
  target: Pick<AccessDraftEntry, 'subjectType' | 'subjectId'>,
): AccessDraftEntry[] {
  const targetKey = entryKey(target)
  return entries.filter((entry) => entryKey(entry) !== targetKey)
}

export function toSetGameAccessRequest(entries: AccessDraftEntry[]): SetGameAccessRequest {
  return {
    entries: entries.map(({ subjectType, subjectId, permissions }) => ({
      subjectType,
      subjectId,
      permissions,
    })),
  }
}
