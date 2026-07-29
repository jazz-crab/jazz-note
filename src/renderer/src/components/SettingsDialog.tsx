import { useSettingsStore } from '../stores/settings'
import { themes } from '../theme/themes'

export default function SettingsDialog() {
  const showSettings = useSettingsStore((s) => s.showSettings)
  const closeSettings = useSettingsStore((s) => s.closeSettings)
  const theme = useSettingsStore((s) => s.theme)
  const lang = useSettingsStore((s) => s.lang)
  const setTheme = useSettingsStore((s) => s.setTheme)
  const setLang = useSettingsStore((s) => s.setLang)

  if (!showSettings) return null

  return (
    <div style={styles.overlay} onClick={closeSettings}>
      <div style={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <span style={styles.title}>Настройки</span>
          <button style={styles.closeBtn} onClick={closeSettings}>×</button>
        </div>

        <div style={styles.body}>
          <div style={styles.group}>
            <label style={styles.label}>Тема</label>
            <div style={styles.themeList}>
              {themes.map((t) => (
                <button
                  key={t.id}
                  style={{
                    ...styles.themeBtn,
                    ...(theme === t.id ? styles.themeBtnActive : {}),
                  }}
                  onClick={() => setTheme(t.id)}
                >
                  <div style={styles.swatchRow}>
                    {(['bg', 'red', 'green', 'yellow', 'blue', 'purple'] as const).map((k) => (
                      <span
                        key={k}
                        style={{ ...styles.swatch, background: t.colors[k] }}
                      />
                    ))}
                  </div>
                  <span style={styles.themeLabel}>{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div style={styles.group}>
            <label style={styles.label}>Язык</label>
            <select
              style={styles.select}
              value={lang}
              onChange={(e) => setLang(e.target.value as any)}
            >
              <option value="ru">Русский</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  dialog: {
    background: 'var(--bg-popup)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    width: 420,
    maxWidth: '90vw',
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 18px',
    borderBottom: '1px solid var(--border)',
  },
  title: {
    fontSize: 16,
    fontWeight: 700,
    color: 'var(--fg)',
  },
  closeBtn: {
    fontSize: 20,
    color: 'var(--comment)',
    padding: '0 4px',
  },
  body: {
    padding: '16px 18px',
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  group: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  label: {
    fontSize: 12,
    color: 'var(--comment)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  themeList: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap' as const,
  },
  themeBtn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
    padding: 10,
    borderRadius: 8,
    border: '2px solid var(--border)',
    background: 'var(--bg)',
    cursor: 'pointer',
    transition: 'border-color 0.15s',
    minWidth: 120,
  },
  themeBtnActive: {
    borderColor: 'var(--blue)',
  },
  swatchRow: {
    display: 'flex',
    gap: 3,
  },
  swatch: {
    width: 14,
    height: 14,
    borderRadius: 3,
  },
  themeLabel: {
    fontSize: 12,
    color: 'var(--fg)',
  },
  select: {
    padding: '8px 12px',
    background: 'var(--bg)',
    border: '1px solid var(--border)',
    borderRadius: 6,
    color: 'var(--fg)',
    fontSize: 13,
    cursor: 'pointer',
  },
}
