import type React from 'react'
import { colors, noteColors } from '../theme'

interface Props {
  value: string
  onChange: (v: string) => void
}

export default function ColorPicker({ value, onChange }: Props) {
  return (
    <div style={styles.container}>
      <button
        style={{
          ...styles.dot,
          background: 'transparent',
          border: `2px solid ${!value ? colors.blue : colors.border}`,
        }}
        onClick={() => onChange('')}
        title="Нет цвета"
      />
      {Object.entries(noteColors).map(([name, color]) => (
        <button
          key={name}
          style={{
            ...styles.dot,
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

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: '50%',
    transition: 'border-color 0.1s',
  },
}
