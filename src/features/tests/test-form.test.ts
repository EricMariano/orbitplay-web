import { describe, expect, it } from 'vitest'
import {
  changeQuestionType,
  createQuestionDraft,
  isTestFormValid,
  toPutFormRequest,
  type QuestionDraft,
} from './test-form'

const draft = (overrides: Partial<QuestionDraft> = {}): QuestionDraft => ({
  ...createQuestionDraft(),
  prompt: 'Gostou da paleta de cor?',
  ...overrides,
})

const options = (...labels: string[]) => labels.map((label) => ({ key: label, label }))

describe('test form builder', () => {
  it('requires at least one question with a prompt', () => {
    expect(isTestFormValid([])).toBe(false)
    expect(isTestFormValid([draft({ prompt: '  ' })])).toBe(false)
    expect(isTestFormValid([draft()])).toBe(true)
  })

  it('requires two filled options on choice questions (RN-02)', () => {
    expect(isTestFormValid([draft({ type: 'single_choice', options: options('Sim', '') })])).toBe(
      false,
    )
    expect(
      isTestFormValid([draft({ type: 'multiple_choice', options: options('Sim', 'Não') })]),
    ).toBe(true)
  })

  it('starts choice questions with three empty options and drops them for other types', () => {
    const choice = changeQuestionType(draft(), 'single_choice')
    expect(choice.options).toHaveLength(3)
    expect(changeQuestionType(choice, 'scale').options).toEqual([])
  })

  it('keeps typed options when switching between choice types', () => {
    const choice = draft({ type: 'single_choice', options: options('Sim', 'Não') })
    expect(changeQuestionType(choice, 'multiple_choice').options).toEqual(choice.options)
  })

  it('uses list order as position and sends only the fields of each type', () => {
    const request = toPutFormRequest([
      draft({ prompt: ' O que achou? ', required: true }),
      draft({ type: 'single_choice', options: options('Sim', '', 'Não') }),
      draft({ type: 'scale', scaleMin: 1, scaleMax: 5, scaleMinLabel: 'Nada', scaleMaxLabel: '' }),
    ])

    expect(request.questions).toEqual([
      { type: 'open_text', prompt: 'O que achou?', required: true, position: 0 },
      {
        type: 'single_choice',
        prompt: 'Gostou da paleta de cor?',
        required: false,
        position: 1,
        options: [
          { label: 'Sim', position: 0 },
          { label: 'Não', position: 1 },
        ],
      },
      {
        type: 'scale',
        prompt: 'Gostou da paleta de cor?',
        required: false,
        position: 2,
        scaleMin: 1,
        scaleMax: 5,
        scaleMinLabel: 'Nada',
      },
    ])
  })
})
