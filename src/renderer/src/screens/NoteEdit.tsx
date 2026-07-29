import { useEffect, useState, useRef } from 'react'
import { useNotesStore } from '../stores/notes'
import { useColors } from '../theme'
import { debounce } from '../utils/debounce'
import NoteEditor from '../components/NoteEditor'
import PriorityPicker from '../components/PriorityPicker'
import DatePicker from '../components/DatePicker'
import ColorPicker from '../components/ColorPicker'
import FindInNote from '../components/FindInNote'

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
      <div style={loadingStyle}>
        <div style={spinnerStyle} />
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
    <div style={containerStyle}>
      <div style={headerStyle(colors)}>
        <button style={backBtnStyle(colors)} onClick={onBack}>←</button>
        <div style={metaStyle}>
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
        <div style={statusStyle}>
          {isDirty && <span style={unsavedStyle(colors)}>Не сохранено</span>}
          {saved && !isDirty && <span style={savedStyle(colors)}>Сохранено</span>}
          <button style={findBtnStyle} onClick={() => setFindOpen(!findOpen)} title="Поиск (Ctrl+F)">
            🔍
          </button>
        </div>
      </div>

      <FindInNote isOpen={findOpen} onClose={() => setFindOpen(false)} />

      <div style={editorWrapStyle}>
        <NoteEditor
          value={currentNote.body}
          onChange={handleChange}
          onSave={handleSave}
        />
      </div>
    </div>
  )
}

const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
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
const metaStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  flex: 1,
}
const statusStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  flexShrink: 0,
}
const unsavedStyle = (c: any) => ({
  fontSize: 11,
  color: c.orange,
})
const savedStyle = (c: any) => ({
  fontSize: 11,
  color: c.green,
})
const findBtnStyle: React.CSSProperties = {
  fontSize: 14,
  padding: '4px 8px',
  borderRadius: 4,
}
const editorWrapStyle: React.CSSProperties = {
  flex: 1,
  overflow: 'hidden',
  display: 'flex',
}
const loadingStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
}
const spinnerStyle: React.CSSProperties = {
  width: 24,
  height: 24,
  border: '2px solid var(--border)',
  borderTopColor: 'var(--blue)',
  borderRadius: '50%',
  animation: 'spin 0.8s linear infinite',
}
