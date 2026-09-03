import { describe, expect, it } from 'vitest'
import { getOpportunityStatusPresentation } from './opportunity-status'

describe('getOpportunityStatusPresentation', () => {
  it('maps every backend status to a PT-BR label and a badge tone', () => {
    expect(getOpportunityStatusPresentation('open')).toEqual({
      label: 'Aberta',
      tone: 'success',
    })
    expect(getOpportunityStatusPresentation('in_progress')).toEqual({
      label: 'Em andamento',
      tone: 'info',
    })
    expect(getOpportunityStatusPresentation('closed')).toEqual({
      label: 'Encerrada',
      tone: 'muted',
    })
  })
})
