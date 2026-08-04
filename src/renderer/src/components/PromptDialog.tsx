import { useEffect, useState } from 'react'
import { useColors } from '../theme'

interface Props {
  message: string
  placeholder?: string
  initialValue?: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: (value: string) => void
  onCancel: () => void
}

export default function PromptDialog({
  message,
  placeholder = '',
  initialValue = '',
  confirmLabel = 'OK',
  cancelLabel = 'Отмена',
  onConfirm,
  onCancel,
}: Props) {
  const colors = useColors()
  const [value, setValue] = useState(initialValue)
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        requestClose(onCancel)()
      }
    }
    window.addEventListener('keydown', handleKey, true)
    return () => window.removeEventListener('keydown', handleKey, true)
  }, [onCancel])

  const requestClose = (fn: () => void) => () => {
    if (closing) return
    setClosing(true)
    setTimeout(fn, 150)
  }

  const handleConfirm = () => {
    const trimmed = value.trim()
    if (!trimmed) return
    requestClose(() => onConfirm(trimmed))()
  }

  return (
    <div style={overlayStyle(closing)} onClick={requestClose(onCancel)}>
      <div style={dialogStyle(colors, closing)} onClick={(e) => e.stopPropagation()}>
        <div style={messageStyle(colors)}>{message}</div>
        <input
          style={inputStyle(colors)}
          value={value}
          placeholder={placeholder}
          autoFocus
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleConfirm()
          }}
        />
        <div style={actionsStyle}>
          <button style={cancelBtnStyle(colors)} onClick={requestClose(onCancel)}>
            {cancelLabel}
          </button>
          <button
            style={confirmBtnStyle(colors, !value.trim())}
            onClick={handleConfirm}
            disabled={!value.trim()}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

const overlayStyle = (closing: boolean): React.CSSProperties => ({
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 2000,
  animation: closing ? 'fadeOut 0.15s ease both' : 'fadeIn 0.15s ease both',
})
const dialogStyle = (c: any, closing: boolean) => ({
  background: c.bgPopup,
  border: `1px solid ${c.border}`,
  borderRadius: 10,
  padding: 24,
  minWidth: 300,
  maxWidth: '90vw' as const,
  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
  animation: closing ? 'dialogOut 0.15s ease both' : 'dialogIn 0.2s ease both',
})
const messageStyle = (c: any) => ({
  fontSize: 15,
  color: c.fg,
  marginBottom: 14,
  textAlign: 'center' as const,
})
const inputStyle = (c: any) => ({
  width: '100%',
  padding: '10px 12px',
  borderRadius: 6,
  border: `1px solid ${c.border}`,
  background: c.bg,
  color: c.fg,
  fontSize: 14,
  outline: 'none' as const,
})
const actionsStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 10,
  marginTop: 16,
}
const cancelBtnStyle = (c: any) => ({
  padding: '8px 20px',
  borderRadius: 6,
  border: `1px solid ${c.border}`,
  background: c.bg,
  color: c.fg,
  fontSize: 13,
  cursor: 'pointer',
})
const confirmBtnStyle = (c: any, disabled: boolean) => ({
  padding: '8px 20px',
  borderRadius: 6,
  border: 'none',
  background: c.blue,
  color: c.bg,
  fontSize: 13,
  fontWeight: 600,
  cursor: disabled ? 'default' : 'pointer',
  opacity: disabled ? 0.5 : 1,
})
