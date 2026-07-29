export const colors = {
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
}

export const priorityColors: Record<number, string> = {
  0: colors.comment,
  1: colors.blue,
  2: colors.yellow,
  3: colors.orange,
  4: colors.red,
}

export const noteColors: Record<string, string> = {
  red: colors.red,
  orange: colors.orange,
  yellow: colors.yellow,
  green: colors.green,
  blue: colors.blue,
  purple: colors.purple,
  pink: colors.magenta,
}
