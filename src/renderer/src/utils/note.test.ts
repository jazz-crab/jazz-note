import { describe, it, expect } from 'vitest'
import { replaceFirstHeading } from './note'

describe('replaceFirstHeading', () => {
  it('replaces the first heading', () => {
    expect(replaceFirstHeading('# Old\nbody', 'New')).toBe('# New\nbody')
  })

  it('handles nested heading levels', () => {
    expect(replaceFirstHeading('## Old\nbody', 'New')).toBe('## New\nbody')
  })

  it('leaves the body untouched when there is no heading', () => {
    expect(replaceFirstHeading('just text', 'New')).toBe('just text')
  })

  it('skips leading empty lines', () => {
    expect(replaceFirstHeading('\n\n# Old\nbody', 'New')).toBe('\n\n# New\nbody')
  })
})
