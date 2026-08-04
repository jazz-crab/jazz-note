import { useState } from 'react'
import { useColors } from '../theme'

export type SaveStatus = 'idle' | 'dirty' | 'saving' | 'success' | 'error'

interface Props {
  status: SaveStatus
  lastSavedAt: Date | null
  error?: string | null
}

const statusText: Record<SaveStatus, string> = {
  idle: 'Нет несохранённых изменений',
  dirty: 'Есть несохранённые изменения',
  saving: 'Сохранение...',
  success: 'Всё сохранено',
  error: 'Ошибка сохранения',
}

function colorFor(status: SaveStatus, c: any): string {
  if (status === 'error') return c.red
  if (status === 'dirty') return c.comment
  return c.green
}

function formatTime(d: Date): string {
  return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}

export default function SaveStatusCircle({ status, lastSavedAt, error }: Props) {
  const colors = useColors()
  const [showPopup, setShowPopup] = useState(false)
  const color = colorFor(status, colors)
  const saving = status === 'saving'

  return (
    <div style={containerStyle}>
      <button
        style={{
          ...dotStyle,
          background: color,
          animation: saving ? 'pulse 1.6s ease-in-out infinite' : 'none',
        }}
        onClick={() => setShowPopup((v) => !v)}
        title={statusText[status]}
      />
      {showPopup && (
        <div style={popupStyle(colors)} onClick={() => setShowPopup(false)}>
          <div style={titleStyle(colors)}>{statusText[status]}</div>
          {status === 'error' && error && (
            <div style={errorStyle(colors)}>{error}</div>
          )}
          <div style={timeStyle(colors)}>
            {status === 'error' && lastSavedAt
              ? `Последнее успешное сохранение: ${formatTime(lastSavedAt)}`
              : `Последнее сохранение: ${lastSavedAt ? formatTime(lastSavedAt) : '—'}`}
          </div>
        </div>
      )}
    </div>
  )
}

const containerStyle: React.CSSProperties = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  flexShrink: 0,
}
const dotStyle: React.CSSProperties = {
  width: 12,
  height: 12,
  borderRadius: '50%',
  cursor: 'pointer',
  transition: 'background 0.5s ease, opacity 0.5s ease, transform 0.5s ease',
}
const popupStyle = (c: any) => ({
  position: 'absolute' as const,
  top: '100%',
  right: 0,
  marginTop: 8,
  width: 220,
  padding: '10px 12px',
  borderRadius: 8,
  background: c.bgPopup,
  border: `1px solid ${c.border}`,
  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
  zIndex: 300,
})
const titleStyle = (c: any) => ({
  fontSize: 13,
  fontWeight: 600,
  color: c.fg,
})
const errorStyle = (c: any) => ({
  fontSize: 12,
  color: c.red,
  marginTop: 4,
})
const timeStyle = (c: any) => ({
  fontSize: 11,
  color: c.comment,
  marginTop: 4,
})
