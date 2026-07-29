import { useState } from 'react'
import { colors } from '../theme'
import type React from 'react'

interface Props {
  date: string
  onDateChange: (d: string) => void
}

export default function DatePicker({ date, onDateChange }: Props) {
  const [show, setShow] = useState(false)

  const formatted = date
    ? new Date(date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })
    : null

  return (
    <div style={styles.container}>
      <button style={styles.btn} onClick={() => setShow(!show)}>
        {formatted || 'Дата'}
      </button>
      {date && (
        <button style={styles.clear} onClick={() => onDateChange('')}>×</button>
      )}
      {show && (
        <div style={styles.popup}>
          <input
            type="date"
            value={date ? date.slice(0, 10) : ''}
            onChange={(e) => {
              onDateChange(e.target.value)
              setShow(false)
            }}
            style={styles.dateInput}
            autoFocus
          />
        </div>
      )}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'relative' as const,
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  btn: {
    padding: '4px 10px',
    background: colors.bgAlt,
    border: `1px solid ${colors.border}`,
    borderRadius: 4,
    color: colors.fg,
    fontSize: 12,
  },
  clear: {
    color: colors.comment,
    fontSize: 14,
    padding: '0 2px',
  },
  popup: {
    position: 'absolute' as const,
    top: '100%',
    left: 0,
    marginTop: 4,
    background: colors.bgPopup,
    border: `1px solid ${colors.border}`,
    borderRadius: 6,
    padding: 8,
    zIndex: 100,
  },
  dateInput: {
    colorScheme: 'dark' as any,
    color: colors.fg,
    background: colors.bg,
    border: `1px solid ${colors.border}`,
    borderRadius: 4,
    padding: 4,
    fontFamily: 'inherit',
  },
}
