import type React from 'react'
import { useColors, usePriorityColors } from '../theme'

interface Props {
  value: number
  onChange: (v: number) => void
}

const labels = ['Нет', 'Низкий', 'Средний', 'Высокий', 'Критич.']

export default function PriorityPicker({ value, onChange }: Props) {
  const colors = useColors()
  const priorityColors = usePriorityColors()

  return (
    <div style={containerStyle(colors)}>
      {[0, 1, 2, 3, 4].map((p) => (
        <button
          key={p}
          style={{
            ...dotStyle(priorityColors, p),
            ...(value === p ? dotActiveStyle(colors) : {}),
            ...(value !== p ? { opacity: 0.4 } : {}),
          }}
          onClick={() => onChange(p)}
          title={labels[p]}
        />
      ))}
      <span style={labelStyle(colors)}>{labels[value]}</span>
    </div>
  )
}

const containerStyle = (c: any) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 6,
})
const dotStyle = (pc: any, p: number) => ({
  width: 18,
  height: 18,
  borderRadius: '50%' as const,
  background: pc[p],
  border: '2px solid transparent',
  transition: 'all 0.15s',
})
const dotActiveStyle = (c: any) => ({
  borderColor: c.fg,
  transform: 'scale(1.15)',
})
const labelStyle = (c: any) => ({
  fontSize: 11,
  color: c.comment,
  marginLeft: 4,
})
