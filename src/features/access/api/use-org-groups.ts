import { useQuery } from '@tanstack/react-query'
import type { OrgGroupList } from '@/api-types'
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
