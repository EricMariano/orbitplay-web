import type {
  AgeRating,
  CreateGameRequest,
  DevelopmentStage,
  GameAssetKind,
  GameMode,
  Platform,
} from '@/api-types'
import { PLATFORM_LABELS } from '@/features/tests/build-upload'

/** Limites espelhando `CreateGameDto` (orbitplay-api); a validação final é da API. */
export const TITLE_MAX = 200
export const TAGLINE_MAX = 200
export const DESCRIPTION_MAX = 500
export const GENRES_MAX = 5
export const SUBGENRES_MAX = 8

export const GENRE_SUGGESTIONS = [
  'Action',
  'Adventure',
  'RPG',
  'Strategy',
  'Simulation',
  'Sports',
  'Racing',
  'Fighting',
  'Shooter',
  'Platformer',
  'Puzzle',
  'Card Game',
  'Board Game',
  'Horror',
  'Survival',
  'Rhythm',
  'Party',
  'Casual',
  'Educational',
  'Visual Novel',
  'Sandbox',
  'MMO',
  'MOBA',
  'Battle Royale',
  'Stealth',
  'Roguelike',
  'Roguelite',
  'Tower Defense',
  'Auto Battler',
  'Idle',
  'Management',
  'Tycoon',
  'Life Sim',
  'Music Game',
  'Trivia',
  'Arcade',
  'Tactical',
  'Extraction',
  'Soulslike',
]

export const SUBGENRE_SUGGESTIONS = [
  'Action RPG',
  'JRPG',
  'CRPG',
  'MMORPG',
  'Hack and Slash',
  "Beat 'em Up",
  "Shoot 'em Up",
  'Bullet Hell',
  'Twin-Stick Shooter',
  'Hero Shooter',
  'Tactical Shooter',
  'Arena Shooter',
  'Extraction Shooter',
  'Survival Horror',
  'Psychological Horror',
  'Dungeon Crawler',
  'Metroidvania',
  'Point-and-Click',
  'Narrative Adventure',
  'Precision Platformer',
  'Real-Time Strategy',
  'Turn-Based Strategy',
  '4X',
  'Grand Strategy',
  'Tactical Strategy',
  'Social Deduction',
  'Party Game',
  'Cozy',
  'City Builder',
  'Colony Management',
  'Sports Management',
  'Kart Racing',
  'Sim Racing',
  'Collectible Card Game',
  'Interactive Fiction',
  'Immersive Sim',
  'Open World',
  'Co-op',
  'Local Multiplayer',
  'Competitive',
]

export const PLATFORM_OPTIONS = (Object.keys(PLATFORM_LABELS) as Platform[]).map((value) => ({
  value,
  label: PLATFORM_LABELS[value],
}))

export const GAME_MODE_OPTIONS: { value: GameMode; label: string }[] = [
  { value: 'singleplayer', label: 'Single player' },
  { value: 'local_multiplayer', label: 'Multiplayer local' },
  { value: 'online_multiplayer', label: 'Multiplayer online' },
  { value: 'coop', label: 'Cooperativo' },
  { value: 'competitive', label: 'Competitivo' },
]

export const ENGINE_OPTIONS = [
  'Unity',
  'Unreal Engine',
  'Godot',
  'GameMaker',
  'Construct',
  'RPG Maker',
  'Defold',
  'Cocos',
  'Proprietária',
  'Outra',
].map((value) => ({ value, label: value }))

export const DEVELOPMENT_STAGE_OPTIONS: { value: DevelopmentStage; label: string }[] = [
  { value: 'concept', label: 'Conceito' },
  { value: 'prototype', label: 'Protótipo' },
  { value: 'alpha', label: 'Alpha' },
  { value: 'beta', label: 'Beta' },
  { value: 'released', label: 'Lançado' },
]

export const AGE_RATING_OPTIONS: { value: AgeRating; label: string }[] = [
  { value: 'L', label: 'Livre' },
  { value: '10', label: '10 anos' },
  { value: '12', label: '12 anos' },
  { value: '14', label: '14 anos' },
  { value: '16', label: '16 anos' },
  { value: '18', label: '18 anos' },
]

export const LANGUAGE_OPTIONS = [
  { value: 'pt-BR', label: 'Português (Brasil)' },
  { value: 'en', label: 'Inglês' },
  { value: 'es', label: 'Espanhol' },
  { value: 'fr', label: 'Francês' },
  { value: 'de', label: 'Alemão' },
  { value: 'it', label: 'Italiano' },
  { value: 'ja', label: 'Japonês' },
  { value: 'ko', label: 'Coreano' },
  { value: 'zh', label: 'Chinês' },
  { value: 'ru', label: 'Russo' },
]

/** Imagens do passo "Imagens e mídias" e o tipo de asset da API que cada uma vira. */
export const IMAGE_SLOTS: {
  kind: Extract<GameAssetKind, 'cover' | 'logo' | 'icon'>
  label: string
  hint: string
}[] = [
  {
    kind: 'cover',
    label: 'Imagem de capa',
    hint: 'Imagem principal utilizada nos cards e página do projeto. 16:9',
  },
  { kind: 'logo', label: 'Logo', hint: 'Preferencialmente PNG com fundo transparente.' },
  {
    kind: 'icon',
    label: 'Ícone / thumbnail',
    hint: 'Imagem quadrada utilizada em menus, listas e dashboards.',
  },
]

export type ImageSlotKind = (typeof IMAGE_SLOTS)[number]['kind']
export type NewGameImages = Partial<Record<ImageSlotKind, File>>

export const ACCEPTED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp']
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024

/** `null` quando o arquivo serve; senão o motivo, já em português. */
export function validateImageFile(file: File): string | null {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) return 'Use uma imagem PNG, JPG ou WebP.'
  if (file.size < 1) return 'O arquivo está vazio.'
  if (file.size > MAX_IMAGE_BYTES) return 'A imagem deve ter no máximo 5 MB.'
  return null
}

export type NewGameDraft = {
  title: string
  tagline: string
  description: string
  genres: string[]
  subgenres: string[]
  platforms: Platform[]
  gameModes: GameMode[]
  engine: string
  developmentStage: DevelopmentStage | ''
  ageRating: AgeRating | ''
  languages: string[]
  trailerUrl: string
}

export function createNewGameDraft(): NewGameDraft {
  return {
    title: '',
    tagline: '',
    description: '',
    genres: [],
    subgenres: [],
    platforms: [],
    gameModes: [],
    engine: '',
    developmentStage: '',
    ageRating: '',
    languages: [],
    trailerUrl: '',
  }
}

export type DraftErrors = Partial<Record<keyof NewGameDraft, string>>

const INFO_FIELDS: (keyof NewGameDraft)[] = [
  'title',
  'tagline',
  'description',
  'genres',
  'subgenres',
  'platforms',
  'gameModes',
  'engine',
  'developmentStage',
  'ageRating',
  'languages',
]

/** Passo 1 — "Informações gerais": título e ao menos um gênero são obrigatórios. */
export function validateInfo(draft: NewGameDraft): DraftErrors {
  const errors: DraftErrors = {}
  const title = draft.title.trim()
  if (!title) errors.title = 'Informe o nome do jogo'
  else if (title.length > TITLE_MAX) errors.title = `Use até ${TITLE_MAX} caracteres`
  if (draft.tagline.trim().length > TAGLINE_MAX) {
    errors.tagline = `Use até ${TAGLINE_MAX} caracteres`
  }
  if (draft.description.trim().length > DESCRIPTION_MAX) {
    errors.description = `Use até ${DESCRIPTION_MAX} caracteres`
  }
  if (draft.genres.length === 0) errors.genres = 'Escolha ao menos um gênero'
  return errors
}

/** Passo 2 — "Imagens e mídias": o trailer é opcional, mas precisa ser uma URL http(s). */
export function validateMedia(draft: NewGameDraft): DraftErrors {
  const url = draft.trailerUrl.trim()
  if (url && !isHttpUrl(url)) return { trailerUrl: 'Informe uma URL válida (http ou https)' }
  return {}
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export function hasErrors(errors: DraftErrors): boolean {
  return Object.keys(errors).length > 0
}

/** Monta o corpo de `POST /games` omitindo o que ficou em branco. */
export function toCreateGameRequest(draft: NewGameDraft): CreateGameRequest {
  const text = (value: string) => value.trim() || undefined
  const list = <T>(values: T[]) => (values.length > 0 ? values : undefined)
  return {
    title: draft.title.trim(),
    tagline: text(draft.tagline),
    description: text(draft.description),
    genres: list(draft.genres),
    subgenres: list(draft.subgenres),
    supportedPlatforms: list(draft.platforms),
    gameModes: list(draft.gameModes),
    engine: text(draft.engine),
    developmentStage: draft.developmentStage || undefined,
    ageRating: draft.ageRating || undefined,
    languages: list(draft.languages),
    trailerUrl: text(draft.trailerUrl),
  }
}

/** Chave da API (`supportedPlatforms.0`) → campo do rascunho (`platforms`). */
const API_FIELD_TO_DRAFT: Record<string, keyof NewGameDraft> = {
  supportedPlatforms: 'platforms',
}

/** Converte `fieldErrors` da API em erros por campo do rascunho; ignora chaves desconhecidas. */
export function mapApiFieldErrors(fieldErrors: Record<string, string> | undefined): DraftErrors {
  const errors: DraftErrors = {}
  for (const [path, message] of Object.entries(fieldErrors ?? {})) {
    const root = path.split('.')[0] ?? path
    const field = API_FIELD_TO_DRAFT[root] ?? (root as keyof NewGameDraft)
    if (field in createNewGameDraft() && !errors[field]) errors[field] = message
  }
  return errors
}

/** Passo (0 = informações, 1 = mídias) que contém o primeiro erro, ou `null` se não houver. */
export function firstStepWithError(errors: DraftErrors): 0 | 1 | null {
  if (INFO_FIELDS.some((field) => errors[field])) return 0
  if (errors.trailerUrl) return 1
  return null
}
