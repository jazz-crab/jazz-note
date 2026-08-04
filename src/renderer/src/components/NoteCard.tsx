import type { Note } from '../stores/notes'
import { useColors, useNoteColors } from '../theme'
import { mixHex } from '../utils/color'
import type React from 'react'

interface Props {
  note: Note
  isActive: boolean
  onClick: () => void
  onDelete: () => void
}

export default function NoteCard({ note, isActive, onClick, onDelete }: Props) {
  const colors = useColors()
  const noteColorMap = useNoteColors()
  const noteColor = note.meta.color ? noteColorMap[note.meta.color] : null
  const due = note.meta.due ? new Date(note.meta.due) : null
  const isOverdue = due && due < new Date()
  const preview = note.body.replace(/^#+\s*/gm, '').replace(/[*~`>-]/g, '').trim().slice(0, 140)
  const cardBg = noteColor ? mixHex(noteColor, colors.bgAlt, 0.1) : undefined

  return (
    <div
      style={{
        ...card(colors),
        ...(cardBg ? { background: cardBg } : {}),
        ...(isActive ? cardActive(colors) : {}),
      }}
      onClick={onClick}
    >
      <div style={styles.body}>
        <div style={styles.header}>
          {noteColor && (
            <span style={{ ...colorDot(noteColor) }} />
          )}
          <span style={titleStyle(colors)}>{note.title || 'Untitled'}</span>
          <button style={deleteBtn(colors)} onClick={(e) => { e.stopPropagation(); onDelete() }}>×</button>
        </div>
        {preview && <div style={previewStyle(colors)}>{preview}</div>}
        <div style={styles.footer}>
          {due && (
            <span style={{ ...dueStyle(colors), ...(isOverdue ? overdueStyle(colors) : {}) }}>
              {due.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
            </span>
          )}
          {note.meta.updated && (
            <span style={updatedStyle(colors)}>
              {new Date(note.meta.updated).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  body: { flex: 1, padding: '10px 12px', minWidth: 0 },
  header: { display: 'flex', alignItems: 'center', gap: 6 },
  footer: { display: 'flex', gap: 8, marginTop: 6, fontSize: 11 },
}

const card = (c: any) => ({
  display: 'flex',
  borderRadius: 6,
  overflow: 'hidden',
  background: c.bgAlt,
  border: `1px solid ${c.border}`,
  cursor: 'pointer',
  transition: 'border-color 0.1s',
})
const cardActive = (c: any) => ({ borderColor: c.blue })
const colorDot = (c: string) => ({
  width: 8,
  height: 8,
  borderRadius: '50%' as const,
  background: c,
  flexShrink: 0,
})
const titleStyle = (c: any) => ({
  fontWeight: 600,
  fontSize: 14,
  color: c.fg,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap' as const,
  flex: 1,
})
const deleteBtn = (c: any) => ({
  color: c.comment,
  fontSize: 18,
  padding: '0 2px',
  opacity: 0.5,
  flexShrink: 0,
})
const previewStyle = (c: any) => ({
  fontSize: 12,
  color: c.comment,
  marginTop: 4,
  overflow: 'hidden',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical' as any,
  lineClamp: 2,
})
const dueStyle = (_c: any) => ({ color: 'var(--yellow)' })
const overdueStyle = (_c: any) => ({ color: 'var(--red)', fontWeight: 600 })
const updatedStyle = (c: any) => ({ color: c.comment })
