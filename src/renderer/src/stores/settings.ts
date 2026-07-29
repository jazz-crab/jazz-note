import { create } from 'zustand'

interface SettingsState {
  showSettings: boolean
  toggleSettings: () => void
  openSettings: () => void
  closeSettings: () => void
}

export const useSettingsStore = create<SettingsState>((set) => ({
  showSettings: false,
  toggleSettings: () => set((s) => ({ showSettings: !s.showSettings })),
  openSettings: () => set({ showSettings: true }),
  closeSettings: () => set({ showSettings: false }),
}))
