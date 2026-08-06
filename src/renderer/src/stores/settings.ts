import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { PaletteId } from '../theme/themes'
import type { Lang } from '../utils/i18n'
import type { FontId } from '../utils/fonts'

interface SettingsState {
  showSettings: boolean
  palette: PaletteId
  isDark: boolean
  lang: Lang
  font: FontId
  notesPath: string
  showCountdown: boolean
  toggleSettings: () => void
  openSettings: () => void
  closeSettings: () => void
  setPalette: (palette: PaletteId) => void
  toggleDark: () => void
  setLang: (lang: Lang) => void
  setFont: (font: FontId) => void
  setNotesPath: (path: string) => void
  setShowCountdown: (show: boolean) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      showSettings: false,
      palette: 'tokyonight',
      isDark: true,
      lang: 'ru',
      font: 'neon',
      notesPath: '',
      showCountdown: true,
      toggleSettings: () => set((s) => ({ showSettings: !s.showSettings })),
      openSettings: () => set({ showSettings: true }),
      closeSettings: () => set({ showSettings: false }),
      setPalette: (palette) => set({ palette }),
      toggleDark: () => set((s) => ({ isDark: !s.isDark })),
      setLang: (lang) => set({ lang }),
      setFont: (font) => set({ font }),
      setNotesPath: (notesPath) => set({ notesPath }),
      setShowCountdown: (showCountdown) => set({ showCountdown }),
    }),
    {
      name: 'jazz-settings',
      partialize: (s) => ({
        palette: s.palette,
        isDark: s.isDark,
        lang: s.lang,
        font: s.font,
        notesPath: s.notesPath,
        showCountdown: s.showCountdown,
      }),
    }
  )
)