import { Link } from '@tanstack/react-router'
import { Icon } from '@/components/icon'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

/**
 * CTA tile appended to the player's library grid, inviting them to look
 * for more titles on the home/opportunities screen.
 */
export function RequestAccessCard() {
  return (
    <Card className="min-h-[260px] items-center justify-center border-dashed bg-transparent text-center">
      <CardContent className="flex flex-col items-center gap-3 px-6">
        <span className="flex size-10 items-center justify-center rounded-full bg-accent text-muted">
          <Icon name="plus" className="size-5" />
        </span>
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">Testar mais jogos</p>
          <p className="max-w-[180px] text-xs text-muted">
            Solicite acesso a novos títulos disponíveis para teste.
          </p>
        </div>
        <Button asChild variant="link" size="sm" className="h-auto p-0 text-primary">
          <Link to="/player">Solicitar acesso</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
