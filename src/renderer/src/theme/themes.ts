export interface ThemeColors {
  bg: string
  bgAlt: string
  bgHighlight: string
  bgSidebar: string
  bgPopup: string
  bgVisual: string
  border: string
  fg: string
  fgDark: string
  fgGutter: string
  fgSidebar: string
  comment: string
  red: string
  green: string
  green1: string
  yellow: string
  orange: string
  blue: string
  blue0: string
  purple: string
  magenta: string
  cyan: string
  teal: string
}

export interface ThemeDef {
  id: ThemeId
  label: string
  colors: ThemeColors
  priorityColors: Record<number, string>
  noteColors: Record<string, string>
}

export type ThemeId = 'tokyonight' | 'everforest'

export const themes: ThemeDef[] = [
  {
    id: 'tokyonight',
    label: 'TokyoNight',
    colors: {
      bg: '#1a1b26',
      bgAlt: '#24283b',
      bgHighlight: '#292e42',
      bgSidebar: '#16161e',
      bgPopup: '#1f2335',
      bgVisual: '#283457',
      border: '#2f3b54',
      fg: '#c0caf5',
      fgDark: '#a9b1d6',
      fgGutter: '#3b4261',
      fgSidebar: '#a9b1d6',
      comment: '#565f89',
      red: '#f7768e',
      green: '#9ece6a',
      green1: '#73daca',
      yellow: '#e0af68',
      orange: '#ff9e64',
      blue: '#7aa2f7',
      blue0: '#3d59a1',
      purple: '#9d7cd8',
      magenta: '#bb9af7',
      cyan: '#7dcfff',
      teal: '#1abc9c',
    },
    priorityColors: {
      0: '#565f89',
      1: '#7aa2f7',
      2: '#e0af68',
      3: '#ff9e64',
      4: '#f7768e',
    },
    noteColors: {
      red: '#f7768e',
      orange: '#ff9e64',
      yellow: '#e0af68',
      green: '#9ece6a',
      blue: '#7aa2f7',
      purple: '#9d7cd8',
      pink: '#bb9af7',
    },
  },
  {
    id: 'everforest',
    label: 'Everforest Light',
    colors: {
      bg: '#fdf6e3',
      bgAlt: '#f4f0d9',
      bgHighlight: '#ede7cc',
      bgSidebar: '#f8f5e6',
      bgPopup: '#fdf6e3',
      bgVisual: '#e8e0c8',
      border: '#d5cdb6',
      fg: '#5c6a72',
      fgDark: '#4a555e',
      fgGutter: '#a6b0a0',
      fgSidebar: '#5c6a72',
      comment: '#9da9a0',
      red: '#e67e80',
      green: '#a7c080',
      green1: '#83c092',
      yellow: '#dbbc7f',
      orange: '#e69875',
      blue: '#7fbbb3',
      blue0: '#5a9a8a',
      purple: '#d699b6',
      magenta: '#c68cb5',
      cyan: '#82b8c0',
      teal: '#69a59d',
    },
    priorityColors: {
      0: '#9da9a0',
      1: '#7fbbb3',
      2: '#dbbc7f',
      3: '#e69875',
      4: '#e67e80',
    },
    noteColors: {
      red: '#e67e80',
      orange: '#e69875',
      yellow: '#dbbc7f',
      green: '#a7c080',
      blue: '#7fbbb3',
      purple: '#d699b6',
      pink: '#c68cb5',
    },
  },
]

export function getTheme(id: ThemeId): ThemeDef {
  return themes.find((t) => t.id === id) ?? themes[0]
}

export function getThemeCSSVars(theme: ThemeColors): Record<string, string> {
  return {
    '--bg': theme.bg,
    '--bg-alt': theme.bgAlt,
    '--bg-highlight': theme.bgHighlight,
    '--bg-sidebar': theme.bgSidebar,
    '--bg-popup': theme.bgPopup,
    '--bg-visual': theme.bgVisual,
    '--border': theme.border,
    '--fg': theme.fg,
    '--fg-dark': theme.fgDark,
    '--fg-gutter': theme.fgGutter,
    '--fg-sidebar': theme.fgSidebar,
    '--comment': theme.comment,
    '--red': theme.red,
    '--green': theme.green,
    '--green1': theme.green1,
    '--yellow': theme.yellow,
    '--orange': theme.orange,
    '--blue': theme.blue,
    '--blue0': theme.blue0,
    '--purple': theme.purple,
    '--magenta': theme.magenta,
    '--cyan': theme.cyan,
    '--teal': theme.teal,
  }
}
