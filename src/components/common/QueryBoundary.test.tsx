import type { UseQueryResult } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { QueryBoundary } from './QueryBoundary'

// Minimal fakes for the three states we care about — enough to exercise the
// boundary without spinning up a real QueryClient.
function fakeQuery<T>(partial: Partial<UseQueryResult<T>>): UseQueryResult<T> {
  return {
    isPending: false,
    isError: false,
    data: undefined,
    error: null,
    refetch: () => Promise.resolve({}),
    ...partial,
  } as UseQueryResult<T>
}

describe('QueryBoundary', () => {
  it('renders the error state on error', () => {
    render(
      <QueryBoundary query={fakeQuery({ isError: true, error: new Error('boom') })}>
        {() => <div>content</div>}
      </QueryBoundary>,
    )
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /tentar novamente/i })).toBeInTheDocument()
  })

  it('renders the empty state for an empty array', () => {
    render(
      <QueryBoundary query={fakeQuery<number[]>({ data: [] })}>
        {() => <div>content</div>}
      </QueryBoundary>,
    )
    expect(screen.getByText(/nada por aqui/i)).toBeInTheDocument()
  })

  it('renders children when data is present', () => {
    render(
      <QueryBoundary query={fakeQuery<number[]>({ data: [1, 2] })}>
        {(data) => <div>items: {data.length}</div>}
      </QueryBoundary>,
    )
    expect(screen.getByText('items: 2')).toBeInTheDocument()
  })
})
