/** Centralized query keys for the access (groups, members and per-game permissions) feature. */
export const accessKeys = {
  all: ['access'] as const,
  members: () => [...accessKeys.all, 'members'] as const,
  groups: () => [...accessKeys.all, 'groups'] as const,
  game: (gameId: string) => [...accessKeys.all, 'game', gameId] as const,
}
