import { describe, it, expect } from 'vitest'
import { mixHex } from './color'

describe('mixHex', () => {
  it('returns a when t is 1', () => {
    expect(mixHex('#ff0000', '#0000ff', 1)).toBe('#ff0000')
  })

  it('returns b when t is 0', () => {
    expect(mixHex('#ff0000', '#0000ff', 0)).toBe('#0000ff')
  })

  it('averages channels at t 0.5', () => {
    expect(mixHex('#000000', '#ffffff', 0.5)).toBe('#808080')
  })

  it('handles 3-digit hex', () => {
    expect(mixHex('#f00', '#000', 1)).toBe('#ff0000')
  })

  it('clamps values into the 0-255 range', () => {
    const result = mixHex('#ffffff', '#000000', 2)
    expect(result).toBe('#ffffff')
  })
})
