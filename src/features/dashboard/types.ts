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
}
