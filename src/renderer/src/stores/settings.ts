import { create } from 'zustand'
import type { ThemeId } from '../theme/themes'
import type { Lang } from '../utils/i18n'

interface SettingsState {
  showSettings: boolean
  theme: ThemeId
  lang: Lang
  toggleSettings: () => void
  openSettings: () => void
  closeSettings: () => void
  setTheme: (theme: ThemeId) => void
  setLang: (lang: Lang) => void
}

export const useSettingsStore = create<SettingsState>((set) => ({
  showSettings: false,
  theme: 'tokyonight',
  lang: 'ru',
  toggleSettings: () => set((s) => ({ showSettings: !s.showSettings })),
  openSettings: () => set({ showSettings: true }),
  closeSettings: () => set({ showSettings: false }),
  setTheme: (theme) => set({ theme }),
  setLang: (lang) => set({ lang }),
}))
