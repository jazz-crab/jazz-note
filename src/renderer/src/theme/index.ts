import { useSettingsStore } from '../stores/settings'
import { themes, getTheme } from './themes'
import type { ThemeColors, ThemeId, ThemeDef } from './themes'

export type { ThemeColors, ThemeId, ThemeDef }
export { themes, getTheme }

export function useColors(): ThemeColors {
  const id = useSettingsStore((s) => s.theme)
  return getTheme(id).colors
}

export function usePriorityColors(): Record<number, string> {
  const id = useSettingsStore((s) => s.theme)
  return getTheme(id).priorityColors
}

export function useNoteColors(): Record<string, string> {
  const id = useSettingsStore((s) => s.theme)
  return getTheme(id).noteColors
}
