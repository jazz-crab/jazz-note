import { useState } from 'react'
import { useNotesStore, type SidebarSelection } from '../stores/notes'
import { useSettingsStore } from '../stores/settings'
import { useColors } from '../theme'
import PromptDialog from './PromptDialog'

const filterItems: Array<{ type: SidebarSelection; label: string }> = [
  { type: { type: 'all' }, label: 'Все заметки' },
  { type: { type: 'today' }, label: 'Сегодня' },
  { type: { type: 'tomorrow' }, label: 'Завтра' },
  { type: { type: 'week' }, label: 'Неделя' },
  { type: { type: 'later' }, label: 'Позже' },
  { type: { type: 'nodate' }, label: 'Без срока' },
]

export default function Sidebar() {
  const colors = useColors()
  const folders = useNotesStore((s) => s.folders)
  const sidebarSelection = useNotesStore((s) => s.sidebarSelection)
  const setSidebarSelection = useNotesStore((s) => s.setSidebarSelection)
  const createFolder = useNotesStore((s) => s.createFolder)
  const openSettings = useSettingsStore((s) => s.openSettings)
  const [showNewFolder, setShowNewFolder] = useState(false)

  const isSelected = (sel: SidebarSelection): boolean => {
    if (sel.type !== sidebarSelection.type) return false
    if (sel.type === 'folder' && sidebarSelection.type === 'folder') {
      return sel.path === (sidebarSelection as any).path
    }
    return true
  }

  const handleNewFolder = (name: string) => {
    createFolder(name)
    setShowNewFolder(false)
  }

  return (
    <div style={container(colors)}>
      <div style={title(colors)}>JazzNote</div>

      <div style={section}>
        {filterItems.map((item) => (
          <div
            key={item.label}
            style={{
              ...itemStyle(colors),
              ...(isSelected(item.type) ? itemSelectedStyle(colors) : {}),
            }}
            onClick={() => setSidebarSelection(item.type)}
          >
            {item.label}
          </div>
        ))}
      </div>

      <div style={divider(colors)} />

      <div style={section}>
        <div style={sectionHeader(colors)}>
          <span>Папки</span>
          <button style={addBtn(colors)} onClick={() => setShowNewFolder(true)}>+</button>
        </div>
        {folders.map((folder) => (
          <div
            key={folder}
            style={{
              ...itemStyle(colors),
              ...(isSelected({ type: 'folder', path: folder }) ? itemSelectedStyle(colors) : {}),
            }}
            onClick={() => setSidebarSelection({ type: 'folder', path: folder })}
          >
            {'\u2514'} {folder}
          </div>
        ))}
        {folders.length === 0 && (
          <div style={emptyText(colors)}>Нет папок</div>
        )}
      </div>

      <div style={{ marginTop: 'auto', padding: '8px 16px' }}>
        <button style={settingsBtn(colors)} onClick={openSettings}>
          Настройки
        </button>
      </div>

      {showNewFolder && (
        <PromptDialog
          message="Название папки:"
          placeholder="Новая папка"
          confirmLabel="Создать"
          onConfirm={handleNewFolder}
          onCancel={() => setShowNewFolder(false)}
        />
      )}
    </div>
  )
}

const section: React.CSSProperties = {
  padding: '4px 0',
}

const container = (c: any): React.CSSProperties => ({
  width: 240,
  height: '100%',
  background: c.bgSidebar,
  borderRight: `1px solid ${c.border}`,
  display: 'flex',
  flexDirection: 'column',
  padding: '12px 0',
  overflow: 'auto',
  flexShrink: 0,
})
const title = (c: any) => ({
  fontSize: 18,
  fontWeight: 700,
  color: c.blue,
  padding: '0 16px 16px',
  letterSpacing: '-0.3px',
})
const sectionHeader = (c: any) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '4px 16px',
  fontSize: 11,
  color: c.comment,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
})
const itemStyle = (c: any) => ({
  padding: '6px 16px',
  cursor: 'pointer',
  color: c.fgSidebar,
  fontSize: 13,
  transition: 'background 0.1s',
})
const itemSelectedStyle = (c: any) => ({
  background: c.bgHighlight,
  color: c.blue,
  fontWeight: 600,
})
const divider = (c: any) => ({
  height: 1,
  background: c.border,
  margin: '8px 16px',
})
const addBtn = (c: any) => ({
  color: c.green,
  fontSize: 16,
  fontWeight: 700,
  padding: '0 4px',
})
const emptyText = (c: any) => ({
  padding: '4px 16px',
  color: c.comment,
  fontSize: 12,
})
const settingsBtn = (c: any) => ({
  width: '100%',
  padding: '8px 12px',
  borderRadius: 6,
  color: c.fgSidebar,
  fontSize: 13,
  textAlign: 'left' as const,
  background: c.bgAlt,
  border: `1px solid ${c.border}`,
})
