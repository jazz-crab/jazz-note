import { useSettingsStore } from '../stores/settings'
import { palettes, getVariant } from './themes'
import type { ThemeColors, PaletteId, ThemePalette, PaletteVariant } from './themes'

export type { ThemeColors, PaletteId, ThemePalette, PaletteVariant }
export { palettes, getVariant }

export function useColors(): ThemeColors {
  const id = useSettingsStore((s) => s.palette)
  const isDark = useSettingsStore((s) => s.isDark)
  return getVariant(id, isDark).colors
}

export function usePriorityColors(): Record<number, string> {
  const id = useSettingsStore((s) => s.palette)
  const isDark = useSettingsStore((s) => s.isDark)
  return getVariant(id, isDark).priorityColors
}

export function useNoteColors(): Record<string, string> {
  const id = useSettingsStore((s) => s.palette)
  const isDark = useSettingsStore((s) => s.isDark)
  return getVariant(id, isDark).noteColors
}

export function useIsDark(): boolean {
  return useSettingsStore((s) => s.isDark)
}
