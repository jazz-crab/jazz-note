export interface GitAuth {
  username?: string
  password?: string
}

export interface SshSettings {
  host: string
  port?: number
  user: string
  keyPath?: string
  password?: string
}

export interface GitCommitInfo {
  hash: string
  shortHash: string
  date: string
  message: string
}

export type SyncResult =
  | { status: 'synced'; merged: boolean; pushed: number; pulled: number }
  | { status: 'conflict'; conflictedFiles: string[] }
  | { status: 'offline'; error: string }
  | { status: 'error'; error: string }
