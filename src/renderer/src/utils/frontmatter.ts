export interface NoteMeta {
  title: string
  priority?: 0 | 1 | 2 | 3 | 4
  due?: string
  color?: string
  created?: string
  updated?: string
  tags?: string[]
}

export interface NoteData {
  meta: NoteMeta
  content: string
  raw: string
}

export function parseNote(raw: string): NoteData {
  const meta: NoteMeta = { title: '' }

  let body = raw
  if (raw.startsWith('---')) {
    const end = raw.indexOf('---', 3)
    if (end !== -1) {
      const fm = raw.slice(3, end).trim()
      body = raw.slice(end + 3).trim()
      for (const line of fm.split('\n')) {
        const colon = line.indexOf(':')
        if (colon === -1) continue
        const key = line.slice(0, colon).trim()
        let val: any = line.slice(colon + 1).trim()
        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1)
        if (key === 'title') meta.title = val
        else if (key === 'priority') meta.priority = Number(val) as any
        else if (key === 'due') meta.due = val
        else if (key === 'color') meta.color = val
        else if (key === 'created') meta.created = val
        else if (key === 'updated') meta.updated = val
        else if (key === 'tags') {
          meta.tags = val.replace(/[\[\]]/g, '').split(',').map((t: string) => t.trim()).filter(Boolean)
        }
      }
    }
  }

  if (!meta.title) {
    const firstLine = body.split('\n')[0] || ''
    meta.title = firstLine.replace(/^#\s*/, '').trim() || 'Untitled'
  }

  return { meta, content: body, raw }
}

export function serializeNote(meta: NoteMeta, content: string): string {
  const now = new Date().toISOString()
  const lines = ['---']
  lines.push(`title: "${meta.title}"`)
  if (meta.priority) lines.push(`priority: ${meta.priority}`)
  if (meta.due) lines.push(`due: "${meta.due}"`)
  if (meta.color) lines.push(`color: "${meta.color}"`)
  if (meta.created) lines.push(`created: "${meta.created}"`)
  lines.push(`updated: "${now}"`)
  if (meta.tags?.length) lines.push(`tags: [${meta.tags.join(', ')}]`)
  lines.push('---')
  lines.push('')
  if (content) lines.push(content)
  return lines.join('\n')
}
