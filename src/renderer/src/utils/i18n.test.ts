import { describe, it, expect } from 'vitest'
import { t, translationKeys, localeOf, monthName, weekdays } from './i18n'

describe('t', () => {
  it('defaults to Russian', () => {
    expect(t('all.notes')).toBe('Все заметки')
  })

  it('translates to English', () => {
    expect(t('all.notes', 'en')).toBe('All notes')
  })

  it('returns the key itself when it is missing from both dictionaries', () => {
    expect(t('no.such.key', 'en')).toBe('no.such.key')
  })

  it('falls back to Russian when the requested language is missing the key', () => {
    expect(t('all.notes', 'ru')).toBe('Все заметки')
  })

  it('keeps ru and en dictionaries in sync', () => {
    expect(translationKeys('ru').sort()).toEqual(translationKeys('en').sort())
  })

  it('has no empty or placeholder-only translations', () => {
    for (const lang of ['ru', 'en'] as const) {
      for (const key of translationKeys(lang)) {
        const value = t(key, lang)
        expect(value.trim().length).toBeGreaterThan(0)
        expect(value).not.toMatch(/^\{[^}]*\}$/)
      }
    }
  })
})

describe('localeOf', () => {
  it('maps langs to locales', () => {
    expect(localeOf('ru')).toBe('ru-RU')
    expect(localeOf('en')).toBe('en-US')
  })
})

describe('monthName', () => {
  it('returns localized month names', () => {
    expect(monthName(2026, 0, 'ru')).toBe('январь')
    expect(monthName(2026, 11, 'en')).toBe('December')
  })
})

describe('weekdays', () => {
  it('returns seven days starting on Monday', () => {
    expect(weekdays('ru')).toHaveLength(7)
    expect(weekdays('en')).toHaveLength(7)
    expect(weekdays('en')[0]).toBe('Mo')
  })
})
