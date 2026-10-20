import { Link } from '@tanstack/react-router'
import { Icon } from '@/components/icon'
import { Button } from '@/components/ui/button'

type NewGameCreatedProps = {
  gameId: string
  title: string
}

/** Wizard "Novo jogo", confirmação final (Tela 04). */
export function NewGameCreated({ gameId, title }: NewGameCreatedProps) {
  return (
    <div className="flex flex-col items-center gap-3 py-6 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-success text-foreground-strong">
        <Icon name="check" className="size-7" />
      </span>
      <h2 className="text-2xl font-bold text-foreground-strong">Jogo criado com sucesso!</h2>
      <p className="text-base text-foreground-strong">“{title}” foi adicionado ao seu estúdio.</p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-6">
        <Link
          to="/studio/games/$gameId"
          params={{ gameId }}
          className="flex items-center gap-1 text-base font-bold text-primary hover:opacity-80"
        >
          Ir para o jogo
          <Icon name="eye" className="size-5" />
        </Link>
        <Button
          asChild
          size="lg"
          className="h-12 bg-gradient-to-br from-cta-configure-from to-cta-configure-to px-8 text-base font-bold"
        >
          <Link to="/studio">
            Voltar para a Home
            <Icon name="home" className="size-5" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
