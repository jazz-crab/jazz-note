import { useNotesStore, type SidebarSelection } from '../stores/notes'
import { colors } from '../theme'
import type React from 'react'

const filterItems: Array<{ type: SidebarSelection; label: string }> = [
  { type: { type: 'all' }, label: 'Все заметки' },
  { type: { type: 'today' }, label: 'Сегодня' },
  { type: { type: 'tomorrow' }, label: 'Завтра' },
  { type: { type: 'week' }, label: 'Неделя' },
  { type: { type: 'later' }, label: 'Позже' },
  { type: { type: 'nodate' }, label: 'Без срока' },
]

export default function Sidebar() {
  const folders = useNotesStore((s) => s.folders)
  const sidebarSelection = useNotesStore((s) => s.sidebarSelection)
  const setSidebarSelection = useNotesStore((s) => s.setSidebarSelection)
  const createFolder = useNotesStore((s) => s.createFolder)

  const isSelected = (sel: SidebarSelection): boolean => {
    if (sel.type !== sidebarSelection.type) return false
    if (sel.type === 'folder' && sidebarSelection.type === 'folder') {
      return sel.path === (sidebarSelection as any).path
    }
    return true
  }

  const handleNewFolder = () => {
    const name = prompt('Название папки:')
    if (name?.trim()) createFolder(name.trim())
  }

  return (
    <div style={styles.container}>
      <div style={styles.title}>JazzNote</div>

      <div style={styles.section}>
        {filterItems.map((item) => (
          <div
            key={item.label}
            style={{
              ...styles.item,
              ...(isSelected(item.type) ? styles.itemSelected : {}),
            }}
            onClick={() => setSidebarSelection(item.type)}
          >
            {item.label}
          </div>
        ))}
      </div>

      <div style={styles.divider} />

      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <span>Папки</span>
          <button style={styles.addBtn} onClick={handleNewFolder}>+</button>
        </div>
        {folders.map((folder) => (
          <div
            key={folder}
            style={{
              ...styles.item,
              ...(isSelected({ type: 'folder', path: folder }) ? styles.itemSelected : {}),
            }}
            onClick={() => setSidebarSelection({ type: 'folder', path: folder })}
          >
            📁 {folder}
          </div>
        ))}
        {folders.length === 0 && (
          <div style={styles.emptyText}>Нет папок</div>
        )}
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: 240,
    height: '100%',
    background: colors.bgSidebar,
    borderRight: `1px solid ${colors.border}`,
    display: 'flex',
    flexDirection: 'column',
    padding: '12px 0',
    overflow: 'auto',
    flexShrink: 0,
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
    color: colors.blue,
    padding: '0 16px 16px',
    letterSpacing: '-0.3px',
  },
  section: {
    padding: '4px 0',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '4px 16px',
    fontSize: 11,
    color: colors.comment,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  item: {
    padding: '6px 16px',
    cursor: 'pointer',
    color: colors.fgSidebar,
    fontSize: 13,
    transition: 'background 0.1s',
  },
  itemSelected: {
    background: colors.bgHighlight,
    color: colors.blue,
    fontWeight: 600,
  },
  divider: {
    height: 1,
    background: colors.border,
    margin: '8px 16px',
  },
  addBtn: {
    color: colors.green,
    fontSize: 16,
    fontWeight: 700,
    padding: '0 4px',
  },
  emptyText: {
    padding: '4px 16px',
    color: colors.comment,
    fontSize: 12,
  },
}
