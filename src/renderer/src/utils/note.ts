export function replaceFirstHeading(body: string, title: string): string {
  const lines = body.split('\n')
  const idx = lines.findIndex((l) => l.trim() !== '')
  if (idx !== -1 && /^#+\s+/.test(lines[idx].trim())) {
    lines[idx] = lines[idx].replace(/^(#+\s+).*$/, (_m, prefix: string) => prefix + title)
  }
  return lines.join('\n')
}
