export interface JazzAPI {
  getPath: () => Promise<string>
  readDirRecursive: (dirPath?: string) => Promise<string[]>
  readFile: (relPath: string, dirPath?: string) => Promise<string>
  writeFile: (relPath: string, content: string, dirPath?: string) => Promise<boolean>
  deleteFile: (relPath: string, dirPath?: string) => Promise<boolean>
  createFile: (relPath: string, content: string, dirPath?: string) => Promise<boolean>
  createDir: (relPath: string, dirPath?: string) => Promise<boolean>
  deleteDir: (relPath: string, dirPath?: string) => Promise<boolean>
  selectDirectory: () => Promise<string | null>
  readHistory: () => Promise<Record<string, unknown>>
  writeHistory: (data: unknown) => Promise<boolean>
  onNotesChanged: (cb: (relPath: string) => void) => () => void
}

declare global {
  interface Window {
    jazz: JazzAPI
  }
}
