import { describe, expect, it } from 'vitest'
import {
  createNewGameDraft,
  firstStepWithError,
  hasErrors,
  mapApiFieldErrors,
  toCreateGameRequest,
  validateImageFile,
  validateInfo,
  validateMedia,
} from './new-game'

const file = (type: string, size: number) => new File([new Uint8Array(size)], 'a', { type })

describe('new-game draft', () => {
  it('requires a title and at least one genre', () => {
    const errors = validateInfo(createNewGameDraft())
    expect(errors).toEqual({
      title: 'Informe o nome do jogo',
      genres: 'Escolha ao menos um gênero',
    })
    expect(
      hasErrors(validateInfo({ ...createNewGameDraft(), title: ' Nebula ', genres: ['RPG'] })),
    ).toBe(false)
  })

  it('limits tagline and description length', () => {
    const errors = validateInfo({
      ...createNewGameDraft(),
      title: 'x',
      genres: ['RPG'],
      tagline: 'a'.repeat(201),
      description: 'b'.repeat(501),
    })
    expect(Object.keys(errors).sort()).toEqual(['description', 'tagline'])
  })

  it('accepts an empty trailer and rejects a non-http one', () => {
    expect(validateMedia(createNewGameDraft())).toEqual({})
    expect(validateMedia({ ...createNewGameDraft(), trailerUrl: 'ftp://x.dev/v' })).toHaveProperty(
      'trailerUrl',
    )
    expect(validateMedia({ ...createNewGameDraft(), trailerUrl: 'not a url' })).toHaveProperty(
      'trailerUrl',
    )
    expect(validateMedia({ ...createNewGameDraft(), trailerUrl: 'https://youtu.be/abc' })).toEqual(
      {},
    )
  })

  it('omits blank fields from the create request and trims text', () => {
    const request = toCreateGameRequest({
      ...createNewGameDraft(),
      title: '  Nebula Drift ',
      genres: ['Action'],
      platforms: ['windows'],
      developmentStage: 'beta',
    })
    expect(request).toEqual({
      title: 'Nebula Drift',
      genres: ['Action'],
      supportedPlatforms: ['windows'],
      developmentStage: 'beta',
    })
    expect(JSON.stringify(request)).not.toContain('tagline')
  })

  it('maps API field errors back onto draft fields and finds the step to reopen', () => {
    const errors = mapApiFieldErrors({
      'supportedPlatforms.0': 'inválido',
      title: 'Título obrigatório',
      unknown: 'ignorado',
    })
    expect(errors).toEqual({ platforms: 'inválido', title: 'Título obrigatório' })
    expect(firstStepWithError(errors)).toBe(0)
    expect(firstStepWithError({ trailerUrl: 'URL inválida' })).toBe(1)
    expect(firstStepWithError({})).toBeNull()
  })

  it('validates image type and size', () => {
    expect(validateImageFile(file('image/png', 10))).toBeNull()
    expect(validateImageFile(file('image/gif', 10))).toMatch(/PNG, JPG ou WebP/)
    expect(validateImageFile(file('image/png', 5 * 1024 * 1024 + 1))).toMatch(/5 MB/)
  })
})
