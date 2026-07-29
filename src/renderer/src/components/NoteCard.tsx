import type { Note } from '../stores/notes'
import { colors, priorityColors, noteColors } from '../theme'
import type React from 'react'

interface Props {
  note: Note
  isActive: boolean
  onClick: () => void
  onDelete: () => void
}

export default function NoteCard({ note, isActive, onClick, onDelete }: Props) {
  const priority = note.meta.priority || 0
  const noteColor = note.meta.color ? noteColors[note.meta.color] : null
  const due = note.meta.due ? new Date(note.meta.due) : null
  const isOverdue = due && due < new Date()
  const preview = note.body.replace(/^#+\s*/gm, '').replace(/[*~`>-]/g, '').trim().slice(0, 140)

  return (
    <div
      style={{
        ...styles.card,
        ...(isActive ? styles.cardActive : {}),
      }}
      onClick={onClick}
    >
      <div style={{ ...styles.priorityStrip, background: priorityColors[priority] }} />
      <div style={styles.body}>
        <div style={styles.header}>
          {noteColor && (
            <span style={{ ...styles.colorDot, background: noteColor }} />
          )}
          <span style={styles.title}>{note.title || 'Untitled'}</span>
          <button style={styles.deleteBtn} onClick={(e) => { e.stopPropagation(); onDelete() }}>×</button>
        </div>
        {preview && <div style={styles.preview}>{preview}</div>}
        <div style={styles.footer}>
          {due && (
            <span style={{ ...styles.due, ...(isOverdue ? styles.overdue : {}) }}>
              {due.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
            </span>
          )}
          {note.meta.updated && (
            <span style={styles.updated}>
              {new Date(note.meta.updated).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    display: 'flex',
    borderRadius: 6,
    overflow: 'hidden',
    background: colors.bgAlt,
    border: `1px solid ${colors.border}`,
    cursor: 'pointer',
    transition: 'border-color 0.1s',
  },
  cardActive: {
    borderColor: colors.blue,
  },
  priorityStrip: {
    width: 4,
    flexShrink: 0,
  },
  body: {
    flex: 1,
    padding: '10px 12px',
    minWidth: 0,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    flexShrink: 0,
  },
  title: {
    fontWeight: 600,
    fontSize: 14,
    color: colors.fg,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
    flex: 1,
  },
  deleteBtn: {
    color: colors.comment,
    fontSize: 18,
    padding: '0 2px',
    opacity: 0.5,
    flexShrink: 0,
  },
  preview: {
    fontSize: 12,
    color: colors.comment,
    marginTop: 4,
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical' as any,
    lineClamp: 2,
  },
  footer: {
    display: 'flex',
    gap: 8,
    marginTop: 6,
    fontSize: 11,
  },
  due: {
    color: colors.yellow,
  },
  overdue: {
    color: colors.red,
    fontWeight: 600,
  },
  updated: {
    color: colors.comment,
  },
}
