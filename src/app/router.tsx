import { createRouter } from '@tanstack/react-router'
import { queryClient } from '@/app/query-client'
import { routeTree } from '@/routeTree.gen'

export const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: 'intent',
  scrollRestoration: true,
})

// Type-safe router registration.
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

declare global {
  interface Window {
    /** DEV-only handle for E2E-driven client-side navigation. */
    __router?: typeof router
  }
}

// Exposed only in dev so the E2E smoke test can navigate without a full reload
// (which would wipe the in-memory session). Never present in production.
if (import.meta.env.DEV && typeof window !== 'undefined') {
  window.__router = router
}
