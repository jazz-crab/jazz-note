import { useEffect, useState } from 'react'
import { useNotesStore, type SortBy } from '../stores/notes'
import Sidebar from '../components/Sidebar'
import NoteCard from '../components/NoteCard'
import { colors } from '../theme'
import type React from 'react'

interface Props {
  onSelectNote: (relPath: string) => void
}

export default function NoteList({ onSelectNote }: Props) {
  const notes = useNotesStore((s) => s.notes)
  const folders = useNotesStore((s) => s.folders)
  const loading = useNotesStore((s) => s.loading)
  const sidebarSelection = useNotesStore((s) => s.sidebarSelection)
  const searchQuery = useNotesStore((s) => s.searchQuery)
  const sortBy = useNotesStore((s) => s.sortBy)
  const loadNotes = useNotesStore((s) => s.loadNotes)
  const setSearchQuery = useNotesStore((s) => s.setSearchQuery)
  const setSortBy = useNotesStore((s) => s.setSortBy)
  const deleteNote = useNotesStore((s) => s.deleteNote)
  const createNote = useNotesStore((s) => s.createNote)

  const [newTitle, setNewTitle] = useState('')

  useEffect(() => {
    loadNotes()
  }, [])

  useEffect(() => {
    const unsub = window.jazz.onNotesChanged(() => {
      loadNotes()
    })
    return unsub
  }, [])

  let filtered = notes.filter((n) => {
    if (sidebarSelection.type === 'folder') {
      if (!n.relPath.startsWith(sidebarSelection.path + '/')) return false
    }
    if (sidebarSelection.type === 'today') {
      if (!n.meta.due) return false
      const today = new Date()
      const d = new Date(n.meta.due)
      if (d.toDateString() !== today.toDateString()) return false
    }
    if (sidebarSelection.type === 'tomorrow') {
      if (!n.meta.due) return false
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      const d = new Date(n.meta.due)
      if (d.toDateString() !== tomorrow.toDateString()) return false
    }
    if (sidebarSelection.type === 'week') {
      if (!n.meta.due) return false
      const week = new Date()
      week.setDate(week.getDate() + 7)
      const d = new Date(n.meta.due)
      if (d > week) return false
    }
    if (sidebarSelection.type === 'later') {
      if (!n.meta.due) return false
      const week = new Date()
      week.setDate(week.getDate() + 7)
      const d = new Date(n.meta.due)
      if (d <= week) return false
    }
    if (sidebarSelection.type === 'nodate') {
      if (n.meta.due) return false
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      if (
        !n.title.toLowerCase().includes(q) &&
        !n.body.toLowerCase().includes(q)
      )
        return false
    }
    return true
  })

  if (sortBy === 'priority') {
    filtered = [...filtered].sort((a, b) => (b.meta.priority || 0) - (a.meta.priority || 0))
  } else if (sortBy === 'due') {
    filtered = [...filtered].sort((a, b) => {
      if (!a.meta.due && !b.meta.due) return 0
      if (!a.meta.due) return 1
      if (!b.meta.due) return -1
      return new Date(a.meta.due).getTime() - new Date(b.meta.due).getTime()
    })
  } else {
    filtered = [...filtered].sort((a, b) => {
      const aT = a.meta.updated || a.meta.created || ''
      const bT = b.meta.updated || b.meta.created || ''
      return bT.localeCompare(aT)
    })
  }

  const handleCreate = () => {
    const title = newTitle.trim() || 'Новая заметка'
    createNote(title)
    setNewTitle('')
  }

  const sortOptions: Array<{ value: SortBy; label: string }> = [
    { value: 'date', label: 'По дате' },
    { value: 'due', label: 'По сроку' },
    { value: 'priority', label: 'По приоритету' },
  ]

  return (
    <div style={styles.layout}>
      <Sidebar />
      <div style={styles.main}>
        <div style={styles.topBar}>
          <div style={styles.searchWrap}>
            <input
              style={styles.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск заметок..."
            />
            {searchQuery && (
              <button style={styles.clearBtn} onClick={() => setSearchQuery('')}>×</button>
            )}
          </div>
          <div style={styles.sortRow}>
            {sortOptions.map((opt) => (
              <button
                key={opt.value}
                style={{
                  ...styles.sortBtn,
                  ...(sortBy === opt.value ? styles.sortBtnActive : {}),
                }}
                onClick={() => setSortBy(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div style={styles.list}>
          {loading && <div style={styles.loading}>Загрузка...</div>}
          {!loading && filtered.length === 0 && (
            <div style={styles.empty}>
              {searchQuery ? 'Ничего не найдено' : 'Нет заметок'}
            </div>
          )}
          {filtered.map((note) => (
            <NoteCard
              key={note.relPath}
              note={note}
              isActive={false}
              onClick={() => onSelectNote(note.relPath)}
              onDelete={() => {
                if (confirm('Удалить заметку?')) deleteNote(note.relPath)
              }}
            />
          ))}
        </div>

        <div style={styles.bottomBar}>
          <div style={styles.newNoteWrap}>
            <input
              style={styles.newNoteInput}
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Новая заметка..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreate()
              }}
            />
            <button style={styles.createBtn} onClick={handleCreate}>+</button>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  layout: {
    display: 'flex',
    height: '100%',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  topBar: {
    padding: '12px 20px 8px',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  searchWrap: {
    position: 'relative' as const,
  },
  search: {
    width: '100%',
    padding: '8px 12px',
    background: colors.bgAlt,
    border: `1px solid ${colors.border}`,
    borderRadius: 6,
    color: colors.fg,
    fontSize: 13,
  },
  clearBtn: {
    position: 'absolute' as const,
    right: 8,
    top: '50%',
    transform: 'translateY(-50%)',
    color: colors.comment,
    fontSize: 16,
  },
  sortRow: {
    display: 'flex',
    gap: 4,
  },
  sortBtn: {
    padding: '4px 10px',
    fontSize: 11,
    color: colors.comment,
    borderRadius: 4,
    transition: 'background 0.1s',
  },
  sortBtnActive: {
    background: colors.bgHighlight,
    color: colors.blue,
    fontWeight: 600,
  },
  list: {
    flex: 1,
    overflow: 'auto',
    padding: '8px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  loading: {
    color: colors.comment,
    textAlign: 'center' as const,
    padding: 40,
  },
  empty: {
    color: colors.comment,
    textAlign: 'center' as const,
    padding: 60,
    fontSize: 14,
  },
  bottomBar: {
    padding: '8px 20px 12px',
    borderTop: `1px solid ${colors.border}`,
  },
  newNoteWrap: {
    display: 'flex',
    gap: 8,
  },
  newNoteInput: {
    flex: 1,
    padding: '8px 12px',
    background: colors.bgAlt,
    border: `1px solid ${colors.border}`,
    borderRadius: 6,
    color: colors.fg,
    fontSize: 13,
  },
  createBtn: {
    padding: '8px 16px',
    background: colors.blue,
    color: colors.bg,
    borderRadius: 6,
    fontWeight: 700,
    fontSize: 16,
  },
}
