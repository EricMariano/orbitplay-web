import { QueryBoundary } from '@/components/common/QueryBoundary'
import { EmptyState } from '@/components/common/EmptyState'
import { Icon } from '@/components/icon'
import { Badge } from '@/components/ui/badge'
import {
  useGameCommunity,
  useGameReviews,
  useGameSpecs,
} from '@/features/games/api/use-player-game-details'
import { formatDecimal } from '@/lib/format'

/** Conteúdo público do jogo, compartilhado entre estúdio e jogador. */
export function GamePostsContent({ gameId }: { gameId: string }) {
  const posts = useGameCommunity(gameId)
  return (
    <section aria-label="Publicações da comunidade" className="space-y-4">
      <h2 className="text-lg font-semibold">Publicações</h2>
      <QueryBoundary
        query={posts}
        isEmpty={(page) => page.data.length === 0}
        emptyFallback={
          <EmptyState
            icon="users"
            title="A comunidade ainda está em silêncio"
            description="As publicações dos jogadores aparecerão aqui."
          />
        }
      >
        {(page) => (
          <div className="space-y-3">
            {page.data.map((post) => (
              <article
                key={post.id}
                className="rounded-xl border border-field-border/20 bg-field p-5"
              >
                <strong className="text-sm">{post.authorDisplayName}</strong>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-foreground/80">
                  {post.body}
                </p>
              </article>
            ))}
          </div>
        )}
      </QueryBoundary>
    </section>
  )
}

export function GameReviewsContent({ gameId }: { gameId: string }) {
  const reviews = useGameReviews(gameId)
  return (
    <section aria-label="Avaliações do jogo" className="space-y-4">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold">Avaliações dos jogadores</h2>
        {reviews.data?.averageRating != null && (
          <span
            className="inline-flex items-center gap-1 text-sm text-warning"
            aria-label="Nota média"
          >
            <Icon name="star" filled />
            {formatDecimal(reviews.data.averageRating)} / 5
          </span>
        )}
      </div>
      <QueryBoundary
        query={reviews}
        isEmpty={(page) => page.data.length === 0}
        emptyFallback={
          <EmptyState
            icon="star"
            title="Nenhuma avaliação ainda"
            description="As notas e os comentários dos jogadores aparecerão aqui."
          />
        }
      >
        {(page) => (
          <div className="grid gap-4 lg:grid-cols-2">
            {page.data.map((review) => (
              <article
                key={review.id}
                className="rounded-xl border border-field-border/20 bg-field p-5"
              >
                <div className="flex items-center justify-between gap-4">
                  <strong className="text-sm">{review.authorDisplayName}</strong>
                  <span className="inline-flex items-center gap-1 text-sm text-warning">
                    <Icon name="star" filled />
                    {review.rating} / 5
                  </span>
                </div>
                {review.body && (
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-foreground/80">
                    {review.body}
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
      </QueryBoundary>
    </section>
  )
}

const platformLabels: Record<string, string> = {
  windows: 'Windows',
  macos: 'macOS',
  linux: 'Linux',
  android: 'Android',
  ios: 'iOS',
  web: 'Web',
}

function RequirementList({ title, values }: { title: string; values?: Record<string, string> }) {
  return (
    <section>
      <h2 className="mb-4 text-lg font-semibold">{title}</h2>
      {values && Object.keys(values).length > 0 ? (
        <dl className="divide-y divide-field-border/20 rounded-xl border border-field-border/20 bg-field px-5">
          {Object.entries(values).map(([label, value]) => (
            <div key={label} className="grid gap-2 py-4 sm:grid-cols-2 sm:gap-6">
              <dt className="text-sm text-muted">{label}</dt>
              <dd className="text-sm text-foreground">{value}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="text-sm text-muted">Não informado.</p>
      )}
    </section>
  )
}

export function GameSpecsContent({ gameId }: { gameId: string }) {
  const specs = useGameSpecs(gameId)
  return (
    <QueryBoundary
      query={specs}
      isEmpty={(data) =>
        Object.keys(data.minimumRequirements ?? {}).length === 0 &&
        Object.keys(data.recommendedRequirements ?? {}).length === 0 &&
        !data.supportedPlatforms?.length &&
        !data.languages?.length
      }
      emptyFallback={
        <EmptyState
          icon="monitor"
          title="Especificações não informadas"
          description="Os requisitos técnicos deste jogo aparecerão aqui."
        />
      }
    >
      {(data) => (
        <div className="space-y-8">
          <div className="grid gap-8 xl:grid-cols-2">
            <RequirementList title="Requisitos mínimos" values={data.minimumRequirements} />
            <RequirementList
              title="Requisitos recomendados"
              values={data.recommendedRequirements}
            />
          </div>
          <div className="flex flex-wrap gap-10 border-t border-field-border/20 pt-6">
            <section>
              <h2 className="mb-3 text-sm font-semibold">Plataformas</h2>
              <div className="flex flex-wrap gap-2">
                {data.supportedPlatforms?.length ? (
                  data.supportedPlatforms.map((platform) => (
                    <Badge key={platform} variant="secondary">
                      {platformLabels[platform] ?? platform}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted">Não informado.</p>
                )}
              </div>
            </section>
            <section>
              <h2 className="mb-3 text-sm font-semibold">Idiomas</h2>
              <p className="text-sm text-muted">{data.languages?.join(', ') || 'Não informado.'}</p>
            </section>
          </div>
        </div>
      )}
    </QueryBoundary>
  )
}
