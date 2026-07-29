import { useState, useEffect, useRef } from 'react'
import { useColors } from '../theme'
import type React from 'react'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function FindInNote({ isOpen, onClose }: Props) {
  const colors = useColors()
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
    <div style={barStyle(colors)}>
      <input
        ref={inputRef}
        style={inputStyle(colors)}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Поиск в заметке..."
        onKeyDown={(e) => {
          if (e.key === 'Escape') onClose()
        }}
      />
      <button style={closeStyle(colors)} onClick={onClose}>×</button>
    </div>
  )
}

const barStyle = (c: any) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '6px 16px',
  background: c.bgAlt,
  borderBottom: `1px solid ${c.border}`,
})
const inputStyle = (c: any) => ({
  flex: 1,
  padding: '4px 8px',
  background: c.bg,
  border: `1px solid ${c.border}`,
  borderRadius: 4,
  color: c.fg,
  fontSize: 13,
})
const closeStyle = (c: any) => ({
  color: c.comment,
  fontSize: 18,
  padding: '0 4px',
})
