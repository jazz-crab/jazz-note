import { describe, it, expect } from 'vitest'
import { formatCountdown, nextUpcomingDue } from './countdown'
import type { Note } from '../stores/notes'

const now = Date.now()

function note(due: string | undefined, title: string): Note {
  return {
    relPath: `${title}.md`,
    title,
    meta: { title, due },
    content: '',
    body: '',
  }
}

function noteIn(ms: number, title: string): Note {
  return note(new Date(now + ms).toISOString(), title)
}

describe('nextUpcomingDue', () => {
  it('returns the nearest future due date', () => {
    const notes = [noteIn(2 * 3600_000, 'later'), noteIn(30 * 60_000, 'soon'), noteIn(13 * 3600_000, 'evening')]
    const result = nextUpcomingDue(notes, now)
    expect(result?.note.title).toBe('soon')
  })

  it('ignores overdue notes and notes without a due date', () => {
    const notes = [noteIn(-3600_000, 'overdue'), note(undefined, 'no date'), noteIn(3600_000, 'next')]
    const result = nextUpcomingDue(notes, now)
    expect(result?.note.title).toBe('next')
  })

  it('ignores invalid due dates', () => {
    const notes = [note('not-a-date', 'broken'), noteIn(3600_000, 'ok')]
    const result = nextUpcomingDue(notes, now)
    expect(result?.note.title).toBe('ok')
  })

  it('returns null when nothing is upcoming', () => {
    expect(nextUpcomingDue([noteIn(-3600_000, 'overdue'), note(undefined, 'none')], now)).toBeNull()
    expect(nextUpcomingDue([], now)).toBeNull()
  })
})

describe('formatCountdown', () => {
  it('formats under an hour as mm:ss', () => {
    expect(formatCountdown(90_000)).toBe('01:30')
    expect(formatCountdown(0)).toBe('00:00')
  })

  it('formats hours as hh:mm:ss', () => {
    expect(formatCountdown(3_659_000)).toBe('01:00:59')
  })

  it('prefixes days with a localized day unit', () => {
    expect(formatCountdown(90_600_000, 'ru')).toBe('1д 01:10:00')
    expect(formatCountdown(90_600_000, 'en')).toBe('1d 01:10:00')
  })

  it('clamps negative input to zero', () => {
    expect(formatCountdown(-5_000)).toBe('00:00')
  })
})
