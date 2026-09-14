import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/lib/auth'
import { PlayerTopNav } from './player/-components/PlayerTopNav'

export const Route = createFileRoute('/player')({
  beforeLoad: () => {
    const { status, role } = useAuthStore.getState()
    if (status !== 'authenticated') {
      throw redirect({ to: '/login' })
    }
    if (role !== 'player') {
      throw redirect({ to: '/studio' })
    }
  },
  component: PlayerLayout,
})

function PlayerLayout() {
  return (
    <div className="min-h-dvh">
      <PlayerTopNav />
      <main className="mx-auto w-full max-w-[1920px] px-[clamp(2rem,3.333vw,4rem)] py-6">
        <Outlet />
      </main>
    </div>
  )
}
