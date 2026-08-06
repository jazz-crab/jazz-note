[English](README.md) | [Русский](README_ru.md)

# JazzNote

Second Brain — a local-first Markdown note-taking app with Obsidian-style inline live preview.

Built with Electron + React + TypeScript on top of CodeMirror 6. Notes live as plain `.md` files on your disk — no lock-in, no database, fully yours.

**Status:** early stage (v0.1.0), already usable for daily notes.

## Features

### Editing
- **Inline live preview** — `# Heading`, `**bold**`, links and lists render right in the editor (Obsidian-style)
- **Code fence highlighting** — JS/TS, Python, Go, Rust, Ruby, Swift, Shell, TOML, Dockerfile, HTML, CSS, JSON, YAML, Markdown
- **Per-note undo/redo** — persistent across restarts (200 steps), with a step-counter toast
- **Keyboard shortcuts** — `Ctrl/Cmd+S` save, `Ctrl/Cmd+Z` undo, `Shift+Ctrl/Cmd+Z` / `Ctrl/Cmd+Y` redo

### Notes
- **Plain Markdown files** in a vault folder (`~/Documents/jazz-notes` by default, auto-created)
- **Full CRUD** — create, edit, delete notes and folders
- **Search** — full-text over title and body, case-insensitive
- **Filters** — All / Today / Tomorrow / This week / Later / No date
- **Sorting** — by last updated / created / due date
- **Metadata** — title, due date, color, auto-assigned ID, created/updated timestamps

### Reliability
- **Debounced autosave** (1 s) with a live save-status indicator (idle → dirty → saving → saved/error)
- **File watcher** (chokidar) — external edits are picked up automatically
- **Single-instance app**, context-isolated preload bridge, no menu chrome

### Appearance
- **3 palettes** — TokyoNight, Everforest, Catppuccin — each with **dark and light** variants
- **5 Monaspace fonts** (Argon, Neon, Krypton, Xenon, Radon) + Nerd Font icons
- Per-note **color** and **date** pickers; overdue dates turn red

## Tech stack

| Layer | Tech |
|-------|------|
| Shell | Electron 43 |
| UI | React 19 + TypeScript + Zustand |
| Editing | CodeMirror 6 via `@atomic-editor/editor` |
| Build | electron-vite, electron-builder |
| Watching | chokidar |

## Getting started

```bash
npm install
npm run dev
```

Production build and packaging (AppImage + deb on Linux):

```bash
npm run build
npm run dist
```

## How notes are stored

Notes are plain `.md` files in the vault, optionally nested in folders. Each file carries a small frontmatter block:

```
~/Documents/jazz-notes/
├── 00001.md
└── subfolder/
    └── 00002.md
```

```markdown
---
title: "My note"
id: "00001"
due: "2026-08-06T14:30"
color: "blue"
created: "2026-08-05T00:00:00.000Z"
updated: "2026-08-06T00:00:00.000Z"
---

# My note
Body text…
```

Supported frontmatter keys: `title`, `id`, `priority` (0–4), `due`, `color`, `created`, `updated`, `tags`.

App preferences (palette, theme, language, font) are persisted in `localStorage` under `jazz-settings`.

## Roadmap

See [ROADMAP.md](ROADMAP.md) for the current development plan.

## License

MIT
