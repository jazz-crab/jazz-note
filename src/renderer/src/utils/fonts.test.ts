import { describe, it, expect } from 'vitest'
import { getFontFamily, fontOptions, type FontId } from './fonts'

describe('getFontFamily', () => {
  it('resolves a known font id', () => {
    expect(getFontFamily('neon')).toBe('Monaspace Neon')
  })

  it('falls back to the first font for unknown ids', () => {
    expect(getFontFamily('missing' as FontId)).toBe(fontOptions[0].family)
  })

  it('defines five fonts with unique ids', () => {
    const ids = fontOptions.map((f) => f.id)
    expect(ids).toHaveLength(5)
    expect(new Set(ids).size).toBe(5)
  })
})
