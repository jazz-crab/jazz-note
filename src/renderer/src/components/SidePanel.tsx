import { useEffect, useState } from 'react'
import type React from 'react'
import { useColors } from '../theme'

interface Props {
  side: 'left' | 'right'
  open: boolean
  onClose: () => void
  children: React.ReactNode
  width?: number
}

export default function SidePanel({ side, open, onClose, children, width }: Props) {
  const colors = useColors()
  const [render, setRender] = useState(open)
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    if (open) {
      setRender(true)
      setClosing(false)
      return
    }
    if (!render) return
    setClosing(true)
    const t = setTimeout(() => {
      setRender(false)
      setClosing(false)
    }, 200)
    return () => clearTimeout(t)
  }, [open, render])

  useEffect(() => {
    if (!render) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
      }
    }
    window.addEventListener('keydown', handleKey, true)
    return () => window.removeEventListener('keydown', handleKey, true)
  }, [render, onClose])

  if (!render) return null

  const animIn = side === 'left' ? 'slideInLeft 0.24s ease both' : 'slideInRight 0.24s ease both'
  const animOut = side === 'left' ? 'slideOutLeft 0.18s ease both' : 'slideOutRight 0.18s ease both'

  return (
    <div style={overlayStyle(closing)} onClick={onClose}>
      <div
        style={panelStyle(colors, side, closing, width, animIn, animOut)}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

const overlayStyle = (closing: boolean): React.CSSProperties => ({
  position: 'fixed',
  inset: 0,
  zIndex: 900,
  animation: closing ? 'fadeOut 0.18s ease both' : 'fadeIn 0.18s ease both',
})
const panelStyle = (
  c: any,
  side: 'left' | 'right',
  closing: boolean,
  width: number | undefined,
  animIn: string,
  animOut: string,
): React.CSSProperties => ({
  position: 'absolute',
  bottom: 48,
  ...(side === 'left' ? { left: 0 } : { right: 0 }),
  width: width ?? (side === 'left' ? 'auto' : 300),
  maxHeight: 'calc(100% - 64px)',
  overflowY: 'auto',
  background: c.bgPopup,
  border: `1px solid ${c.border}`,
  ...(side === 'left'
    ? { borderRadius: '0 12px 12px 0', borderLeft: 'none' }
    : { borderRadius: '12px 0 0 12px', borderRight: 'none' }),
  boxShadow: side === 'left'
    ? '4px 0 24px rgba(0,0,0,0.35)'
    : '-4px 0 24px rgba(0,0,0,0.35)',
  padding: 12,
  zIndex: 901,
  animation: closing ? animOut : animIn,
})
