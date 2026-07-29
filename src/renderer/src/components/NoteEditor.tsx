import { useEffect, useRef } from 'react'
import { EditorView, keymap, placeholder } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { searchKeymap, highlightSelectionMatches } from '@codemirror/search'
import { syntaxHighlighting, defaultHighlightStyle } from '@codemirror/language'
import { tokyoNightTheme } from '../theme/codemirror'
import type React from 'react'

interface Props {
  value: string
  onChange: (value: string) => void
  onSave: () => void
}

export default function NoteEditor({ value, onChange, onSave }: Props) {
  const editorRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)
  const onChangeRef = useRef(onChange)
  const onSaveRef = useRef(onSave)
  const ignoreNextChange = useRef(false)

  onChangeRef.current = onChange
  onSaveRef.current = onSave

  useEffect(() => {
    if (!editorRef.current) return

    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged && !ignoreNextChange.current) {
        onChangeRef.current(update.state.doc.toString())
      }
      ignoreNextChange.current = false
    })

    const saveKey = keymap.of([
      {
        key: 'Mod-s',
        run: () => {
          onSaveRef.current()
          return true
        },
      },
      ...defaultKeymap,
      ...historyKeymap,
      ...searchKeymap,
    ])

    const state = EditorState.create({
      doc: value,
      extensions: [
        markdown({ base: markdownLanguage }),
        syntaxHighlighting(defaultHighlightStyle),
        tokyoNightTheme,
        history(),
        highlightSelectionMatches(),
        saveKey,
        updateListener,
        placeholder('Начните печатать...'),
        EditorView.lineWrapping,
      ],
    })

    const view = new EditorView({ state, parent: editorRef.current })
    viewRef.current = view

    return () => {
      view.destroy()
      viewRef.current = null
    }
  }, [])

  useEffect(() => {
    const view = viewRef.current
    if (!view) return
    const current = view.state.doc.toString()
    if (current !== value) {
      ignoreNextChange.current = true
      view.dispatch({
        changes: { from: 0, to: current.length, insert: value },
      })
    }
  }, [value])

  return <div ref={editorRef} style={styles.editor} />
}

const styles: Record<string, React.CSSProperties> = {
  editor: {
    flex: 1,
    height: '100%',
    overflow: 'auto',
    fontSize: 15,
    lineHeight: 1.6,
  },
}
