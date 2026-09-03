import { describe, expect, it } from 'vitest'
import { parseReportSearch } from './report-search'

describe('parseReportSearch', () => {
  it('reads a non-empty testId', () => {
    expect(parseReportSearch({ testId: 'abc' })).toEqual({ testId: 'abc' })
  })

  it('drops empty or non-string testId', () => {
    expect(parseReportSearch({})).toEqual({ testId: undefined })
    expect(parseReportSearch({ testId: '' })).toEqual({ testId: undefined })
    expect(parseReportSearch({ testId: 1 })).toEqual({ testId: undefined })
  })
})
