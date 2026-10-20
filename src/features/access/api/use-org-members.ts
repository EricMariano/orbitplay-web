import { useQuery } from '@tanstack/react-query'
import type { OrgMember, OrgMemberList } from '@/api-types'
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
