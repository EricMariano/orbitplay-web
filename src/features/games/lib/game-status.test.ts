import { describe, expect, it } from 'vitest'
import { getGameStatusPresentation } from './game-status'

describe('getGameStatusPresentation', () => {
  it('maps every backend status to a PT-BR label and a badge tone', () => {
    expect(getGameStatusPresentation('draft')).toEqual({ label: 'Rascunho', tone: 'muted' })
    expect(getGameStatusPresentation('in_review')).toEqual({
      label: 'Em revisão',
      tone: 'warning',
    })
    expect(getGameStatusPresentation('published')).toEqual({
      label: 'Publicado',
      tone: 'success',
    })
  })
})
