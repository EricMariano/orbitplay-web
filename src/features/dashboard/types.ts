/**
 * KPIs gerais do estúdio (Tela 02 — bloco "Bem-vindo").
 * Provisório: este shape ainda não existe em src/api-types/generated.ts
 * porque o endpoint não foi adicionado ao contrato da API. Mover para lá
 * assim que o backend expuser `/studio/summary`.
 */
export type StudioSummary = {
  gamesTestedCount: number
  testsCompletedCount: number
  gameplayHoursTested: number
  averageTestScore: number
  /** 0 a 1 — ex.: 0.78 = 78% */
  averageEngagementRate: number
  aiInsightsGeneratedCount: number
  testsWithActivePluginCount: number
  // ---- Card "Visão geral" ----
  activeTestsCount: number
  activeTestersCount: number
  testsPerHour: number
  // ---- Card "Fatores chave" ----
  funFactorScore: number
  bugsAndGlitchesCount: number
  /** 0 a 1 — ex.: 0.71 = 71% */
  retentionRate: number
  // ---- Card "Plug-in telemetria" ----
  telemetryActivePointsCount: number
  telemetryTriggersCount: number
}
export type BenchmarkStatus = 'start' | 'continue' | 'complete'

/**
 * Uma linha do card "Benchmark de mercado" (Tela 02). Endpoint ainda não
 * existe no contrato — mover para src/api-types quando o backend expuser
 * `/studio/benchmark`.
 */
export type BenchmarkEntry = {
  id: string
  gameTitle: string
  progressPercent: number
  priceDeltaCents: number
  status: BenchmarkStatus
}
