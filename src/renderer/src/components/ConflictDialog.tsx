import { useEffect, useState } from 'react'
import { useColors } from '../theme'
import { useSettingsStore } from '../stores/settings'
import { useSyncStore, type ResolvePick } from '../stores/sync'
import { t } from '../utils/i18n'
import Modal from './Modal'

interface Props {
  onClose: () => void
}

const PREVIEW_LINES = 25

export default function ConflictDialog({ onClose }: Props) {
  const colors = useColors()
  const lang = useSettingsStore((s) => s.lang)
  const conflictedFiles = useSyncStore((s) => s.conflictedFiles)
  const picks = useSyncStore((s) => s.picks)
  const setPick = useSyncStore((s) => s.setPick)
  const resolveConflict = useSyncStore((s) => s.resolveConflict)
  const syncStatus = useSyncStore((s) => s.status)
  const [previews, setPreviews] = useState<Record<string, { local: string; remote: string }>>({})
  const [expanded, setExpanded] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    void (async () => {
      const path = useSettingsStore.getState().notesPath || (await window.jazz.getPath())
      const entries: Record<string, { local: string; remote: string }> = {}
      for (const file of conflictedFiles) {
        const [local, remote] = await Promise.all([
          window.jazz.gitShow(path, file, ':2'),
          window.jazz.gitShow(path, file, ':3'),
        ])
        entries[file] = { local: local ?? '', remote: remote ?? '' }
      }
      setPreviews(entries)
    })()
  }, [conflictedFiles])

  const pickFor = (file: string): ResolvePick | undefined => picks[file]

  const allPicked = conflictedFiles.every((f) => picks[f])

  const handleApply = async () => {
    setError(null)
    await resolveConflict(picks)
    if (useSyncStore.getState().status !== 'conflict') {
      onClose()
    } else {
      setError(t('sync.resolve.failed', lang))
    }
  }

  const snippet = (text: string): string => {
    const lines = text.split('\n')
    if (lines.length <= PREVIEW_LINES) return text
    return lines.slice(0, PREVIEW_LINES).join('\n') + '\n…'
  }

  return (
    <Modal title={t('sync.conflict.title', lang)} onClose={onClose}>
      <div style={listStyle}>
        {conflictedFiles.map((file) => {
          const p = previews[file]
          const isExpanded = expanded === file
          const pick = pickFor(file)
          return (
            <div key={file} style={fileStyle(colors)}>
              <div style={fileHeaderStyle}>
                <span style={fileNameStyle(colors)}>{file}</span>
                <span style={fileActionsStyle}>
                  <button
                    style={pickBtnStyle(colors, pick === 'local')}
                    onClick={() => setPick(file, 'local')}
                  >
                    {t('sync.local', lang)}
                  </button>
                  <button
                    style={pickBtnStyle(colors, pick === 'remote')}
                    onClick={() => setPick(file, 'remote')}
                  >
                    {t('sync.remote', lang)}
                  </button>
                  {p && (
                    <button
                      style={previewBtnStyle(colors)}
                      onClick={() => setExpanded(isExpanded ? null : file)}
                    >
                      {isExpanded ? t('sync.hide', lang) : t('sync.preview', lang)}
                    </button>
                  )}
                </span>
              </div>
              {isExpanded && p && (
                <div style={previewWrapStyle}>
                  <div style={previewColStyle}>
                    <div style={previewTitleStyle(colors, colors.blue)}>{t('sync.local', lang)}</div>
                    <pre style={preStyle(colors)}>{snippet(p.local)}</pre>
                  </div>
                  <div style={previewColStyle}>
                    <div style={previewTitleStyle(colors, colors.green)}>{t('sync.remote', lang)}</div>
                    <pre style={preStyle(colors)}>{snippet(p.remote)}</pre>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
      {error && <div style={errorStyle(colors)}>{error}</div>}
      <div style={actionsStyle}>
        <button style={btnStyle(colors, colors.comment)} onClick={onClose}>
          {t('cancel', lang)}
        </button>
        <button
          style={{ ...btnStyle(colors, colors.blue), ...(allPicked ? {} : { opacity: 0.5 }) }}
          disabled={!allPicked}
          onClick={() => void handleApply()}
        >
          {syncStatus === 'syncing' ? t('sync.syncing', lang) : t('sync.apply', lang)}
        </button>
      </div>
    </Modal>
  )
}

const listStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  maxHeight: '60vh',
  overflowY: 'auto',
}
const fileStyle = (c: any) => ({
  border: `1px solid ${c.border}`,
  borderRadius: 8,
  background: c.bgAlt,
  overflow: 'hidden',
})
const fileHeaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 8,
  padding: '8px 10px',
  flexWrap: 'wrap' as const,
}
const fileNameStyle = (c: any) => ({
  fontSize: 13,
  fontWeight: 600,
  color: c.fg,
  fontFamily: 'var(--app-font)',
  overflowWrap: 'anywhere' as const,
})
const fileActionsStyle: React.CSSProperties = {
  display: 'flex',
  gap: 6,
  flexShrink: 0,
}
const pickBtnStyle = (c: any, active: boolean) => ({
  padding: '4px 8px',
  borderRadius: 6,
  fontSize: 12,
  fontWeight: active ? 600 : 400,
  color: active ? c.bg : (c.fgDark),
  background: active ? c.blue : c.bgPopup,
  border: `1px solid ${c.border}`,
  cursor: 'pointer',
})
const previewBtnStyle = (c: any) => ({
  padding: '4px 8px',
  borderRadius: 6,
  fontSize: 12,
  color: c.cyan,
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
})
const previewWrapStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 8,
  padding: '0 10px 10px',
}
const previewColStyle: React.CSSProperties = {
  minWidth: 0,
}
const previewTitleStyle = (c: any, color: string) => ({
  fontSize: 11,
  fontWeight: 600,
  color,
  marginBottom: 4,
  textTransform: 'uppercase' as const,
})
const preStyle = (c: any) => ({
  margin: 0,
  padding: 8,
  borderRadius: 6,
  background: c.bgPopup,
  border: `1px solid ${c.border}`,
  fontSize: 11,
  lineHeight: 1.4,
  color: c.fgDark,
  whiteSpace: 'pre-wrap' as const,
  wordBreak: 'break-word' as const,
  maxHeight: 240,
  overflowY: 'auto' as const,
  fontFamily: 'var(--app-font)',
})
const errorStyle = (c: any) => ({
  fontSize: 12,
  color: c.red,
  marginTop: 8,
})
const actionsStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 8,
  marginTop: 12,
}
const btnStyle = (c: any, color: string) => ({
  padding: '6px 12px',
  borderRadius: 6,
  fontSize: 13,
  color,
  background: c.bgAlt,
  border: `1px solid ${c.border}`,
  cursor: 'pointer',
})
