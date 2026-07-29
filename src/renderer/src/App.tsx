import { useState, useEffect, useRef } from 'react'
import { useSettingsStore } from './stores/settings'
import { getVariant, getThemeCSSVars, getAtomicEditorCSSVars } from './theme/themes'
import NoteList from './screens/NoteList'
import NoteEdit from './screens/NoteEdit'
import SettingsDialog from './components/SettingsDialog'
import ConfirmDialog from './components/ConfirmDialog'
import '@atomic-editor/editor/styles.css'

type Screen =
  | { type: 'list' }
  | { type: 'edit'; relPath: string }

function applyTheme(palette: string, isDark: boolean) {
  const variant = getVariant(palette as any, isDark)
  const vars = { ...getThemeCSSVars(variant.colors), ...getAtomicEditorCSSVars(variant.colors) }
  const root = document.documentElement
  for (const [key, val] of Object.entries(vars)) {
    root.style.setProperty(key, val)
  }
  root.style.colorScheme = isDark ? 'dark' : 'light'
}

export default function App() {
  const [screen, setScreen] = useState<Screen>({ type: 'list' })
  const screenRef = useRef(screen)
  screenRef.current = screen
  const [showExitConfirm, setShowExitConfirm] = useState(false)
  const palette = useSettingsStore((s) => s.palette)
  const isDark = useSettingsStore((s) => s.isDark)

  useEffect(() => {
    applyTheme(palette, isDark)
  }, [palette, isDark])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const s = screenRef.current
        if (s.type === 'edit') return
        const settings = useSettingsStore.getState()
        if (settings.showSettings) return
        e.stopPropagation()
        setShowExitConfirm(true)
      }
    }
    window.addEventListener('keydown', handleKey, true)
    return () => window.removeEventListener('keydown', handleKey, true)
  }, [])

  const handleExitConfirm = () => {
    window.close()
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {screen.type === 'list' ? (
        <NoteList onSelectNote={(relPath) => setScreen({ type: 'edit', relPath })} />
      ) : (
        <NoteEdit
          relPath={screen.relPath}
          onBack={() => setScreen({ type: 'list' })}
        />
      )}
      <SettingsDialog />
      {showExitConfirm && (
        <ConfirmDialog
          message="Выйти?"
          confirmLabel="OK"
          cancelLabel="Отмена"
          onConfirm={handleExitConfirm}
          onCancel={() => setShowExitConfirm(false)}
        />
      )}
    </div>
  )
}
