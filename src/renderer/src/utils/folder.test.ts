import { describe, it, expect } from 'vitest'
import { leafName, parentOf, depthOf, isSelfOrChild, moveFolderPath } from './folder'

describe('leafName', () => {
  it('returns the last segment', () => {
    expect(leafName('a/b/c')).toBe('c')
    expect(leafName('root')).toBe('root')
  })
})

describe('parentOf', () => {
  it('returns the parent or null at root', () => {
    expect(parentOf('a/b/c')).toBe('a/b')
    expect(parentOf('a')).toBeNull()
  })
})

describe('depthOf', () => {
  it('counts nesting depth', () => {
    expect(depthOf('a')).toBe(0)
    expect(depthOf('a/b')).toBe(1)
    expect(depthOf('a/b/c/d')).toBe(3)
  })
})

describe('isSelfOrChild', () => {
  it('matches self and descendants, not siblings', () => {
    expect(isSelfOrChild('a/b', 'a')).toBe(true)
    expect(isSelfOrChild('a/b/c', 'a/b')).toBe(true)
    expect(isSelfOrChild('a', 'a')).toBe(true)
    expect(isSelfOrChild('ab', 'a')).toBe(false)
    expect(isSelfOrChild('a/bc', 'a/b')).toBe(false)
    expect(isSelfOrChild('b/c', 'a')).toBe(false)
  })
})

describe('moveFolderPath', () => {
  it('moves into a destination keeping the leaf name', () => {
    expect(moveFolderPath('a/b', 'x')).toBe('x/b')
    expect(moveFolderPath('a/b', null)).toBe('b')
    expect(moveFolderPath('root', 'x')).toBe('x/root')
  })
})
