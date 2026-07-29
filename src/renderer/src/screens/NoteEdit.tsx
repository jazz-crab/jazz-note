import { useEffect, useState, useRef } from 'react'
import { useNotesStore } from '../stores/notes'
import NoteEditor from '../components/NoteEditor'
import PriorityPicker from '../components/PriorityPicker'
import DatePicker from '../components/DatePicker'
import ColorPicker from '../components/ColorPicker'
import FindInNote from '../components/FindInNote'
import { colors } from '../theme'
import { debounce } from '../utils/debounce'
import type React from 'react'

interface Props {
  relPath: string
  onBack: () => void
}

export default function NoteEdit({ relPath, onBack }: Props) {
  const currentNote = useNotesStore((s) => s.currentNote)
  const setCurrentNote = useNotesStore((s) => s.setCurrentNote)
  const updateCurrentNote = useNotesStore((s) => s.updateCurrentNote)
  const updateNoteMeta = useNotesStore((s) => s.updateNoteMeta)
  const saveCurrentNote = useNotesStore((s) => s.saveCurrentNote)
  const [findOpen, setFindOpen] = useState(false)
  const [saved, setSaved] = useState(false)
  const dirtyNotes = useNotesStore((s) => s.dirtyNotes)
  const isDirty = currentNote ? dirtyNotes.has(currentNote.relPath) : false
  const isDirtyRef = useRef(isDirty)
  isDirtyRef.current = isDirty

  useEffect(() => {
    setCurrentNote(relPath)
    return () => {
      setCurrentNote(null)
    }
  }, [relPath])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !findOpen) {
        onBack()
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault()
        setFindOpen((v) => !v)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [findOpen])

  useEffect(() => {
    const unsub = window.jazz.onAppClosing(async () => {
      if (isDirtyRef.current) {
        await useNotesStore.getState().saveCurrentNote()
      }
    })
    return unsub
  }, [])

  const debouncedSave = debounce(async () => {
    await useNotesStore.getState().saveCurrentNote()
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }, 1500)

  if (!currentNote) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner} />
      </div>
    )
  }

  const handleChange = (body: string) => {
    updateCurrentNote(body)
    debouncedSave()
  }

  const handleSave = async () => {
    await saveCurrentNote()
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  const handleMetaChange = (meta: Partial<typeof currentNote.meta>) => {
    updateNoteMeta(meta)
    debouncedSave()
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={onBack}>←</button>
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
          {isDirty && <span style={styles.unsaved}>Не сохранено</span>}
          {saved && !isDirty && <span style={styles.saved}>Сохранено</span>}
          <button style={styles.findBtn} onClick={() => setFindOpen(!findOpen)} title="Поиск (Ctrl+F)">
            🔍
          </button>
        </div>
      </div>

      <FindInNote
        isOpen={findOpen}
        onClose={() => setFindOpen(false)}
        editor={null}
      />

      <div style={styles.editorWrap}>
        <NoteEditor
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
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '8px 16px',
    borderBottom: `1px solid ${colors.border}`,
    background: colors.bgAlt,
    flexShrink: 0,
  },
  backBtn: {
    fontSize: 18,
    color: colors.blue,
    padding: '4px 8px',
    borderRadius: 4,
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
  unsaved: {
    fontSize: 11,
    color: colors.orange,
  },
  saved: {
    fontSize: 11,
    color: colors.green,
  },
  findBtn: {
    fontSize: 14,
    padding: '4px 8px',
    borderRadius: 4,
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
    border: `2px solid ${colors.border}`,
    borderTopColor: colors.blue,
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
}
