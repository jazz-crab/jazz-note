import { create } from 'zustand'
import { debounce } from '../utils/debounce'

const MAX_STEPS = 200
const PERSIST_DEBOUNCE_MS = 300

export interface HistoryStacks {
  undo: string[]
  redo: string[]
}

interface ToastState {
  toast: { message: string; nonce: number } | null
  showToast: (message: string) => void
}

export const useHistoryToast = create<ToastState>((set) => ({
  toast: null,
  showToast: (message) => set({ toast: { message, nonce: Date.now() } }),
}))

const stacks = new Map<string, HistoryStacks>()
let loaded = false
let dirty = false

function getStacks(relPath: string): HistoryStacks {
  let s = stacks.get(relPath)
  if (!s) {
    s = { undo: [], redo: [] }
    stacks.set(relPath, s)
  }
  return s
}

function cap(arr: string[]): string[] {
  return arr.length > MAX_STEPS ? arr.slice(arr.length - MAX_STEPS) : arr
}

const persist = debounce(async () => {
  if (!dirty) return
  dirty = false
  const data: Record<string, HistoryStacks> = {}
  for (const [key, value] of stacks) data[key] = value
  try {
    await window.jazz.writeHistory(data)
  } catch {
    // Non-fatal: history just won't survive the restart this time.
  }
}, PERSIST_DEBOUNCE_MS)

function schedulePersist() {
  dirty = true
  persist()
}

export const historyStore = {
  async init(): Promise<void> {
    if (loaded) return
    loaded = true
    try {
      const data = (await window.jazz.readHistory()) as Record<string, HistoryStacks>
      for (const [key, value] of Object.entries(data)) {
        if (!value || !Array.isArray(value.undo) || !Array.isArray(value.redo)) continue
        stacks.set(key, { undo: cap(value.undo), redo: cap(value.redo) })
      }
    } catch {
      // Ignore corrupt history files.
    }
  },

  push(relPath: string, before: string): void {
    const s = getStacks(relPath)
    s.undo = cap([...s.undo, before])
    s.redo = []
    schedulePersist()
  },

  undo(
    relPath: string,
    current: string
  ): { body: string; remainingUndo: number } | null {
    const s = getStacks(relPath)
    const prev = s.undo.pop()
    if (prev === undefined) return null
    s.redo = cap([...s.redo, current])
    schedulePersist()
    return { body: prev, remainingUndo: s.undo.length }
  },

  redo(
    relPath: string,
    current: string
  ): { body: string; remainingRedo: number } | null {
    const s = getStacks(relPath)
    const next = s.redo.pop()
    if (next === undefined) return null
    s.undo = cap([...s.undo, current])
    schedulePersist()
    return { body: next, remainingRedo: s.redo.length }
  },

  remainingUndo(relPath: string): number {
    return getStacks(relPath).undo.length
  },

  remainingRedo(relPath: string): number {
    return getStacks(relPath).redo.length
  },
}
