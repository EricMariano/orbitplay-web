import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type {
  CreateOrgGroupRequest,
  OrgGroup,
  OrgGroupList,
  UpdateOrgGroupRequest,
} from '@/api-types'
import { api } from '@/lib/api-client'
import { accessKeys } from './access-keys'

/** Grupos de membros da organização (`GET /orgs/groups`). */
export function useOrgGroups(enabled = true) {
  return useQuery({
    queryKey: accessKeys.groups(),
    enabled,
    queryFn: async ({ signal }) => {
      const list: OrgGroupList = await api.get('/orgs/groups', { signal })
      return list.data
    },
  })
}

export function useCreateOrgGroup() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateOrgGroupRequest) => api.post<OrgGroup>('/orgs/groups', payload),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: accessKeys.groups() }),
  })
}

export function useUpdateOrgGroup(groupId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdateOrgGroupRequest) =>
      api.patch<OrgGroup>(`/orgs/groups/${encodeURIComponent(groupId)}`, payload),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: accessKeys.groups() }),
  })
}

export function useDeleteOrgGroup() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (groupId: string) =>
      api.delete<void>(`/orgs/groups/${encodeURIComponent(groupId)}`),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: accessKeys.groups() }),
  })
}
