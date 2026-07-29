import { create } from 'zustand'
import type { PaletteId } from '../theme/themes'
import type { Lang } from '../utils/i18n'

interface SettingsState {
  showSettings: boolean
  palette: PaletteId
  isDark: boolean
  lang: Lang
  toggleSettings: () => void
  openSettings: () => void
  closeSettings: () => void
  setPalette: (palette: PaletteId) => void
  toggleDark: () => void
  setLang: (lang: Lang) => void
}

export const useSettingsStore = create<SettingsState>((set) => ({
  showSettings: false,
  palette: 'tokyonight',
  isDark: true,
  lang: 'ru',
  toggleSettings: () => set((s) => ({ showSettings: !s.showSettings })),
  openSettings: () => set({ showSettings: true }),
  closeSettings: () => set({ showSettings: false }),
  setPalette: (palette) => set({ palette }),
  toggleDark: () => set((s) => ({ isDark: !s.isDark })),
  setLang: (lang) => set({ lang }),
}))
