import type { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { initializeSession } from '@/lib/api-client'

type RouterContext = {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: initializeSession,
  component: RootLayout,
})

function RootLayout() {
  return (
    <div className="min-h-dvh text-foreground">
      <Outlet />
    </div>
  )
}
