import { useSettingsStore } from '../stores/settings'
import { palettes } from '../theme/themes'
import { useColors, useIsDark } from '../theme'

export default function SettingsDialog() {
  const colors = useColors()
  const isDark = useIsDark()
  const showSettings = useSettingsStore((s) => s.showSettings)
  const closeSettings = useSettingsStore((s) => s.closeSettings)
  const palette = useSettingsStore((s) => s.palette)
  const lang = useSettingsStore((s) => s.lang)
  const setPalette = useSettingsStore((s) => s.setPalette)
  const toggleDark = useSettingsStore((s) => s.toggleDark)
  const setLang = useSettingsStore((s) => s.setLang)

  if (!showSettings) return null

  return (
    <div style={overlayStyle} onClick={closeSettings}>
      <div style={dialogStyle(colors)} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          <span style={titleStyle(colors)}>Настройки</span>
          <button style={closeBtnStyle(colors)} onClick={closeSettings}>×</button>
        </div>

        <div style={bodyStyle}>
          <div style={groupStyle}>
            <label style={labelStyle(colors)}>Тема</label>
            <div style={themeListStyle}>
              {palettes.map((p) => (
                <button
                  key={p.id}
                  style={{
                    ...themeBtnStyle(colors),
                    ...(palette === p.id ? themeBtnActiveStyle(colors) : {}),
                  }}
                  onClick={() => setPalette(p.id)}
                >
                  <div style={swatchRowStyle}>
                    {(['bg', 'red', 'green', 'yellow', 'blue', 'purple'] as const).map((k) => (
                      <span
                        key={k}
                        style={{
                          ...swatchStyle,
                          background: isDark ? p.dark.colors[k] : p.light.colors[k],
                        }}
                      />
                    ))}
                  </div>
                  <span style={themeLabelStyle(colors)}>{p.label}</span>
                  {palette === p.id && (
                    <span style={currentBadgeStyle(colors)}>✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div style={groupStyle}>
            <label style={labelStyle(colors)}>Светлая / Тёмная</label>
            <button
              style={toggleBtnStyle(colors)}
              onClick={toggleDark}
            >
              <span style={toggleIconStyle}>{isDark ? '🌙' : '☀️'}</span>
              <span>{isDark ? 'Тёмная' : 'Светлая'}</span>
            </button>
          </div>

          <div style={groupStyle}>
            <label style={labelStyle(colors)}>Язык</label>
            <select
              style={selectStyle(colors)}
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

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
}
const dialogStyle = (c: any) => ({
  background: c.bgPopup,
  border: `1px solid ${c.border}`,
  borderRadius: 10,
  width: 460,
  maxWidth: '90vw' as const,
  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
})
const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '14px 18px',
  borderBottom: '1px solid var(--border)',
}
const titleStyle = (c: any) => ({
  fontSize: 16,
  fontWeight: 700,
  color: c.fg,
})
const closeBtnStyle = (c: any) => ({
  fontSize: 20,
  color: c.comment,
  padding: '0 4px',
})
const bodyStyle: React.CSSProperties = {
  padding: '16px 18px',
  display: 'flex',
  flexDirection: 'column',
  gap: 20,
}
const groupStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
}
const labelStyle = (c: any) => ({
  fontSize: 12,
  color: c.comment,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
})
const themeListStyle: React.CSSProperties = {
  display: 'flex',
  gap: 8,
  flexWrap: 'wrap',
}
const themeBtnStyle = (c: any) => ({
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'center',
  gap: 6,
  padding: 10,
  borderRadius: 8,
  border: `2px solid ${c.border}`,
  background: c.bg,
  cursor: 'pointer',
  transition: 'border-color 0.15s',
  minWidth: 110,
  position: 'relative' as const,
})
const themeBtnActiveStyle = (c: any) => ({
  borderColor: c.blue,
})
const swatchRowStyle: React.CSSProperties = {
  display: 'flex',
  gap: 3,
}
const swatchStyle: React.CSSProperties = {
  width: 14,
  height: 14,
  borderRadius: 3,
}
const themeLabelStyle = (c: any) => ({
  fontSize: 11,
  color: c.fg,
  fontWeight: 500,
})
const currentBadgeStyle = (c: any) => ({
  fontSize: 10,
  color: c.blue,
  fontWeight: 700,
  position: 'absolute' as const,
  top: 4,
  right: 6,
})
const toggleBtnStyle = (c: any) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '10px 14px',
  borderRadius: 8,
  border: `1px solid ${c.border}`,
  background: c.bg,
  color: c.fg,
  fontSize: 13,
  cursor: 'pointer',
  width: '100%',
  textAlign: 'left' as const,
})
const toggleIconStyle: React.CSSProperties = {
  fontSize: 16,
}
const selectStyle = (c: any) => ({
  padding: '8px 12px',
  background: c.bg,
  border: `1px solid ${c.border}`,
  borderRadius: 6,
  color: c.fg,
  fontSize: 13,
  cursor: 'pointer',
})
