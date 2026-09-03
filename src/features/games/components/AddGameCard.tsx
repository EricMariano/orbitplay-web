import { Link } from '@tanstack/react-router'
import { RoleGate } from '@/components/common/RoleGate'
import { Icon } from '@/components/icon'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

/**
 * CTA tile appended to the studio's games grid. Wrapped in `RoleGate` for
 * defense in depth — the `/studio` area already requires the `studio` role.
 */
export function AddGameCard() {
  return (
    <Card className="min-h-[260px] items-center justify-center border-dashed bg-transparent text-center">
      <CardContent className="flex flex-col items-center gap-3 px-6">
        <span className="flex size-10 items-center justify-center rounded-full bg-accent text-muted">
          <Icon name="plus" className="size-5" />
        </span>
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">Novo jogo</p>
          <p className="max-w-[180px] text-xs text-muted">
            Cadastre um jogo e publique uma build para testes.
          </p>
        </div>
        <RoleGate allow="studio">
          <Button asChild variant="link" size="sm" className="h-auto p-0 text-primary">
            <Link to="/studio/games/new">Cadastrar jogo</Link>
          </Button>
        </RoleGate>
      </CardContent>
    </Card>
  )
}
