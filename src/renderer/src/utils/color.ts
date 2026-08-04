function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  const v = h.length === 3
    ? h.split('').map((c) => c + c).join('')
    : h
  const n = parseInt(v, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function toHex(n: number): string {
  return Math.round(Math.max(0, Math.min(255, n))).toString(16).padStart(2, '0')
}

export function mixHex(a: string, b: string, t: number): string {
  const ca = hexToRgb(a)
  const cb = hexToRgb(b)
  const r = ca[0] * t + cb[0] * (1 - t)
  const g = ca[1] * t + cb[1] * (1 - t)
  const bl = ca[2] * t + cb[2] * (1 - t)
  return `#${toHex(r)}${toHex(g)}${toHex(bl)}`
}
