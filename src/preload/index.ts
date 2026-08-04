import { contextBridge, ipcRenderer } from 'electron'

const api = {
  getPath: (): Promise<string> => ipcRenderer.invoke('notes:getPath'),
  readDir: (dirPath?: string): Promise<Array<{ path: string; isDir: boolean }>> =>
    ipcRenderer.invoke('notes:readDir', dirPath),
  readDirRecursive: (dirPath?: string): Promise<string[]> =>
    ipcRenderer.invoke('notes:readDirRecursive', dirPath),
  readFile: (relPath: string, dirPath?: string): Promise<string> =>
    ipcRenderer.invoke('notes:readFile', relPath, dirPath),
  writeFile: (relPath: string, content: string, dirPath?: string): Promise<boolean> =>
    ipcRenderer.invoke('notes:writeFile', relPath, content, dirPath),
  writeFileSync: (relPath: string, content: string, dirPath?: string): boolean =>
    ipcRenderer.sendSync('notes:writeFileSync', relPath, content, dirPath),
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
  openPath: (filePath: string): Promise<void> =>
    ipcRenderer.invoke('shell:openPath', filePath),

  onNotesChanged: (cb: (relPath: string) => void) => {
    const handler = (_event: any, relPath: string) => cb(relPath)
    ipcRenderer.on('notes:changed', handler)
    return () => ipcRenderer.removeListener('notes:changed', handler)
  }
}

contextBridge.exposeInMainWorld('jazz', api)
