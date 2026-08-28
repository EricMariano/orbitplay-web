import { QueryClient } from '@tanstack/react-query'
import { ApiError } from '@/lib/api-client'

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
