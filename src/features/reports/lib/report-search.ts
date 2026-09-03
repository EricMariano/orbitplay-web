export type ReportSearch = {
  testId?: string
}

/** Shared search-param parser for report routes (studio and player). */
export function parseReportSearch(search: Record<string, unknown>): ReportSearch {
  const testId = search.testId
  return { testId: typeof testId === 'string' && testId.length > 0 ? testId : undefined }
}
