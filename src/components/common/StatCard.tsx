import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Icon } from '@/components/icon'
import { cn } from '@/lib/utils'

type StatItem = {
  label: string
  value: string
}

type StatCardProps = {
  title: string
  /** Texto de apoio abaixo do título — placeholder até o copy final existir. */
  subtitle?: string
  stats: StatItem[]
  linkLabel: string
  /** Quando a rota de destino ainda não existe no roteador, deixa vazio: renderiza texto estático em vez de link quebrado. */
  linkTo?: string
}

/** Card de estatística genérico (Tela 02, seção "Estatísticas"). Não conhece domínio — só desenha o que recebe. */
export function StatCard({ title, subtitle, stats, linkLabel, linkTo }: StatCardProps) {
  return (
    <Card className="gap-3 rounded-lg border border-white bg-stat-card-background py-4">
      {' '}
      <CardHeader className="px-4">
        <CardTitle className="text-sm font-medium text-stat-card-foreground">{title}</CardTitle>
        {subtitle ? (
          <CardDescription className="text-xs text-stat-card-muted">{subtitle}</CardDescription>
        ) : null}
        <CardAction>
          <Icon name="info" className="size-4 text-stat-card-muted" />
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-3 px-4">
        <div className="flex gap-6">
          {stats.map((stat, index) => (
            <div key={stat.label} className="flex flex-col gap-1">
              <span className="text-xs text-stat-card-muted">{stat.label}</span>
              <span
                className={cn(
                  'font-semibold text-stat-card-foreground',
                  index === stats.length - 1 ? 'text-lg' : 'text-sm',
                )}
              >
                {stat.value}
              </span>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          {linkTo ? (
            <a href={linkTo} className="text-sm text-primary hover:underline">
              {linkLabel} →
            </a>
          ) : (
            <span className="text-sm text-primary">{linkLabel} →</span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
