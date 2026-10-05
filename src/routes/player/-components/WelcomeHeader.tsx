import { QueryBoundary } from '@/components/common/QueryBoundary'
import { Icon, type IconName } from '@/components/icon'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { usePlayerProgress } from '@/features/player/api/use-player-progress'
import { useAuthStore } from '@/lib/auth'

export function WelcomeHeader() {
  const user = useAuthStore((s) => s.user)
  const progress = usePlayerProgress()

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-5 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-xl font-semibold text-foreground">
            Bem-vindo <span className="text-primary">{user?.displayName ?? ''}</span>
          </h1>
          {progress.data ? <Badge>{progress.data.xp} XP</Badge> : null}
        </div>
        <QueryBoundary query={progress} loadingFallback={<Skeleton className="mt-3 h-10 w-72" />}>
          {(data) => (
            <div className="mt-3 flex flex-wrap gap-6">
              <Stat icon="trending-up" label="Nível" value={String(data.level)} />
              <Stat
                icon="users"
                label="Qualidade de Feedback"
                value={data.feedbackQuality.toFixed(1)}
              />
              <Stat icon="trophy" label="Conquistas" value={String(data.achievementsUnlocked)} />
              <Stat icon="clock" label="Horas jogadas" value={String(data.hoursPlayed)} />
            </div>
          )}
        </QueryBoundary>
      </div>

      {/* Saldo depende de /wallet, que a API ainda não expõe. */}
      <div className="flex items-center justify-between gap-6 rounded-xl border border-border bg-surface-raised px-5 py-3">
        <div>
          <p className="flex items-center gap-1.5 text-sm text-muted">
            <Icon name="wallet" className="size-4" /> Minha carteira
          </p>
          <p className="text-sm text-muted">Disponível em breve</p>
        </div>
        <Button size="lg" disabled>
          Sacar!
        </Button>
      </div>
    </div>
  )
}

function Stat({ icon, label, value }: { icon: IconName; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex size-8 items-center justify-center rounded-full bg-surface-raised text-muted">
        <Icon name={icon} className="size-4" />
      </span>
      <div>
        <p className="text-xs text-muted">{label}</p>
        <p className="text-sm font-semibold text-foreground">{value}</p>
      </div>
    </div>
  )
}
