import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { debounce } from './debounce'

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('does not call before the delay elapses', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 100)
    debounced()
    vi.advanceTimersByTime(99)
    expect(fn).not.toHaveBeenCalled()
    vi.advanceTimersByTime(1)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('coalesces a burst of calls into a single invocation', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 100)
    debounced(1)
    vi.advanceTimersByTime(50)
    debounced(2)
    vi.advanceTimersByTime(50)
    debounced(3)
    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith(3)
  })

  it('passes through the latest arguments', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 100)
    debounced('a')
    vi.advanceTimersByTime(100)
    debounced('b')
    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenNthCalledWith(1, 'a')
    expect(fn).toHaveBeenNthCalledWith(2, 'b')
  })
})
