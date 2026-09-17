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
