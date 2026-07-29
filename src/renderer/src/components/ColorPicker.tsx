import type React from 'react'
import { useColors, useNoteColors } from '../theme'

interface Props {
  value: string
  onChange: (v: string) => void
}

export default function ColorPicker({ value, onChange }: Props) {
  const colors = useColors()
  const noteColorMap = useNoteColors()

  return (
    <div style={containerStyle}>
      <button
        style={{
          ...dotStyle,
          background: 'transparent',
          border: `2px solid ${!value ? colors.blue : colors.border}`,
        }}
        onClick={() => onChange('')}
        title="Нет цвета"
      />
      {Object.entries(noteColorMap).map(([name, color]) => (
        <button
          key={name}
          style={{
            ...dotStyle,
            background: color,
            border: `2px solid ${value === name ? colors.fg : 'transparent'}`,
          }}
          onClick={() => onChange(name)}
          title={name}
        />
      ))}
    </div>
  )
}

const containerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 4,
}
const dotStyle: React.CSSProperties = {
  width: 16,
  height: 16,
  borderRadius: '50%',
  transition: 'border-color 0.1s',
}
