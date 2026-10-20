import { describe, expect, it } from 'vitest'
import type { OrgGroup, OrgMember } from '@/api-types'
import {
  ALL_PERMISSIONS,
  NO_PERMISSIONS,
  applySelection,
  groupEntry,
  isEligibleMember,
  memberEntry,
  removeEntry,
  toSetGameAccessRequest,
  togglePermission,
} from './access-draft'

const ana: OrgMember = {
  userId: 'u-ana',
  email: 'ana@studio.dev',
  displayName: 'Ana',
  role: 'studio',
  status: 'active',
}
const bia: OrgMember = { ...ana, userId: 'u-bia', email: 'bia@studio.dev', displayName: 'Bia' }
const qa: OrgGroup = {
  id: 'g-qa',
  name: 'QA',
  memberCount: 2,
  memberUserIds: ['u-ana', 'u-bia'],
  createdAt: '2026-01-01T00:00:00.000Z',
}

describe('access-draft', () => {
  it('only lets active studio-role members receive permissions', () => {
    expect(isEligibleMember(ana)).toBe(true)
    expect(isEligibleMember({ ...ana, role: 'player' })).toBe(false)
    expect(isEligibleMember({ ...ana, status: 'disabled' })).toBe(false)
    expect(isEligibleMember({ ...ana, status: 'invited' })).toBe(true)
  })

  it('keeps permissions of entries that stay selected and starts new ones empty', () => {
    const entries = [memberEntry(ana, ALL_PERMISSIONS)]
    const next = applySelection(entries, { groups: [qa], members: [ana, bia] })

    expect(next.map((e) => `${e.subjectType}:${e.subjectId}`)).toEqual([
      'group:g-qa',
      'member:u-ana',
      'member:u-bia',
    ])
    expect(next.map((e) => e.permissions)).toEqual([
      NO_PERMISSIONS,
      ALL_PERMISSIONS,
      NO_PERMISSIONS,
    ])
  })

  it('drops entries that were unselected', () => {
    const entries = [memberEntry(ana), groupEntry(qa)]
    expect(applySelection(entries, { groups: [], members: [ana] })).toHaveLength(1)
  })

  it('toggles one permission of one entry without touching the others', () => {
    const first = memberEntry(ana)
    const next = togglePermission([first, memberEntry(bia)], first, 'viewReports', true)
    expect(next.map((e) => e.permissions.viewReports)).toEqual([true, false])
  })

  it('removes an entry and serializes only what the API accepts', () => {
    const member = memberEntry(ana)
    const entries = [groupEntry(qa, ALL_PERMISSIONS), member]
    expect(removeEntry(entries, member)).toHaveLength(1)
    expect(toSetGameAccessRequest(entries)).toEqual({
      entries: [
        { subjectType: 'group', subjectId: 'g-qa', permissions: ALL_PERMISSIONS },
        { subjectType: 'member', subjectId: 'u-ana', permissions: NO_PERMISSIONS },
      ],
    })
  })
})
