import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type {
  AuditLogEntry,
  AuditLogList,
  ChangeMemberRoleRequest,
  ChangeMemberStatusRequest,
  InviteMemberRequest,
  OrgMember,
  OrgMemberList,
} from '@/api-types'
import { api } from '@/lib/api-client'
import { accessKeys } from './access-keys'

/** Membros da organização (`GET /orgs/members`), percorrendo todas as páginas do cursor. */
export function useOrgMembers(enabled = true) {
  return useQuery({
    queryKey: accessKeys.members(),
    enabled,
    queryFn: async ({ signal }) => {
      const members: OrgMember[] = []
      const visited = new Set<string>()
      let cursor: string | null = null
      do {
        const params = new URLSearchParams({ limit: '100' })
        if (cursor) params.set('cursor', cursor)
        const page: OrgMemberList = await api.get(`/orgs/members?${params}`, { signal })
        members.push(...page.data)
        cursor = page.nextCursor
        if (cursor && visited.has(cursor)) throw new Error('Repeated pagination cursor')
        if (cursor) visited.add(cursor)
      } while (cursor)
      return members
    },
  })
}

/** Ações administrativas da Tela 20. Cada sucesso atualiza a lista compartilhada de membros. */
export function useInviteOrgMember() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: InviteMemberRequest) =>
      api.post<OrgMember>('/orgs/members/invite', payload),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: accessKeys.members() }),
  })
}

export function useChangeOrgMemberRole(userId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: ChangeMemberRoleRequest) =>
      api.patch<OrgMember>(`/orgs/members/${encodeURIComponent(userId)}/role`, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: accessKeys.members() })
      void queryClient.invalidateQueries({ queryKey: accessKeys.auditLogs() })
    },
  })
}

export function useChangeOrgMemberStatus(userId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: ChangeMemberStatusRequest) =>
      api.patch<OrgMember>(`/orgs/members/${encodeURIComponent(userId)}/status`, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: accessKeys.members() })
      void queryClient.invalidateQueries({ queryKey: accessKeys.auditLogs() })
    },
  })
}

export function useRemoveOrgMember() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (userId: string) => api.delete<void>(`/orgs/members/${encodeURIComponent(userId)}`),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: accessKeys.members() })
      void queryClient.invalidateQueries({ queryKey: accessKeys.auditLogs() })
    },
  })
}

export function useTriggerMemberPasswordReset() {
  return useMutation({
    mutationFn: (userId: string) =>
      api.post<void>(`/orgs/members/${encodeURIComponent(userId)}/password-reset`),
  })
}

/** Histórico completo da organização, paginado pelo cursor exposto pela API. */
export function useAuditLogs(enabled = true) {
  return useQuery({
    queryKey: accessKeys.auditLogs(),
    enabled,
    queryFn: async ({ signal }) => {
      const entries: AuditLogEntry[] = []
      const visited = new Set<string>()
      let cursor: string | null = null
      do {
        const params = new URLSearchParams({ limit: '100' })
        if (cursor) params.set('cursor', cursor)
        const page: AuditLogList = await api.get(`/audit-logs?${params}`, { signal })
        entries.push(...page.data)
        cursor = page.nextCursor
        if (cursor && visited.has(cursor)) throw new Error('Repeated pagination cursor')
        if (cursor) visited.add(cursor)
      } while (cursor)
      return entries
    },
  })
}
