import { useEffect } from 'react'
import { useColors } from '../theme'

interface Props {
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({ message, confirmLabel = 'OK', cancelLabel = 'Отмена', onConfirm, onCancel }: Props) {
  const colors = useColors()

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onCancel()
      }
    }
    window.addEventListener('keydown', handleKey, true)
    return () => window.removeEventListener('keydown', handleKey, true)
  }, [onCancel])

  return (
    <div style={overlayStyle} onClick={onCancel}>
      <div style={dialogStyle(colors)} onClick={(e) => e.stopPropagation()}>
        <div style={messageStyle(colors)}>{message}</div>
        <div style={actionsStyle}>
          <button style={cancelBtnStyle(colors)} onClick={onCancel}>
            {cancelLabel}
          </button>
          <button style={confirmBtnStyle(colors)} onClick={onConfirm}>
            {confirmLabel}
          </button>
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
  zIndex: 2000,
}
const dialogStyle = (c: any) => ({
  background: c.bgPopup,
  border: `1px solid ${c.border}`,
  borderRadius: 10,
  padding: 24,
  minWidth: 280,
  maxWidth: '90vw' as const,
  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
})
const messageStyle = (c: any) => ({
  fontSize: 15,
  color: c.fg,
  marginBottom: 20,
  textAlign: 'center' as const,
})
const actionsStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 10,
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
const confirmBtnStyle = (c: any) => ({
  padding: '8px 20px',
  borderRadius: 6,
  border: 'none',
  background: c.blue,
  color: c.bg,
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
})
