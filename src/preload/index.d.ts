export interface JazzAPI {
  getPath: () => Promise<string>
  readDir: (dirPath?: string) => Promise<Array<{ path: string; isDir: boolean }>>
  readDirRecursive: (dirPath?: string) => Promise<string[]>
  readFile: (relPath: string, dirPath?: string) => Promise<string>
  writeFile: (relPath: string, content: string, dirPath?: string) => Promise<boolean>
  deleteFile: (relPath: string, dirPath?: string) => Promise<boolean>
  createFile: (relPath: string, content: string, dirPath?: string) => Promise<boolean>
  createDir: (relPath: string, dirPath?: string) => Promise<boolean>
  deleteDir: (relPath: string, dirPath?: string) => Promise<boolean>
  selectDirectory: () => Promise<string | null>
  openPath: (filePath: string) => Promise<void>
  onNotesChanged: (cb: (relPath: string) => void) => () => void
  onAppClosing: (cb: () => Promise<void>) => () => void
}

declare global {
  interface Window {
    jazz: JazzAPI
  }
}
