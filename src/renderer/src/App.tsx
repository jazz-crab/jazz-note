import { useState, useEffect } from 'react'
import { useSettingsStore } from './stores/settings'
import { getTheme, getThemeCSSVars } from './theme/themes'
import NoteList from './screens/NoteList'
import NoteEdit from './screens/NoteEdit'
import SettingsDialog from './components/SettingsDialog'

type Screen =
  | { type: 'list' }
  | { type: 'edit'; relPath: string }

function applyTheme(themeId: string) {
  const theme = getTheme(themeId as any)
  const vars = getThemeCSSVars(theme.colors)
  const root = document.documentElement
  for (const [key, val] of Object.entries(vars)) {
    root.style.setProperty(key, val)
  }
}

export default function App() {
  const [screen, setScreen] = useState<Screen>({ type: 'list' })
  const theme = useSettingsStore((s) => s.theme)

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

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
