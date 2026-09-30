import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import type {
  Achievement,
  CommunityPostList,
  GameSpecs,
  Participation,
  PlayerAchievementList,
  PlayerGameDetails,
  PlayerTestList,
  ReviewList,
} from '../player-game-types'
import { gamesKeys } from './games-keys'
import { isGameId } from '../game-details-utils'

type CursorPage<T> = { data: T[]; nextCursor: string | null; averageRating?: number | null }

async function allPages<T>(path: string, signal: AbortSignal): Promise<CursorPage<T>> {
  const data: T[] = []
  const visited = new Set<string>()
  let cursor: string | null = null
  let averageRating: number | null | undefined
  do {
    const params = new URLSearchParams({ limit: '100' })
    if (cursor) params.set('cursor', cursor)
    const page: CursorPage<T> = await api.get(`${path}?${params}`, { signal })
    data.push(...page.data)
    averageRating ??= page.averageRating
    cursor = page.nextCursor
    if (cursor && visited.has(cursor)) throw new Error('Repeated pagination cursor')
    if (cursor) visited.add(cursor)
  } while (cursor)
  return { data, nextCursor: null, averageRating }
}

const gamePath = (gameId: string) => encodeURIComponent(gameId)

export function usePlayerGameDetails(gameId: string) {
  return useQuery({
    queryKey: gamesKeys.playerDetail(gameId),
    queryFn: () => api.get<PlayerGameDetails>(`/player/games/${gamePath(gameId)}`),
    enabled: isGameId(gameId),
  })
}

export function usePlayerGameTests(gameId: string, enabled = true) {
  return useQuery({
    queryKey: gamesKeys.playerTests(gameId),
    queryFn: ({ signal }) =>
      allPages<PlayerTestList['data'][number]>(`/player/games/${gamePath(gameId)}/tests`, signal),
    enabled: isGameId(gameId) && enabled,
  })
}

export function useMyGameTests(gameId: string, enabled = true) {
  return useQuery({
    queryKey: [...gamesKeys.playerTests(gameId), 'mine'],
    queryFn: async ({ signal }): Promise<PlayerTestList> => {
      const participations = await allPages<Participation>('/player/participations', signal)
      const rows: PlayerTestList['data'] = []
      for (const participation of participations.data) {
        if (participation.gameId && participation.gameId !== gameId) continue
        const test = await api.get<PlayerTestList['data'][number]>(
          `/player/tests/${encodeURIComponent(participation.testId)}`,
          { signal },
        )
        if (test.gameId === gameId) rows.push({ ...test, participation })
      }
      return { data: rows, nextCursor: null }
    },
    enabled: isGameId(gameId) && enabled,
  })
}

export function useGameAchievements(gameId: string, enabled = true) {
  return useQuery({
    queryKey: gamesKeys.achievements(gameId),
    queryFn: () => api.get<{ data: Achievement[] }>(`/games/${gamePath(gameId)}/achievements`),
    enabled: Boolean(gameId) && enabled,
  })
}

export function usePlayerAchievements(enabled = true) {
  return useQuery({
    queryKey: ['player', 'achievements'],
    queryFn: ({ signal }) =>
      allPages<PlayerAchievementList['data'][number]>('/player/achievements', signal),
    enabled,
  })
}

export function useGameCommunity(gameId: string, enabled = true) {
  return useQuery({
    queryKey: gamesKeys.community(gameId),
    queryFn: ({ signal }) =>
      allPages<CommunityPostList['data'][number]>(
        `/games/${gamePath(gameId)}/community/posts`,
        signal,
      ),
    enabled: Boolean(gameId) && enabled,
  })
}

export function useGameReviews(gameId: string, enabled = true) {
  return useQuery({
    queryKey: gamesKeys.reviews(gameId),
    queryFn: ({ signal }) =>
      allPages<ReviewList['data'][number]>(`/games/${gamePath(gameId)}/reviews`, signal),
    enabled: Boolean(gameId) && enabled,
  })
}

export function useGameSpecs(gameId: string, enabled = true) {
  return useQuery({
    queryKey: gamesKeys.specs(gameId),
    queryFn: () => api.get<GameSpecs>(`/games/${gamePath(gameId)}/specs`),
    enabled: Boolean(gameId) && enabled,
  })
}

export function useJoinTest(gameId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (testId: string) =>
      api.post<Participation>(
        `/player/tests/${encodeURIComponent(testId)}/participations`,
        undefined,
        {
          headers: { 'Idempotency-Key': crypto.randomUUID() },
        },
      ),
    onSettled: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: gamesKeys.playerTests(gameId) }),
        queryClient.invalidateQueries({ queryKey: gamesKeys.playerDetail(gameId) }),
        queryClient.invalidateQueries({ queryKey: ['player', 'test'] }),
      ])
    },
  })
}
