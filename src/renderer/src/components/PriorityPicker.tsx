import type React from 'react'
import { colors, priorityColors } from '../theme'

interface Props {
  value: number
  onChange: (v: number) => void
}

const labels = ['Нет', 'Низкий', 'Средний', 'Высокий', 'Критич.']

export default function PriorityPicker({ value, onChange }: Props) {
  return (
    <div style={styles.container}>
      {[0, 1, 2, 3, 4].map((p) => (
        <button
          key={p}
          style={{
            ...styles.dot,
            background: priorityColors[p],
            ...(value === p ? styles.dotActive : {}),
            ...(value !== p ? { opacity: 0.4 } : {}),
          }}
          onClick={() => onChange(p)}
          title={labels[p]}
        />
      ))}
      <span style={styles.label}>{labels[value]}</span>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 18,
    height: 18,
    borderRadius: '50%',
    border: '2px solid transparent',
    transition: 'all 0.15s',
  },
  dotActive: {
    borderColor: colors.fg,
    transform: 'scale(1.15)',
  },
  label: {
    fontSize: 11,
    color: colors.comment,
    marginLeft: 4,
  },
}
