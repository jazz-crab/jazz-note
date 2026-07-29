import { useEffect, useState, useCallback } from 'react'
import { useNotesStore } from '../stores/notes'
import { useColors } from '../theme'
import { serializeNote, type NoteMeta } from '../utils/frontmatter'
import NoteEditor from '../components/NoteEditor'
import PriorityPicker from '../components/PriorityPicker'
import DatePicker from '../components/DatePicker'
import ColorPicker from '../components/ColorPicker'

interface Props {
  relPath: string
  onBack: () => void
}

export default function NoteEdit({ relPath, onBack }: Props) {
  const colors = useColors()
  const currentNote = useNotesStore((s) => s.currentNote)
  const setCurrentNote = useNotesStore((s) => s.setCurrentNote)
  const updateCurrentNote = useNotesStore((s) => s.updateCurrentNote)
  const updateNoteMeta = useNotesStore((s) => s.updateNoteMeta)
  const saveCurrentNote = useNotesStore((s) => s.saveCurrentNote)
  const notesPath = useNotesStore((s) => s.notesPath)
  const [saved, setSaved] = useState(false)
  const dirtyNotes = useNotesStore((s) => s.dirtyNotes)
  const isDirty = currentNote ? dirtyNotes.has(currentNote.relPath) : false

  useEffect(() => {
    setCurrentNote(relPath)
    return () => {
      setCurrentNote(null)
    }
  }, [relPath])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onBack()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  useEffect(() => {
    const unsub = window.jazz.onAppClosing(() => {
      const state = useNotesStore.getState()
      const note = state.currentNote
      if (note && state.dirtyNotes.has(note.relPath)) {
        const raw = serializeNote(note.meta, note.body)
        const path = state.notesPath
        try {
          window.jazz.writeFileSync(note.relPath, raw, path)
        } catch {}
      }
    })
    return unsub
  }, [])

  const handleChange = useCallback((body: string) => {
    updateCurrentNote(body)
  }, [])

  const handleSave = useCallback(async () => {
    await saveCurrentNote()
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }, [])

  const handleMetaChange = useCallback((meta: Partial<NoteMeta>) => {
    updateNoteMeta(meta)
  }, [])

  if (!currentNote) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner} />
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={headerStyle(colors)}>
        <button style={backBtnStyle(colors)} onClick={onBack}>{'\u2190'}</button>
        <div style={styles.meta}>
          <PriorityPicker
            value={currentNote.meta.priority || 0}
            onChange={(v) => handleMetaChange({ priority: v as any })}
          />
          <DatePicker
            date={currentNote.meta.due || ''}
            onDateChange={(d) => handleMetaChange({ due: d || undefined })}
          />
          <ColorPicker
            value={currentNote.meta.color || ''}
            onChange={(c) => handleMetaChange({ color: c || undefined })}
          />
        </div>
        <div style={styles.status}>
          {isDirty && <span style={unsavedStyle(colors)}>Не сохранено</span>}
          {saved && !isDirty && <span style={savedStyle(colors)}>Сохранено</span>}
        </div>
      </div>

      <div style={styles.editorWrap}>
        <NoteEditor
          documentId={currentNote.relPath}
          value={currentNote.body}
          onChange={handleChange}
          onSave={handleSave}
        />
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  meta: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  status: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
  },
  editorWrap: {
    flex: 1,
    overflow: 'hidden',
    display: 'flex',
  },
  loading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  spinner: {
    width: 24,
    height: 24,
    border: '2px solid var(--border)',
    borderTopColor: 'var(--blue)',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
}

const headerStyle = (c: any) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '8px 16px',
  borderBottom: `1px solid ${c.border}`,
  background: c.bgAlt,
  flexShrink: 0,
})
const backBtnStyle = (c: any) => ({
  fontSize: 18,
  color: c.blue,
  padding: '4px 8px',
  borderRadius: 4,
})
const unsavedStyle = (c: any) => ({
  fontSize: 11,
  color: c.orange,
})
const savedStyle = (c: any) => ({
  fontSize: 11,
  color: c.green,
})
