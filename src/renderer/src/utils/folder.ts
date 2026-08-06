export function leafName(folder: string): string {
  return folder.split('/').pop() || folder
}

export function parentOf(folder: string): string | null {
  const idx = folder.lastIndexOf('/')
  return idx === -1 ? null : folder.slice(0, idx)
}

export function depthOf(folder: string): number {
  return folder.split('/').length - 1
}

export function isSelfOrChild(candidate: string, folder: string): boolean {
  return candidate === folder || candidate.startsWith(folder + '/')
}

export function moveFolderPath(folder: string, dest: string | null): string {
  const leaf = leafName(folder)
  return dest ? `${dest}/${leaf}` : leaf
}
