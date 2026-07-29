import { useRef, useMemo } from 'react'
import { AtomicCodeMirrorEditor } from '@atomic-editor/editor'
import { Prec } from '@codemirror/state'
import { keymap } from '@codemirror/view'
import { ATOMIC_CODE_LANGUAGES } from '@atomic-editor/editor/code-languages'
import type { AtomicCodeMirrorEditorHandle } from '@atomic-editor/editor'

interface Props {
  documentId: string
  value: string
  onChange: (value: string) => void
  onSave: () => void
}

export default function NoteEditor({ documentId, value, onChange, onSave }: Props) {
  const handleRef = useRef<AtomicCodeMirrorEditorHandle | null>(null)
  const onChangeRef = useRef(onChange)
  const onSaveRef = useRef(onSave)
  onChangeRef.current = onChange
  onSaveRef.current = onSave

  const handleChange = useMemo(() => (md: string) => onChangeRef.current(md), [])

  const extensions = useMemo(() => [
    Prec.high(keymap.of([
      {
        key: 'Mod-s',
        run: () => {
          onSaveRef.current()
          return true
        },
      },
    ])),
  ], [])

  return (
    <div style={styles.wrapper}>
      <AtomicCodeMirrorEditor
        documentId={documentId}
        markdownSource={value}
        onMarkdownChange={handleChange}
        editorHandleRef={handleRef}
        codeLanguages={ATOMIC_CODE_LANGUAGES}
        extensions={extensions}
      />
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    flex: 1,
    height: '100%',
    overflow: 'hidden',
    display: 'flex',
    padding: '16px 24px',
  },
}
