import { EditorView } from '@codemirror/view'
import type { Extension } from '@codemirror/state'

export const tokyoNightTheme: Extension = EditorView.theme(
  {
    '&': {
      backgroundColor: '#1a1b26',
      color: '#c0caf5',
    },
    '.cm-content': {
      caretColor: '#c0caf5',
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      fontSize: '15px',
      lineHeight: 1.6,
      padding: '16px 20px',
    },
    '.cm-cursor': {
      borderLeftColor: '#c0caf5',
      borderLeftWidth: '2px',
    },
    '.cm-selectionBackground': {
      backgroundColor: '#28345740 !important',
    },
    '&.cm-focused .cm-selectionBackground': {
      backgroundColor: '#28345780 !important',
    },
    '.cm-activeLine': {
      backgroundColor: '#24283b',
    },
    '.cm-gutters': {
      backgroundColor: '#1a1b26',
      color: '#3b4261',
      border: 'none',
      borderRight: '1px solid #2f3b54',
    },
    '.cm-lineNumbers': {
      color: '#3b4261',
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: '12px',
    },
    '.cm-matchingBracket': {
      backgroundColor: '#292e42',
      outline: '1px solid #565f89',
    },
    '.cm-selectionMatch': {
      backgroundColor: '#283457',
    },
    '.cm-placeholder': {
      color: '#565f89',
    },
    '&.cm-focused': {
      outline: 'none',
    },
    '&.cm-editor': {
      height: '100%',
    },
    '.cm-scroller': {
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    },
    '.cm-formatting-header': {
      color: '#565f89',
    },
    '.cm-header': {
      color: '#7aa2f7',
      fontWeight: 700,
    },
    '.cm-header-1': { fontSize: '1.6em' },
    '.cm-header-2': { fontSize: '1.3em' },
    '.cm-header-3': { fontSize: '1.1em' },
    '.cm-strong': { color: '#bb9af7', fontWeight: 700 },
    '.cm-em': { color: '#73daca', fontStyle: 'italic' },
    '.cm-strikethrough': { textDecoration: 'line-through', color: '#565f89' },
    '.cm-quote': { color: '#9ece6a', fontStyle: 'italic' },
    '.cm-link': { color: '#7dcfff', textDecoration: 'underline' },
    '.cm-url': { color: '#2ac3de' },
    '.cm-image': { color: '#bb9af7' },
    '.cm-comment': { color: '#565f89' },
    '.cm-atom': { color: '#ff9e64' },
    '.cm-number': { color: '#ff9e64' },
    '.cm-keyword': { color: '#bb9af7' },
    '.cm-string': { color: '#9ece6a' },
    '.cm-variable': { color: '#c0caf5' },
    '.cm-property': { color: '#7aa2f7' },
    '.cm-operator': { color: '#89ddff' },
    '.cm-def': { color: '#7dcfff' },
    '.cm-meta': { color: '#f7768e' },
    '.cm-typeName': { color: '#e0af68' },
    '.cm-list-1': { color: '#f7768e' },
    '.cm-list-2': { color: '#ff9e64' },
    '.cm-list-3': { color: '#e0af68' },
    '.cm-formatting-list': { color: '#565f89' },
    '.cm-formatting-code': { color: '#565f89' },
    '.cm-inlineCode': {
      backgroundColor: '#24283b',
      color: '#ff9e64',
      padding: '1px 4px',
      borderRadius: 3,
      fontFamily: "'JetBrains Mono', monospace",
    },
  },
  { dark: true }
)
