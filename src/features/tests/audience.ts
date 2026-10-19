import type { AudienceRequest, PlayerTier, TestModelKey } from '@/api-types'
import type { IconName } from '@/components/icon'

/**
 * Preços por teste, em centavos. A API ainda não tem preço nem cobrança
 * (contrato: "preço e impulsionamento estão deferidos"), então o orçamento da
 * Tela 09 é calculado só aqui. Ver DECISIONS.md › "Orçamento do Novo teste".
 */
export const MODEL_PRICE_CENTS: Record<TestModelKey, number> = {
  free_exploration_telemetry: 69,
  free_exploration: 59,
  ab_test: 39,
  ab_test_images: 19,
}
export const BOOST_PRICE_CENTS = 15

export type LocationKey = 'BR' | 'US' | 'GLOBAL'

export const LOCATION_OPTIONS: { key: LocationKey; label: string }[] = [
  { key: 'BR', label: 'Brasil' },
  { key: 'US', label: 'Estados Unidos da América' },
  { key: 'GLOBAL', label: 'Global' },
]

type ChoiceOption<K extends string> = {
  key: K
  label: string
  description: string
  icon: IconName
  iconClassName: string
}

export const PLAYER_TIER_OPTIONS: (ChoiceOption<PlayerTier> & {
  /** Adicional por teste; valores além de "Experiente" (design) são provisórios. */
  extraCents: number
  priceLevel: number
})[] = [
  {
    key: 'all',
    label: 'Todos',
    description:
      'Combina diferentes perfis e estilos de jogo. Ideal para obter uma visão ampla e equilibrada da experiência geral do jogo.',
    icon: 'users',
    iconClassName: 'text-foreground-strong',
    extraCents: 10,
    priceLevel: 2,
  },
  {
    key: 'casual',
    label: 'Casual',
    description:
      'Avalia diversão, clareza e primeira impressão do jogo. Ideal para validar se o jogo é intuitivo para o público geral.',
    icon: 'user',
    iconClassName: 'text-role-badge-foreground',
    extraCents: 0,
    priceLevel: 1,
  },
  {
    key: 'experienced',
    label: 'Experiente',
    description: 'Analisa dificuldade, balanceamento e compara com outros jogos do gênero.',
    icon: 'user-check',
    iconClassName: 'text-primary',
    extraCents: 10,
    priceLevel: 2,
  },
  {
    key: 'trained',
    label: 'Tester treinado',
    description: 'Entrega feedback estruturado, claro e acionável para decisões de design e UX.',
    icon: 'graduation-cap',
    iconClassName: 'text-tint-violet-foreground',
    extraCents: 20,
    priceLevel: 3,
  },
  {
    key: 'qa',
    label: 'QA Profissionais',
    description:
      'Identifica bugs, glitches, problemas de performance e acessibilidade, com passos de reprodução.',
    icon: 'bug',
    iconClassName: 'text-destructive',
    extraCents: 35,
    priceLevel: 4,
  },
]

export type ArchetypeKey = 'all' | 'achiever' | 'explorer' | 'socializer' | 'killer'

export const ARCHETYPE_OPTIONS: ChoiceOption<ArchetypeKey>[] = [
  {
    key: 'all',
    label: 'Todos',
    description:
      'Inclui diferentes estilos de jogo para revelar padrões variados de comportamento, decisões e engajamento ao longo da experiência.',
    icon: 'users',
    iconClassName: 'text-foreground-strong',
  },
  {
    key: 'achiever',
    label: 'Conquistador',
    description:
      'Focado em progresso, metas e recompensas. Gera insights sobre pacing, economia e sistemas de progressão.',
    icon: 'mountain',
    iconClassName: 'text-foreground-strong',
  },
  {
    key: 'explorer',
    label: 'Explorador',
    description:
      'Curioso por natureza. Revela problemas de level design, orientação e áreas pouco exploradas.',
    icon: 'compass',
    iconClassName: 'text-foreground-strong',
  },
  {
    key: 'socializer',
    label: 'Socializador',
    description:
      'Atento à narrativa e interações. Avalia diálogos, personagens e engajamento emocional.',
    icon: 'message-circle',
    iconClassName: 'text-foreground-strong',
  },
  {
    key: 'killer',
    label: 'Assassino',
    description:
      'Competitivo e orientado à performance. Detecta problemas de balanceamento e frustração em desafios e PvP.',
    icon: 'skull',
    iconClassName: 'text-foreground-strong',
  },
]

/** Idade mínima do produto (DECISIONS.md da API §1.4: 18+); "99+" vira o teto aceito pela API. */
export const AGE_MIN = 18
export const AGE_MAX = 99
const AGE_MAX_OPEN = 120
export const QUANTITY_MIN = 1
export const QUANTITY_MAX = 1000

export type AudienceDraft = {
  locations: LocationKey[]
  playerTier: PlayerTier
  archetype: ArchetypeKey
  ageRange: [number, number]
  quantity: number
  keepActive: boolean
  durationDays: number
  boosted: boolean
}

export function createAudienceDraft(): AudienceDraft {
  return {
    locations: [],
    playerTier: 'all',
    archetype: 'all',
    ageRange: [AGE_MIN, AGE_MAX],
    quantity: 100,
    keepActive: false,
    durationDays: 30,
    boosted: false,
  }
}

/** "Global" cobre todas as regiões, então é exclusivo com os países. */
export function toggleLocation(locations: LocationKey[], key: LocationKey): LocationKey[] {
  if (locations.includes(key)) return locations.filter((l) => l !== key)
  if (key === 'GLOBAL') return ['GLOBAL']
  return [...locations.filter((l) => l !== 'GLOBAL'), key]
}

export function isAudienceValid(draft: AudienceDraft) {
  return (
    draft.locations.length > 0 &&
    Number.isInteger(draft.durationDays) &&
    draft.durationDays >= 1 &&
    draft.durationDays <= 365
  )
}

export type Budget = {
  baseCents: number
  tierExtraCents: number
  boostCents: number
  perTestCents: number
  /** `null` quando o teste fica ativo até ser desativado (sem quantidade fechada). */
  totalCents: number | null
}

export function computeBudget(modelKey: TestModelKey, draft: AudienceDraft): Budget {
  const baseCents = MODEL_PRICE_CENTS[modelKey]
  const tierExtraCents =
    PLAYER_TIER_OPTIONS.find((tier) => tier.key === draft.playerTier)?.extraCents ?? 0
  const boostCents = draft.boosted ? BOOST_PRICE_CENTS : 0
  const perTestCents = baseCents + tierExtraCents + boostCents
  return {
    baseCents,
    tierExtraCents,
    boostCents,
    perTestCents,
    totalCents: draft.keepActive ? null : perTestCents * draft.quantity,
  }
}

export function toAudienceRequest(draft: AudienceDraft): AudienceRequest {
  const [ageMin, ageMax] = draft.ageRange
  return {
    locations: draft.locations,
    archetypes: draft.archetype === 'all' ? [] : [draft.archetype],
    ageMin,
    ageMax: ageMax >= AGE_MAX ? AGE_MAX_OPEN : ageMax,
    quantity: draft.quantity,
    durationDays: draft.durationDays,
    keepActive: draft.keepActive,
    playerTier: draft.playerTier,
    boosted: draft.boosted,
  }
}

export function formatCents(cents: number) {
  return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
