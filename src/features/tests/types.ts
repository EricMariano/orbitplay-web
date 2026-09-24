export type RecentTestStatus = 'in_progress' | 'completed' | 'generating_insights'

/**
 * Linha da tabela "Testes recentes" (Tela 02 / Tela 05). Endpoint ainda não
 * existe no contrato — mover para src/api-types quando o backend expuser
 * `/tests/recent` (paginado).
 */
export type RecentTest = {
  id: string
  gameTitle: string
  testName: string
  testType: string
  status: RecentTestStatus
  startDate: string
  endDate: string | null
  hasOrbitPlugin: boolean
}

export type PaginatedRecentTests = {
  items: RecentTest[]
  page: number
  pageSize: number
  totalCount: number
}

export type TestModelKey =
  'free_exploration_telemetry' | 'free_exploration' | 'ab_test' | 'ab_test_images'

/**
 * Modelo de teste real da API (`GET /test-models`). O tipo `TestModel`
 * genérico em src/api-types ainda está desatualizado (contrato antigo) — usa
 * este até rodar `pnpm gen:api` de novo com a API no ar; depois disso, troca
 * pelo tipo gerado de verdade e apaga esta definição manual.
 */
export type TestModelView = {
  key: TestModelKey
  name: string
  description: string
  deliverables: string[]
  technicalRequirements: string[]
  requiresTelemetry: boolean
  available: boolean
  unavailableReason: string | null
}

/**
 * Preço não existe no catálogo do backend (é dado comercial, não de produto)
 * — decorado localmente até existir um campo oficial. Ver DECISIONS.md.
 */
export type TestModelOption = TestModelView & {
  priceCents: number
}

export type QuestionType = 'short_answer' | 'single_choice' | 'multiple_choice' | 'linear_scale'

export type QuestionOption = {
  id: string
  label: string
}

/**
 * Uma pergunta do formulário de avaliação (Tela 07). Estado 100% local até
 * o teste inteiro ser submetido na Etapa 5 — não existe endpoint pra isso.
 */
export type TestFormQuestion = {
  id: string
  type: QuestionType
  prompt: string
  required: boolean
  options: QuestionOption[] // usado só em single_choice / multiple_choice
  scaleMin: number
  scaleMax: number
  scaleMinLabel: string
  scaleMaxLabel: string
}
