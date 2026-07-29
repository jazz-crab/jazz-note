import { useState } from 'react'
import { useColors } from '../theme'
import type React from 'react'

interface Props {
  date: string
  onDateChange: (d: string) => void
}

export default function DatePicker({ date, onDateChange }: Props) {
  const colors = useColors()
  const [show, setShow] = useState(false)

  const formatted = date
    ? new Date(date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })
    : null

  return (
    <div style={containerStyle}>
      <button style={btnStyle(colors)} onClick={() => setShow(!show)}>
        {formatted || 'Дата'}
      </button>
      {date && (
        <button style={clearStyle(colors)} onClick={() => onDateChange('')}>×</button>
      )}
      {show && (
        <div style={popupStyle(colors)}>
          <input
            type="date"
            value={date ? date.slice(0, 10) : ''}
            onChange={(e) => {
              onDateChange(e.target.value)
              setShow(false)
            }}
            style={dateInputStyle(colors)}
            autoFocus
          />
        </div>
      )}
    </div>
  )
}

const containerStyle: React.CSSProperties = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  gap: 4,
}
const btnStyle = (c: any) => ({
  padding: '4px 10px',
  background: c.bgAlt,
  border: `1px solid ${c.border}`,
  borderRadius: 4,
  color: c.fg,
  fontSize: 12,
})
const clearStyle = (c: any) => ({
  color: c.comment,
  fontSize: 14,
  padding: '0 2px',
})
const popupStyle = (c: any) => ({
  position: 'absolute' as const,
  top: '100%',
  left: 0,
  marginTop: 4,
  background: c.bgPopup,
  border: `1px solid ${c.border}`,
  borderRadius: 6,
  padding: 8,
  zIndex: 100,
})
const dateInputStyle = (_c: any) => ({
  colorScheme: 'dark' as any,
  color: 'var(--fg)',
  background: 'var(--bg)',
  border: '1px solid var(--border)',
  borderRadius: 4,
  padding: 4,
  fontFamily: 'inherit',
})
