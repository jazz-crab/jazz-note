import { create } from 'zustand'
import type { NoteMeta, NoteData } from '../utils/frontmatter'
import { parseNote, serializeNote } from '../utils/frontmatter'

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

export type SortBy = 'date' | 'due' | 'priority'

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
  saveCurrentNote: () => Promise<void>
  createNote: (title: string) => Promise<void>
  deleteNote: (relPath: string) => Promise<void>
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
    const path = get().notesPath || await window.jazz.getPath()
    if (!get().notesPath) set({ notesPath: path })
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
    if (!currentNote) return
    const meta = { ...currentNote.meta }
    const raw = serializeNote(meta, currentNote.body)
    await window.jazz.writeFile(currentNote.relPath, raw, notesPath)
    const dirty = new Set(get().dirtyNotes)
    dirty.delete(currentNote.relPath)
    set({
      currentNote: { ...currentNote, content: raw },
      dirtyNotes: dirty,
    })
  },

  createNote: async (title: string) => {
    const { notesPath } = get()
    const now = new Date().toISOString()
    const filename = `${title.replace(/[^a-zA-Zа-яА-Я0-9\s-]/g, '').trim().replace(/\s+/g, '-')}.md`
    const meta: NoteMeta = {
      title,
      created: now,
    }
    const content = `# ${title}`
    const raw = serializeNote(meta, content)
    await window.jazz.createFile(filename, raw, notesPath)
    await get().loadNotes()
    await get().setCurrentNote(filename)
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
