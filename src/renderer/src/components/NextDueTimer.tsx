import { useEffect, useState } from 'react'
import { useNotesStore } from '../stores/notes'
import { useSettingsStore } from '../stores/settings'
import { useColors } from '../theme'
import { t } from '../utils/i18n'
import { formatCountdown, nextUpcomingDue } from '../utils/countdown'
import type React from 'react'

export default function NextDueTimer() {
  const colors = useColors()
  const lang = useSettingsStore((s) => s.lang)
  const notes = useNotesStore((s) => s.notes)
  const showCountdown = useSettingsStore((s) => s.showCountdown)
  const setShowCountdown = useSettingsStore((s) => s.setShowCountdown)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const upcoming = nextUpcomingDue(notes, now)
  if (!upcoming || !showCountdown) return null

  return (
    <div style={pill(colors)}>
      <span style={labelStyle(colors)}>{t('next.due', lang)}</span>
      <span style={timeStyle(colors)}>{formatCountdown(upcoming.due - now, lang)}</span>
      <span style={titleStyle(colors)}>{upcoming.note.title}</span>
      <button style={hideBtn(colors)} onClick={() => setShowCountdown(false)} title={t('hide.countdown', lang)}>
        ×
      </button>
    </div>
  )
}

const pill = (c: any): React.CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '6px 12px',
  background: c.bgHighlight,
  border: `1px solid ${c.border}`,
  borderRadius: 6,
  minWidth: 0,
})
const labelStyle = (c: any): React.CSSProperties => ({ fontSize: 12, color: c.comment, flexShrink: 0 })
const timeStyle = (c: any): React.CSSProperties => ({
  fontFamily: 'var(--app-font)',
  fontSize: 16,
  fontWeight: 700,
  color: c.orange,
  whiteSpace: 'nowrap' as const,
  flexShrink: 0,
})
const titleStyle = (c: any): React.CSSProperties => ({
  fontSize: 12,
  color: c.fg,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap' as const,
  minWidth: 0,
  flex: 1,
})
const hideBtn = (c: any): React.CSSProperties => ({
  color: c.comment,
  fontSize: 16,
  padding: '0 2px',
  opacity: 0.5,
  flexShrink: 0,
})
