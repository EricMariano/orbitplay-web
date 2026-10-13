import type {
  InsightCategory,
  PlayerArchetype,
  PlayerProfileTier,
  ReportBlockKey,
  ReportBlockOf,
  Test,
  TestReport,
} from '@/api-types'
import type { TagTone } from '@/components/common/TagTones'
import { ARCHETYPE_OPTIONS, PLAYER_TIER_OPTIONS } from '@/features/tests/audience'

/** Perfil que o jogador ainda não preencheu (`unknown` no relatório). */
export const UNKNOWN_PROFILE_LABEL = 'Não informado'

type Labeled = { label: string; tone: TagTone }

/** Mesmos rótulos do critério de público (Tela 09) — um vocabulário só. */
function labelFrom<K extends string>(options: { key: string; label: string }[], key: K): string {
  return options.find((option) => option.key === key)?.label ?? key
}

const ARCHETYPE_TONES: Record<PlayerArchetype, TagTone> = {
  achiever: 'teal',
  explorer: 'yellow',
  socializer: 'violet',
  killer: 'red',
}

const TIER_TONES: Record<PlayerProfileTier, TagTone> = {
  casual: 'orange',
  experienced: 'blue',
  trained: 'violet',
  qa: 'red',
}

export function archetypeView(key: PlayerArchetype): Labeled {
  return { label: labelFrom(ARCHETYPE_OPTIONS, key), tone: ARCHETYPE_TONES[key] }
}

export function playerTierView(key: PlayerProfileTier): Labeled {
  return { label: labelFrom(PLAYER_TIER_OPTIONS, key), tone: TIER_TONES[key] }
}

export const INSIGHT_CATEGORIES: ({ key: InsightCategory } & Labeled)[] = [
  { key: 'ux_ui', label: 'UX & UI', tone: 'orange' },
  { key: 'bugs_accessibility', label: 'Bugs & Acessibilidade', tone: 'yellow' },
  { key: 'fun', label: 'Diversão', tone: 'blue' },
  { key: 'narrative_social', label: 'Narrativa & Social', tone: 'teal' },
]

export const TEST_STATUS: Record<Test['status'], Labeled> = {
  draft: { label: 'Rascunho', tone: 'violet' },
  published: { label: 'Em andamento', tone: 'blue' },
  paused: { label: 'Pausado', tone: 'orange' },
  finished: { label: 'Finalizado', tone: 'green' },
  expired: { label: 'Expirado', tone: 'red' },
}

/** Bloco do relatório pela chave, já com o payload tipado. */
export function findBlock<K extends ReportBlockKey>(
  report: TestReport,
  key: K,
): ReportBlockOf<K> | undefined {
  return report.blocks.find((block): block is ReportBlockOf<K> => block.key === key)
}
