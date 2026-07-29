import { useState } from 'react'
import NoteList from './screens/NoteList'
import NoteEdit from './screens/NoteEdit'

type Screen =
  | { type: 'list' }
  | { type: 'edit'; relPath: string }

export default function App() {
  const [screen, setScreen] = useState<Screen>({ type: 'list' })

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
    </div>
  )
}
