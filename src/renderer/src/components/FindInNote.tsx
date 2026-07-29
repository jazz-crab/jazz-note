import { useState, useEffect, useRef } from 'react'
import { colors } from '../theme'
import type React from 'react'

interface Props {
  isOpen: boolean
  onClose: () => void
  editor: any
}

export default function FindInNote({ isOpen, onClose }: Props) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
    } else {
      setQuery('')
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div style={styles.bar}>
      <input
        ref={inputRef}
        style={styles.input}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Поиск в заметке..."
        onKeyDown={(e) => {
          if (e.key === 'Escape') onClose()
        }}
      />
      <button style={styles.close} onClick={onClose}>×</button>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  bar: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '6px 16px',
    background: colors.bgAlt,
    borderBottom: `1px solid ${colors.border}`,
  },
  input: {
    flex: 1,
    padding: '4px 8px',
    background: colors.bg,
    border: `1px solid ${colors.border}`,
    borderRadius: 4,
    color: colors.fg,
    fontSize: 13,
  },
  close: {
    color: colors.comment,
    fontSize: 18,
    padding: '0 4px',
  },
}
