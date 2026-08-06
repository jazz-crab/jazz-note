import { create } from 'zustand'
import type { NoteMeta, NoteData } from '../utils/frontmatter'
import { parseNote, serializeNote } from '../utils/frontmatter'
import { useSettingsStore } from './settings'
import { debounce } from '../utils/debounce'

const ID_DIGITS = 5
const ID_STORAGE_KEY = 'jazz-note:next-id'
const ignoreWatcher = new Set<string>()

const pad = (n: number) => String(n).padStart(ID_DIGITS, '0')

function computeAndStoreNextId(notes: Note[]): string {
  const max = notes.reduce((m, n) => {
    const id = parseInt(n.meta.id || '', 10)
    return Number.isNaN(id) ? m : Math.max(m, id)
  }, 0)
  const stored = parseInt(localStorage.getItem(ID_STORAGE_KEY) || '', 10)
  const next = Math.max(max, Number.isNaN(stored) ? 0 : stored) + 1
  localStorage.setItem(ID_STORAGE_KEY, String(next))
  return pad(next)
}

export interface Note {
  relPath: string
  title: string
  meta: NoteMeta
  content: string
  body: string
}

export type SidebarSelection =
  | { type: 'all' }
  | { type: 'today' }
  | { type: 'tomorrow' }
  | { type: 'week' }
  | { type: 'later' }
  | { type: 'nodate' }
  | { type: 'folder'; path: string }

export type SortBy = 'date' | 'due'

interface NotesState {
  notes: Note[]
  folders: string[]
  currentNote: Note | null
  sidebarSelection: SidebarSelection
  searchQuery: string
  sortBy: SortBy
  loading: boolean
  notesPath: string
  dirtyNotes: Set<string>

  setNotesPath: (path: string) => void
  loadNotes: () => Promise<void>
  setCurrentNote: (relPath: string | null) => Promise<void>
  updateCurrentNote: (body: string) => void
  updateNoteMeta: (meta: Partial<NoteMeta>) => void
  saveCurrentNote: () => Promise<boolean>
  createNote: (title: string, onCreated?: (relPath: string) => void) => Promise<string>
  deleteNote: (relPath: string) => Promise<void>
  handleExternalChange: (relPath: string) => void
  setSidebarSelection: (sel: SidebarSelection) => void
  setSearchQuery: (q: string) => void
  setSortBy: (s: SortBy) => void
  createFolder: (name: string) => Promise<void>
}

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],
  folders: [],
  currentNote: null,
  sidebarSelection: { type: 'all' },
  searchQuery: '',
  sortBy: 'date',
  loading: false,
  notesPath: '',
  dirtyNotes: new Set(),

  setNotesPath: (path: string) => set({ notesPath: path }),

  loadNotes: async () => {
    set({ loading: true })
    const saved = useSettingsStore.getState().notesPath
    const path = saved || await window.jazz.getPath()
    if (!saved) useSettingsStore.getState().setNotesPath(path)
    set({ notesPath: path })
    const entries = await window.jazz.readDirRecursive(path)
    const notes: Note[] = []
    const folders: string[] = []
    for (const entry of entries) {
      if (entry.endsWith('/')) {
        folders.push(entry.slice(0, -1))
      } else {
        const raw = await window.jazz.readFile(entry, path)
        const data = parseNote(raw)
        notes.push({
          relPath: entry,
          title: data.meta.title,
          meta: data.meta,
          content: raw,
          body: data.content,
        })
      }
    }
    for (const note of notes) {
      if (!note.meta.id) {
        const id = computeAndStoreNextId(notes)
        note.meta = { ...note.meta, id }
        note.title = note.meta.title
        await window.jazz.writeFile(note.relPath, serializeNote(note.meta, note.body), path)
      }
    }
    set({ notes, folders, loading: false })
  },

  setCurrentNote: async (relPath: string | null) => {
    const { currentNote, saveCurrentNote, notesPath } = get()
    if (currentNote && get().dirtyNotes.has(currentNote.relPath)) {
      await saveCurrentNote()
    }
    if (!relPath) return
    const raw = await window.jazz.readFile(relPath, notesPath || undefined)
    const data = parseNote(raw)
    const note: Note = {
      relPath,
      title: data.meta.title,
      meta: data.meta,
      content: raw,
      body: data.content,
    }
    const dirty = new Set(get().dirtyNotes)
    dirty.delete(relPath)
    set({ currentNote: note, dirtyNotes: dirty })
  },

  updateCurrentNote: (body: string) => {
    const { currentNote } = get()
    if (!currentNote) return
    const dirty = new Set(get().dirtyNotes)
    dirty.add(currentNote.relPath)
    set({
      currentNote: { ...currentNote, body },
      dirtyNotes: dirty,
    })
  },

  updateNoteMeta: (meta: Partial<NoteMeta>) => {
    const { currentNote } = get()
    if (!currentNote) return
    const newMeta = { ...currentNote.meta, ...meta }
    const dirty = new Set(get().dirtyNotes)
    dirty.add(currentNote.relPath)
    set({
      currentNote: { ...currentNote, meta: newMeta },
      dirtyNotes: dirty,
    })
  },

  saveCurrentNote: async () => {
    const { currentNote, notesPath } = get()
    if (!currentNote) return true
    const meta = { ...currentNote.meta }
    const raw = serializeNote(meta, currentNote.body)
    try {
      await window.jazz.writeFile(currentNote.relPath, raw, notesPath)
    } catch {
      return false
    }
    const dirty = new Set(get().dirtyNotes)
    dirty.delete(currentNote.relPath)
    set({
      currentNote: { ...currentNote, content: raw },
      dirtyNotes: dirty,
    })
    return true
  },

  createNote: async (title: string, onCreated?: (relPath: string) => void) => {
    const { notesPath, notes } = get()
    const now = new Date().toISOString()
    const id = computeAndStoreNextId(notes)
    const filename = `${id}.md`
    const finalTitle = title.trim() || `#${id}`
    const meta: NoteMeta = {
      id,
      title: finalTitle,
      created: now,
      updated: now,
    }
    const raw = serializeNote(meta, '')
    ignoreWatcher.add(filename)
    setTimeout(() => ignoreWatcher.delete(filename), 3000)
    try {
      await window.jazz.createFile(filename, raw, notesPath)
    } catch (e) {
      ignoreWatcher.delete(filename)
      throw e
    }
    onCreated?.(filename)
    set({
      notes: [
        ...notes,
        {
          relPath: filename,
          title: finalTitle,
          meta,
          content: raw,
          body: '',
        },
      ],
    })
    return filename
  },

  handleExternalChange: (relPath: string) => {
    const rel = relPath.replace(/^\/+/, '')
    if (ignoreWatcher.has(rel)) return
    void debouncedReload()
  },

  deleteNote: async (relPath: string) => {
    const { notesPath } = get()
    await window.jazz.deleteFile(relPath, notesPath)
    if (get().currentNote?.relPath === relPath) {
      set({ currentNote: null })
    }
    await get().loadNotes()
  },

  setSidebarSelection: (sel) => set({ sidebarSelection: sel }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  setSortBy: (s) => set({ sortBy: s }),

  createFolder: async (name: string) => {
    const { notesPath } = get()
    await window.jazz.createDir(name, notesPath)
    await get().loadNotes()
  },
}))

const debouncedReload = debounce(() => {
  void useNotesStore.getState().loadNotes()
}, 250)
