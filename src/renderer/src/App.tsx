import { useState, useEffect } from 'react'
import { useSettingsStore } from './stores/settings'
import { getVariant, getThemeCSSVars } from './theme/themes'
import NoteList from './screens/NoteList'
import NoteEdit from './screens/NoteEdit'
import SettingsDialog from './components/SettingsDialog'

type Screen =
  | { type: 'list' }
  | { type: 'edit'; relPath: string }

function applyTheme(palette: string, isDark: boolean) {
  const variant = getVariant(palette as any, isDark)
  const vars = getThemeCSSVars(variant.colors)
  const root = document.documentElement
  for (const [key, val] of Object.entries(vars)) {
    root.style.setProperty(key, val)
  }
  root.style.colorScheme = isDark ? 'dark' : 'light'
}

export default function App() {
  const [screen, setScreen] = useState<Screen>({ type: 'list' })
  const palette = useSettingsStore((s) => s.palette)
  const isDark = useSettingsStore((s) => s.isDark)

  useEffect(() => {
    applyTheme(palette, isDark)
  }, [palette, isDark])

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
    </div>
  )
}
