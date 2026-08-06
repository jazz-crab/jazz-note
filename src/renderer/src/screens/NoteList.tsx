import { useEffect, useState } from 'react'
import { useNotesStore, type SortBy, type Note } from '../stores/notes'
import { useColors } from '../theme'
import { t } from '../utils/i18n'
import { useSettingsStore } from '../stores/settings'
import Sidebar from '../components/Sidebar'
import NoteCard from '../components/NoteCard'
import ConfirmDialog from '../components/ConfirmDialog'
import type React from 'react'

interface Props {
  onSelectNote: (relPath: string) => void
}

interface NoteItemProps {
  note: Note
  index: number
  isNew: boolean
  isDeleting: boolean
  onOpen: () => void
  onDelete: () => void
  onDeleteConfirmed: () => void
}

function NoteItem({ note, index, isNew, isDeleting, onOpen, onDelete, onDeleteConfirmed }: NoteItemProps) {
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    if (isNew) {
      setEntered(true)
      return
    }
    const t = setTimeout(() => setEntered(true), index * 30)
    return () => clearTimeout(t)
  }, [isNew, index])

  if (isDeleting) {
    return (
      <div
        style={{ animation: 'cardOut 0.22s ease both' }}
        onAnimationEnd={(e) => {
          if (e.target === e.currentTarget) onDeleteConfirmed()
        }}
      >
        <NoteCard note={note} isActive={false} onClick={onOpen} onDelete={onDelete} />
      </div>
    )
  }

  return (
    <div
      style={{
        opacity: entered ? 1 : 0,
        transform: entered ? 'none' : isNew ? 'translateX(24px)' : 'translateY(10px)',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
      }}
    >
      <NoteCard note={note} isActive={false} onClick={onOpen} onDelete={onDelete} />
    </div>
  )
}

export default function NoteList({ onSelectNote }: Props) {
  const colors = useColors()
  const lang = useSettingsStore((s) => s.lang)
  const notes = useNotesStore((s) => s.notes)
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
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<Set<string>>(new Set())
  const [createdRelPath, setCreatedRelPath] = useState<string | null>(null)

  const handleDeleted = (relPath: string) => {
    deleteNote(relPath)
    setDeleting((prev) => {
      const next = new Set(prev)
      next.delete(relPath)
      return next
    })
  }

  useEffect(() => {
    loadNotes()
  }, [])

  useEffect(() => {
    const unsub = window.jazz.onNotesChanged((relPath) => {
      useNotesStore.getState().handleExternalChange(relPath)
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

  if (sortBy === 'due') {
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

  const handleCreate = async () => {
    setNewTitle('')
    const relPath = await createNote(newTitle, setCreatedRelPath)
    if (relPath) onSelectNote(relPath)
    setTimeout(() => setCreatedRelPath(null), 1500)
  }

  const sortOptions: Array<{ value: SortBy; label: string }> = [
    { value: 'date', label: t('sort.by.date', lang) },
    { value: 'due', label: t('sort.by.due', lang) },
  ]

  return (
    <div style={layoutStyle}>
      <Sidebar />
      <div style={mainStyle}>
        <div style={topBarStyle}>
          <div style={{ position: 'relative' as const }}>
            <input
              style={searchStyle(colors)}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('search.placeholder', lang)}
            />
            {searchQuery && (
              <button style={clearBtnStyle(colors)} onClick={() => setSearchQuery('')}>×</button>
            )}
          </div>
          <div style={sortRowStyle}>
            {sortOptions.map((opt) => (
              <button
                key={opt.value}
                style={{
                  ...sortBtnStyle(colors),
                  ...(sortBy === opt.value ? sortBtnActiveStyle(colors) : {}),
                }}
                onClick={() => setSortBy(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div style={listStyle}>
          {loading && <div style={loadingStyle(colors)}>{t('loading', lang)}</div>}
          {!loading && filtered.length === 0 && (
            <div style={emptyStyle(colors)}>
              {searchQuery ? t('no.results', lang) : t('no.notes', lang)}
            </div>
          )}
          {filtered.map((note, i) => (
            <NoteItem
              key={note.relPath}
              note={note}
              index={i}
              isNew={note.relPath === createdRelPath}
              isDeleting={deleting.has(note.relPath)}
              onOpen={() => onSelectNote(note.relPath)}
              onDelete={() => setDeleteTarget(note.relPath)}
              onDeleteConfirmed={() => handleDeleted(note.relPath)}
            />
          ))}
        </div>

        <div style={bottomBarStyle(colors)}>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              style={newNoteInputStyle(colors)}
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder={t('new.note.placeholder', lang)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreate()
              }}
            />
            <button style={createBtnStyle(colors)} onClick={handleCreate}>{t('create', lang)}</button>
          </div>
        </div>
      </div>

      {deleteTarget && (
        <ConfirmDialog
          message={t('delete.confirm', lang)}
          confirmLabel={t('delete', lang)}
          cancelLabel={t('cancel', lang)}
          onConfirm={() => {
            setDeleteTarget(null)
            setDeleting((prev) => new Set(prev).add(deleteTarget))
          }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}

const layoutStyle: React.CSSProperties = {
  display: 'flex',
  height: '100%',
}
const mainStyle: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
}
const topBarStyle: React.CSSProperties = {
  padding: '12px 20px 8px',
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
}
const sortRowStyle: React.CSSProperties = {
  display: 'flex',
  gap: 4,
}
const listStyle: React.CSSProperties = {
  flex: 1,
  overflow: 'auto',
  padding: '8px 20px',
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
}
const searchStyle = (c: any) => ({
  width: '100%',
  padding: '8px 12px',
  background: c.bgAlt,
  border: `1px solid ${c.border}`,
  borderRadius: 6,
  color: c.fg,
  fontSize: 13,
})
const clearBtnStyle = (c: any) => ({
  position: 'absolute' as const,
  right: 8,
  top: '50%',
  transform: 'translateY(-50%)',
  color: c.comment,
  fontSize: 16,
})
const sortBtnStyle = (c: any) => ({
  padding: '4px 10px',
  fontSize: 11,
  color: c.comment,
  borderRadius: 4,
})
const sortBtnActiveStyle = (c: any) => ({
  background: c.bgHighlight,
  color: c.blue,
  fontWeight: 600,
})
const loadingStyle = (c: any) => ({
  color: c.comment,
  textAlign: 'center' as const,
  padding: 40,
})
const emptyStyle = (c: any) => ({
  color: c.comment,
  textAlign: 'center' as const,
  padding: 60,
  fontSize: 14,
})
const bottomBarStyle = (c: any) => ({
  padding: '8px 20px 12px',
  borderTop: `1px solid ${c.border}`,
})
const newNoteInputStyle = (c: any) => ({
  flex: 1,
  padding: '8px 12px',
  background: c.bgAlt,
  border: `1px solid ${c.border}`,
  borderRadius: 6,
  color: c.fg,
  fontSize: 13,
})
const createBtnStyle = (c: any) => ({
  padding: '8px 16px',
  background: c.blue,
  color: c.bg,
  borderRadius: 6,
  fontWeight: 700,
  fontSize: 16,
})
