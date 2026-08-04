export type FontId = 'argon' | 'neon' | 'krypton' | 'xenon' | 'radon'

export interface FontOption {
  id: FontId
  label: string
  family: string
  color: string
}

export const fontOptions: FontOption[] = [
  { id: 'argon', label: 'Monaspace Argon', family: 'Monaspace Argon', color: '#ff9d2e' },
  { id: 'neon', label: 'Monaspace Neon', family: 'Monaspace Neon', color: '#22c3e6' },
  { id: 'krypton', label: 'Monaspace Krypton', family: 'Monaspace Krypton', color: '#6ee75a' },
  { id: 'xenon', label: 'Monaspace Xenon', family: 'Monaspace Xenon', color: '#8a7cff' },
  { id: 'radon', label: 'Monaspace Radon', family: 'Monaspace Radon', color: '#ff6b8a' },
]

export function getFontFamily(id: FontId): string {
  return fontOptions.find((f) => f.id === id)?.family ?? fontOptions[0].family
}
