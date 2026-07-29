import { app, BrowserWindow, ipcMain, dialog, shell, Menu } from 'electron'
import { join } from 'path'
import { readdir, readFile, writeFile, unlink, mkdir, stat } from 'fs/promises'
import { existsSync, writeFileSync } from 'fs'
import { watch } from 'chokidar'

let mainWindow: BrowserWindow | null = null
let watcher: ReturnType<typeof watch> | null = null

const isDev = !!process.env.ELECTRON_RENDERER_URL

function getDefaultNotesPath(): string {
  return join(app.getPath('documents'), 'jazz-notes')
}

async function ensureNotesDir(notesPath: string) {
  if (!existsSync(notesPath)) {
    await mkdir(notesPath, { recursive: true })
  }
}

function startWatching(notesPath: string) {
  if (watcher) watcher.close()
  watcher = watch(notesPath, {
    persistent: true,
    ignoreInitial: true,
    depth: 10
  })
  watcher.on('all', (_event, filePath) => {
    const rel = filePath.replace(notesPath, '').replace(/\\/g, '/')
    mainWindow?.webContents.send('notes:changed', rel)
  })
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 720,
    minWidth: 700,
    minHeight: 500,
    title: 'JazzNote',
    show: false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  Menu.setApplicationMenu(null)

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
  })

  mainWindow.on('close', () => {
    mainWindow?.webContents.send('app:closing')
  })

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

function registerIpc() {
  ipcMain.handle('notes:getPath', () => {
    const p = app.getPath('documents')
    return join(p, 'jazz-notes')
  })

  ipcMain.handle('notes:readDir', async (_event, dirPath?: string) => {
    const notesPath = dirPath || getDefaultNotesPath()
    await ensureNotesDir(notesPath)
    startWatching(notesPath)

    const entries = await readdir(notesPath, { withFileTypes: true })
    const notes: Array<{ path: string; isDir: boolean }> = []
    for (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith('.md')) {
        const fullPath = join(notesPath, entry.name)
        const s = await stat(fullPath)
        notes.push({ path: entry.name, isDir: false, mtimeMs: s.mtimeMs })
      } else if (entry.isDirectory() && !entry.name.startsWith('.')) {
        notes.push({ path: entry.name, isDir: true })
      }
    }
    notes.sort((a, b) => (a as any).mtimeMs - (b as any).mtimeMs)
    return notes
  })

  ipcMain.handle('notes:readFile', async (_event, relPath: string, dirPath?: string) => {
    const notesPath = dirPath || getDefaultNotesPath()
    const fullPath = join(notesPath, relPath)
    const content = await readFile(fullPath, 'utf-8')
    return content
  })

  ipcMain.handle('notes:writeFile', async (_event, relPath: string, content: string, dirPath?: string) => {
    const notesPath = dirPath || getDefaultNotesPath()
    const fullPath = join(notesPath, relPath)
    await ensureNotesDir(notesPath)
    await writeFile(fullPath, content, 'utf-8')
    return true
  })

  ipcMain.on('notes:writeFileSync', (event, relPath: string, content: string, dirPath?: string) => {
    const notesPath = dirPath || getDefaultNotesPath()
    const fullPath = join(notesPath, relPath)
    if (!existsSync(notesPath)) {
      event.returnValue = false
      return
    }
    writeFileSync(fullPath, content, 'utf-8')
    event.returnValue = true
  })

  ipcMain.handle('notes:deleteFile', async (_event, relPath: string, dirPath?: string) => {
    const notesPath = dirPath || getDefaultNotesPath()
    const fullPath = join(notesPath, relPath)
    await unlink(fullPath)
    return true
  })

  ipcMain.handle('notes:createFile', async (_event, relPath: string, content: string, dirPath?: string) => {
    const notesPath = dirPath || getDefaultNotesPath()
    const fullPath = join(notesPath, relPath)
    await ensureNotesDir(notesPath)
    await writeFile(fullPath, content, 'utf-8')
    return true
  })

  ipcMain.handle('notes:createDir', async (_event, relPath: string, dirPath?: string) => {
    const notesPath = dirPath || getDefaultNotesPath()
    const fullPath = join(notesPath, relPath)
    await mkdir(fullPath, { recursive: true })
    return true
  })

  ipcMain.handle('notes:deleteDir', async (_event, relPath: string, dirPath?: string) => {
    const notesPath = dirPath || getDefaultNotesPath()
    const fullPath = join(notesPath, relPath)
    await unlink(fullPath)
    return true
  })

  ipcMain.handle('notes:readDirRecursive', async (_event, dirPath?: string) => {
    const notesPath = dirPath || getDefaultNotesPath()
    await ensureNotesDir(notesPath)
    startWatching(notesPath)

    const result: string[] = []
    async function walk(dir: string, prefix: string) {
      const entries = await readdir(dir, { withFileTypes: true })
      for (const entry of entries) {
        if (entry.name.startsWith('.')) continue
        const rel = prefix ? `${prefix}/${entry.name}` : entry.name
        if (entry.isDirectory()) {
          await walk(join(dir, entry.name), rel)
          result.push(rel + '/')
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
          result.push(rel)
        }
      }
    }
    await walk(notesPath, '')
    return result
  })

  ipcMain.handle('dialog:selectDirectory', async () => {
    const result = await dialog.showOpenDialog(mainWindow!, {
      properties: ['openDirectory']
    })
    if (result.canceled) return null
    return result.filePaths[0]
  })

  ipcMain.handle('shell:openPath', async (_event, filePath: string) => {
    await shell.openPath(filePath)
  })
}

app.whenReady().then(() => {
  createWindow()
  registerIpc()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
