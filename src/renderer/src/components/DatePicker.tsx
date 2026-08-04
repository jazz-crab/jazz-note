import { useEffect, useMemo, useState } from 'react'
import { useColors } from '../theme'
import type React from 'react'

interface Props {
  date: string
  onDateChange: (d: string) => void
  onDone?: () => void
}

const pad = (n: number) => String(n).padStart(2, '0')
const MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

function toISO(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function formatManual(d: Date): string {
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function parseManual(text: string): Date | null {
  const m = text.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})(?:\s+(\d{1,2}):(\d{2}))?$/)
  if (!m) return null
  const [, dd, mm, yyyy, hh, min] = m
  const day = parseInt(dd, 10)
  const month = parseInt(mm, 10) - 1
  const year = parseInt(yyyy, 10)
  const hour = hh !== undefined ? parseInt(hh, 10) : 12
  const minute = min !== undefined ? parseInt(min, 10) : 0
  if (day < 1 || day > 31 || month < 0 || month > 11 || hour > 23 || minute > 59) return null
  const d = new Date(year, month, day, hour, minute)
  if (d.getDate() !== day || d.getMonth() !== month) return null
  return d
}

export default function DatePicker({ date, onDateChange, onDone }: Props) {
  const colors = useColors()

  const initial = useMemo(() => {
    if (!date) return new Date()
    const d = new Date(date)
    return isNaN(d.getTime()) ? new Date() : d
  }, [date])

  const [pending, setPending] = useState<Date>(initial)
  const [view, setView] = useState(() => ({
    year: initial.getFullYear(),
    month: initial.getMonth(),
  }))
  const [manual, setManual] = useState(formatManual(initial))
  const [manualError, setManualError] = useState(false)

  const today = new Date()

  const cells = useMemo(() => {
    const first = new Date(view.year, view.month, 1)
    const offset = (first.getDay() + 6) % 7
    const daysInMonth = new Date(view.year, view.month + 1, 0).getDate()
    const result: Array<number | null> = Array(offset).fill(null)
    for (let d = 1; d <= daysInMonth; d++) result.push(d)
    return result
  }, [view])

  const isSameDate = (y: number, m: number, d: number) =>
    pending.getFullYear() === y && pending.getMonth() === m && pending.getDate() === d

  const selectDay = (d: number) => {
    const next = new Date(view.year, view.month, d, pending.getHours(), pending.getMinutes())
    setPending(next)
    setManual(formatManual(next))
    setManualError(false)
  }

  const setTime = (h: number, min: number) => {
    const next = new Date(pending.getFullYear(), pending.getMonth(), pending.getDate(), h, min)
    setPending(next)
    setManual(formatManual(next))
  }

  const handleManual = (text: string) => {
    setManual(text)
    const d = parseManual(text)
    if (d) {
      setPending(d)
      setManualError(false)
      setView({ year: d.getFullYear(), month: d.getMonth() })
    } else {
      setManualError(text.trim().length > 0)
    }
  }

  const commit = () => {
    onDateChange(toISO(pending))
    onDone?.()
  }

  const clear = () => {
    onDateChange('')
    onDone?.()
  }

  const prevMonth = () => {
    setView((v) => (v.month === 0 ? { year: v.year - 1, month: 11 } : { year: v.year, month: v.month - 1 }))
  }
  const nextMonth = () => {
    setView((v) => (v.month === 11 ? { year: v.year + 1, month: 0 } : { year: v.year, month: v.month + 1 }))
  }

  return (
    <div style={containerStyle}>
      <div style={calHeaderStyle}>
        <button style={navBtnStyle(colors)} onClick={prevMonth}>{'\u2039'}</button>
        <span style={calTitleStyle(colors)}>
          {MONTHS[view.month]} {view.year}
        </span>
        <button style={navBtnStyle(colors)} onClick={nextMonth}>{'\u203A'}</button>
      </div>

      <div style={weekRowStyle}>
        {WEEKDAYS.map((w, i) => (
          <div key={w} style={i >= 5 ? weekdayStyle(colors, true) : weekdayStyle(colors, false)}>
            {w}
          </div>
        ))}
      </div>

      <div style={gridStyle}>
        {cells.map((d, i) =>
          d === null ? (
            <div key={`b${i}`} />
          ) : (
            <button
              key={d}
              style={dayStyle(
                colors,
                isSameDate(view.year, view.month, d),
                today.getFullYear() === view.year && today.getMonth() === view.month && today.getDate() === d,
                new Date(view.year, view.month, d).getDay() === 0 || new Date(view.year, view.month, d).getDay() === 6,
              )}
              onClick={() => selectDay(d)}
            >
              {d}
            </button>
          ),
        )}
      </div>

      <div style={timeRowStyle}>
        <span style={timeLabelStyle(colors)}>Время</span>
        <select style={timeSelStyle(colors)} value={pending.getHours()} onChange={(e) => setTime(parseInt(e.target.value, 10), pending.getMinutes())}>
          {Array.from({ length: 24 }, (_, h) => (
            <option key={h} value={h}>{pad(h)}</option>
          ))}
        </select>
        <span style={timeColonStyle(colors)}>:</span>
        <select style={timeSelStyle(colors)} value={pending.getMinutes()} onChange={(e) => setTime(pending.getHours(), parseInt(e.target.value, 10))}>
          {Array.from({ length: 12 }, (_, m) => m * 5).map((m) => (
            <option key={m} value={m}>{pad(m)}</option>
          ))}
        </select>
      </div>

      <div style={manualRowStyle}>
        <input
          style={manualInputStyle(colors, manualError)}
          value={manual}
          onChange={(e) => handleManual(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setManualError(false)
            }
          }}
          placeholder="ДД.ММ.ГГГГ ЧЧ:ММ"
        />
      </div>
      {manualError && <div style={errorStyle(colors)}>Неверный формат. Пример: 05.08.2026 14:30</div>}

      <div style={footerStyle}>
        <div style={quickRowStyle}>
          <button style={quickBtnStyle(colors)} onClick={() => { const n = new Date(pending); n.setDate(pending.getDate() + 0); setPending(n); setManual(formatManual(n)); }}>Сегодня</button>
          <button style={quickBtnStyle(colors)} onClick={() => { const n = new Date(pending.getFullYear(), pending.getMonth(), pending.getDate() + 1, pending.getHours(), pending.getMinutes()); setPending(n); setManual(formatManual(n)); }}>Завтра</button>
          <button style={quickBtnStyle(colors)} onClick={() => { const n = new Date(pending.getFullYear(), pending.getMonth(), pending.getDate() + 7, pending.getHours(), pending.getMinutes()); setPending(n); setManual(formatManual(n)); }}>Через неделю</button>
          {date && <button style={clearBtnStyle(colors)} onClick={clear}>Очистить</button>}
        </div>
        <button style={doneBtnStyle(colors)} onClick={commit}>Готово</button>
      </div>
    </div>
  )
}

const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
}
const calHeaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}
const navBtnStyle = (c: any) => ({
  padding: '2px 10px',
  fontSize: 18,
  color: c.fgDark,
  borderRadius: 4,
})
const calTitleStyle = (c: any) => ({
  fontSize: 14,
  fontWeight: 600,
  color: c.fg,
  textTransform: 'capitalize' as const,
})
const weekRowStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  textAlign: 'center',
}
const weekdayStyle = (c: any, weekend: boolean) => ({
  fontSize: 11,
  color: weekend ? c.red : c.comment,
  padding: '2px 0',
})
const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: 2,
}
const dayStyle = (c: any, selected: boolean, isToday: boolean, weekend: boolean) => ({
  aspectRatio: '1',
  borderRadius: 6,
  fontSize: 12,
  color: selected ? c.bg : weekend ? c.red : c.fg,
  background: selected ? c.blue : 'transparent',
  border: isToday && !selected ? `1px solid ${c.border}` : 'none',
  fontWeight: selected || isToday ? 700 : 400,
})
const timeRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  paddingTop: 4,
}
const timeLabelStyle = (c: any) => ({
  fontSize: 12,
  color: c.comment,
  marginRight: 4,
})
const timeSelStyle = (c: any) => ({
  padding: '4px 6px',
  background: c.bg,
  border: `1px solid ${c.border}`,
  borderRadius: 6,
  color: c.fg,
  fontSize: 13,
})
const timeColonStyle = (c: any) => ({
  color: c.comment,
  fontSize: 13,
})
const manualRowStyle: React.CSSProperties = {
  display: 'flex',
  gap: 8,
}
const manualInputStyle = (c: any, error: boolean) => ({
  flex: 1,
  padding: '8px 10px',
  background: c.bg,
  border: `1px solid ${error ? c.red : c.border}`,
  borderRadius: 6,
  color: c.fg,
  fontSize: 13,
})
const errorStyle = (c: any) => ({
  fontSize: 11,
  color: c.red,
})
const footerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 10,
  paddingTop: 6,
}
const quickRowStyle: React.CSSProperties = {
  display: 'flex',
  gap: 6,
  flexWrap: 'wrap',
}
const quickBtnStyle = (c: any) => ({
  padding: '6px 10px',
  background: c.bgAlt,
  border: `1px solid ${c.border}`,
  borderRadius: 6,
  color: c.fg,
  fontSize: 12,
})
const clearBtnStyle = (c: any) => ({
  padding: '6px 10px',
  background: 'transparent',
  border: `1px solid ${c.red}`,
  borderRadius: 6,
  color: c.red,
  fontSize: 12,
})
const doneBtnStyle = (c: any) => ({
  padding: '8px 18px',
  background: c.blue,
  color: c.bg,
  borderRadius: 6,
  fontWeight: 700,
  fontSize: 13,
  flexShrink: 0,
})
