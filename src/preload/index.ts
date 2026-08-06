import { contextBridge, ipcRenderer } from 'electron'

const api = {
  getPath: (): Promise<string> => ipcRenderer.invoke('notes:getPath'),
  readDirRecursive: (dirPath?: string): Promise<string[]> =>
    ipcRenderer.invoke('notes:readDirRecursive', dirPath),
  readFile: (relPath: string, dirPath?: string): Promise<string> =>
    ipcRenderer.invoke('notes:readFile', relPath, dirPath),
  writeFile: (relPath: string, content: string, dirPath?: string): Promise<boolean> =>
    ipcRenderer.invoke('notes:writeFile', relPath, content, dirPath),
  deleteFile: (relPath: string, dirPath?: string): Promise<boolean> =>
    ipcRenderer.invoke('notes:deleteFile', relPath, dirPath),
  createFile: (relPath: string, content: string, dirPath?: string): Promise<boolean> =>
    ipcRenderer.invoke('notes:createFile', relPath, content, dirPath),
  createDir: (relPath: string, dirPath?: string): Promise<boolean> =>
    ipcRenderer.invoke('notes:createDir', relPath, dirPath),
  deleteDir: (relPath: string, dirPath?: string): Promise<boolean> =>
    ipcRenderer.invoke('notes:deleteDir', relPath, dirPath),
  selectDirectory: (): Promise<string | null> =>
    ipcRenderer.invoke('dialog:selectDirectory'),
  readHistory: (): Promise<Record<string, unknown>> =>
    ipcRenderer.invoke('history:read'),
  writeHistory: (data: unknown): Promise<boolean> =>
    ipcRenderer.invoke('history:write', data),

  onNotesChanged: (cb: (relPath: string) => void) => {
    const handler = (_event: any, relPath: string) => cb(relPath)
    ipcRenderer.on('notes:changed', handler)
    return () => ipcRenderer.removeListener('notes:changed', handler)
  }
}

contextBridge.exposeInMainWorld('jazz', api)
