import { QueryClient } from '@tanstack/react-query'
import { ApiError } from '@/lib/api-client'
import { useAuthStore } from '@/lib/auth'

/** Single TanStack Query configuration for the app. */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        // Never retry client errors (4xx) — they won't succeed on retry.
        if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
          return false
        }
        return failureCount < 1
      },
    },
  },
})

// Queries use feature keys, so cached data must never survive an account/org change.
useAuthStore.subscribe((state, previous) => {
  if (
    state.revision !== previous.revision ||
    state.user?.id !== previous.user?.id ||
    state.user?.organizationId !== previous.user?.organizationId ||
    state.role !== previous.role
  ) {
    queryClient.clear()
  }
})
