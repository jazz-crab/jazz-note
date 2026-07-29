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

export interface PaletteVariant {
  colors: ThemeColors
  priorityColors: Record<number, string>
  noteColors: Record<string, string>
}

export interface ThemePalette {
  id: PaletteId
  label: string
  dark: PaletteVariant
  light: PaletteVariant
}

export type PaletteId = 'tokyonight' | 'everforest' | 'catppuccin'

export const palettes: ThemePalette[] = [
  {
    id: 'tokyonight',
    label: 'TokyoNight',
    dark: {
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
        0: '#565f89', 1: '#7aa2f7', 2: '#e0af68', 3: '#ff9e64', 4: '#f7768e',
      },
      noteColors: {
        red: '#f7768e', orange: '#ff9e64', yellow: '#e0af68',
        green: '#9ece6a', blue: '#7aa2f7', purple: '#9d7cd8', pink: '#bb9af7',
      },
    },
    light: {
      colors: {
        bg: '#e1e2e7',
        bgAlt: '#c4c8da',
        bgHighlight: '#b4b8ce',
        bgSidebar: '#d8dae0',
        bgPopup: '#e1e2e7',
        bgVisual: '#b4b8ce',
        border: '#a1a6c0',
        fg: '#3760bf',
        fgDark: '#2e4a8a',
        fgGutter: '#8489a7',
        fgSidebar: '#3760bf',
        comment: '#8489a7',
        red: '#c64343',
        green: '#6e9a4a',
        green1: '#3f8a7a',
        yellow: '#b88c3a',
        orange: '#c87a3a',
        blue: '#3760bf',
        blue0: '#2e4a8a',
        purple: '#7a5ab3',
        magenta: '#a65a8a',
        cyan: '#3f8a8a',
        teal: '#3a8a7a',
      },
      priorityColors: {
        0: '#8489a7', 1: '#3760bf', 2: '#b88c3a', 3: '#c87a3a', 4: '#c64343',
      },
      noteColors: {
        red: '#c64343', orange: '#c87a3a', yellow: '#b88c3a',
        green: '#6e9a4a', blue: '#3760bf', purple: '#7a5ab3', pink: '#a65a8a',
      },
    },
  },
  {
    id: 'everforest',
    label: 'Everforest',
    dark: {
      colors: {
        bg: '#2d353b',
        bgAlt: '#343f44',
        bgHighlight: '#3d484d',
        bgSidebar: '#272e33',
        bgPopup: '#2d353b',
        bgVisual: '#3d484d',
        border: '#4a555b',
        fg: '#d3c6aa',
        fgDark: '#b9c5b0',
        fgGutter: '#6a7a7a',
        fgSidebar: '#d3c6aa',
        comment: '#859289',
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
        0: '#859289', 1: '#7fbbb3', 2: '#dbbc7f', 3: '#e69875', 4: '#e67e80',
      },
      noteColors: {
        red: '#e67e80', orange: '#e69875', yellow: '#dbbc7f',
        green: '#a7c080', blue: '#7fbbb3', purple: '#d699b6', pink: '#c68cb5',
      },
    },
    light: {
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
        0: '#9da9a0', 1: '#7fbbb3', 2: '#dbbc7f', 3: '#e69875', 4: '#e67e80',
      },
      noteColors: {
        red: '#e67e80', orange: '#e69875', yellow: '#dbbc7f',
        green: '#a7c080', blue: '#7fbbb3', purple: '#d699b6', pink: '#c68cb5',
      },
    },
  },
  {
    id: 'catppuccin',
    label: 'Catppuccin',
    dark: {
      colors: {
        bg: '#1e1e2e',
        bgAlt: '#313244',
        bgHighlight: '#363a4f',
        bgSidebar: '#181825',
        bgPopup: '#1e1e2e',
        bgVisual: '#313244',
        border: '#45475a',
        fg: '#cdd6f4',
        fgDark: '#bac2de',
        fgGutter: '#585b70',
        fgSidebar: '#cdd6f4',
        comment: '#6c7086',
        red: '#f38ba8',
        green: '#a6e3a1',
        green1: '#94e2d5',
        yellow: '#f9e2af',
        orange: '#fab387',
        blue: '#89b4fa',
        blue0: '#74c7ec',
        purple: '#cba6f7',
        magenta: '#f5c2e7',
        cyan: '#89dceb',
        teal: '#94e2d5',
      },
      priorityColors: {
        0: '#6c7086', 1: '#89b4fa', 2: '#f9e2af', 3: '#fab387', 4: '#f38ba8',
      },
      noteColors: {
        red: '#f38ba8', orange: '#fab387', yellow: '#f9e2af',
        green: '#a6e3a1', blue: '#89b4fa', purple: '#cba6f7', pink: '#f5c2e7',
      },
    },
    light: {
      colors: {
        bg: '#eff1f5',
        bgAlt: '#e6e9ef',
        bgHighlight: '#ccd0da',
        bgSidebar: '#e6e9ef',
        bgPopup: '#eff1f5',
        bgVisual: '#ccd0da',
        border: '#bcc0cc',
        fg: '#4c4f69',
        fgDark: '#5c5f77',
        fgGutter: '#9ca0b0',
        fgSidebar: '#4c4f69',
        comment: '#8c8fa1',
        red: '#d20f39',
        green: '#40a02b',
        green1: '#179299',
        yellow: '#df8e1d',
        orange: '#fe640b',
        blue: '#1e66f5',
        blue0: '#04a5e5',
        purple: '#8839ef',
        magenta: '#ea76cb',
        cyan: '#04a5e5',
        teal: '#179299',
      },
      priorityColors: {
        0: '#8c8fa1', 1: '#1e66f5', 2: '#df8e1d', 3: '#fe640b', 4: '#d20f39',
      },
      noteColors: {
        red: '#d20f39', orange: '#fe640b', yellow: '#df8e1d',
        green: '#40a02b', blue: '#1e66f5', purple: '#8839ef', pink: '#ea76cb',
      },
    },
  },
]

export function getPalette(id: PaletteId): ThemePalette {
  return palettes.find((p) => p.id === id) ?? palettes[0]
}

export function getVariant(id: PaletteId, isDark: boolean): PaletteVariant {
  const p = getPalette(id)
  return isDark ? p.dark : p.light
}

export function getThemeCSSVars(colors: ThemeColors): Record<string, string> {
  return {
    '--bg': colors.bg,
    '--bg-alt': colors.bgAlt,
    '--bg-highlight': colors.bgHighlight,
    '--bg-sidebar': colors.bgSidebar,
    '--bg-popup': colors.bgPopup,
    '--bg-visual': colors.bgVisual,
    '--border': colors.border,
    '--fg': colors.fg,
    '--fg-dark': colors.fgDark,
    '--fg-gutter': colors.fgGutter,
    '--fg-sidebar': colors.fgSidebar,
    '--comment': colors.comment,
    '--red': colors.red,
    '--green': colors.green,
    '--green1': colors.green1,
    '--yellow': colors.yellow,
    '--orange': colors.orange,
    '--blue': colors.blue,
    '--blue0': colors.blue0,
    '--purple': colors.purple,
    '--magenta': colors.magenta,
    '--cyan': colors.cyan,
    '--teal': colors.teal,
  }
}
