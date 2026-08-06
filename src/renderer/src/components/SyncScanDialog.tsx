import { useEffect, useRef, useState } from 'react'
import jsQR from 'jsqr'
import { useColors } from '../theme'
import { useSettingsStore } from '../stores/settings'
import { decodeSyncConfig } from '../../../shared/syncConfig'
import { t } from '../utils/i18n'

interface Props {
  onScanned: (config: { url: string; user: string; token: string }) => void
  onClose: () => void
}

export default function SyncScanDialog({ onScanned, onClose }: Props) {
  const colors = useColors()
  const lang = useSettingsStore((s) => s.lang)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let stream: MediaStream | null = null
    let raf = 0
    let stopped = false
    const tick = () => {
      if (stopped) return
      raf = requestAnimationFrame(tick)
      const v = videoRef.current
      const c = canvasRef.current
      if (!v || !c || v.readyState < 2) return
      if (c.width !== v.videoWidth || c.height !== v.videoHeight) {
        c.width = v.videoWidth
        c.height = v.videoHeight
      }
      const ctx = c.getContext('2d', { willReadFrequently: true })
      if (!ctx) return
      ctx.drawImage(v, 0, 0, c.width, c.height)
      const img = ctx.getImageData(0, 0, c.width, c.height)
      const res = jsQR(img.data, img.width, img.height)
      if (res?.data) {
        const config = decodeSyncConfig(res.data)
        if (config) {
          stopped = true
          onScanned(config)
          return
        }
      }
    }
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' } })
      .then((s) => {
        if (stopped) {
          s.getTracks().forEach((tr) => tr.stop())
          return
        }
        stream = s
        const v = videoRef.current
        if (v) {
          v.srcObject = s
          v.play().catch(() => {})
          tick()
        }
      })
      .catch((err) => {
        if (!stopped) setError(err?.message ? String(err.message) : String(err))
      })
    return () => {
      stopped = true
      cancelAnimationFrame(raf)
      stream?.getTracks().forEach((tr) => tr.stop())
    }
  }, [onScanned])

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={dialogStyle(colors)} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          <span style={titleStyle(colors)}>{t('sync.scan.title', lang)}</span>
          <button style={closeBtnStyle(colors)} onClick={onClose}>
            {'\u2715'}
          </button>
        </div>
        <div style={bodyStyle}>
          {error ? (
            <div style={errorStyle(colors)}>{t('sync.scan.error', lang).replace('{error}', error)}</div>
          ) : (
            <>
              <div style={videoWrapStyle}>
                <video ref={videoRef} muted playsInline style={videoStyle} />
              </div>
              <div style={hintStyle(colors)}>{t('sync.scan.empty', lang)}</div>
            </>
          )}
          <canvas ref={canvasRef} style={canvasHiddenStyle} />
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
  zIndex: 1200,
}
const dialogStyle = (c: any) => ({
  background: c.bgPopup,
  border: `1px solid ${c.border}`,
  borderRadius: 10,
  width: 360,
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
  fontSize: 15,
  fontWeight: 700,
  color: c.fg,
})
const closeBtnStyle = (c: any) => ({
  fontSize: 18,
  color: c.comment,
  padding: '0 4px',
})
const bodyStyle: React.CSSProperties = {
  padding: '16px 18px',
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  alignItems: 'center',
}
const videoWrapStyle: React.CSSProperties = {
  width: 300,
  height: 200,
  overflow: 'hidden',
  borderRadius: 8,
  background: '#000',
}
const videoStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
}
const hintStyle = (c: any) => ({
  fontSize: 12,
  color: c.comment,
  textAlign: 'center' as const,
})
const errorStyle = (c: any) => ({
  fontSize: 13,
  color: c.red,
  textAlign: 'center' as const,
  padding: '40px 20px',
})
const canvasHiddenStyle: React.CSSProperties = {
  display: 'none',
}
