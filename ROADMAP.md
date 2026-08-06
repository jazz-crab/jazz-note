# JazzNote — Roadmap

Current status: the MVP is complete and usable — note CRUD, Obsidian-style live preview, autosave, themes, search/filters, per-note undo/redo.

Legend: `[x] done · [ ] next · [~] deferred`

## Next up

### Usability
- [x] **English UI (i18n)** — the i18n dictionary and `t()` helper are wired through the whole UI; language switch in Settings (Русский / English), persisted.
- [x] **Custom vault path** — pick any folder as the notes vault via a system dialog (Settings → Notes folder) and persist the choice.
- [x] **Folders** — rename and delete folders (deleting non-empty folders works), and create new notes inside the currently selected folder.

### Correctness & cleanup
- [x] **Code highlighting languages** — Java, C/C++, PHP, SQL, XML CodeMirror language packages added; highlighting works.
- [x] **Robust frontmatter parser** — quoted values with escaping, `---` inside the body no longer breaks parsing, unquoted scalar values, ISO dates.
- [x] **Dead code cleanup** — removed unused IPC handlers (`notes:readDir`, `notes:writeFileSync`, `shell:openPath`) and `theme/codemirror.ts`; `notes:deleteDir` now uses `fs.rm` for non-empty directories.
- [x] **Watcher efficiency** — the file watcher reload is debounced so a burst of events triggers one scan; self-saves are ignored.

### Reminders & notifications
- [ ] **Note reminders/alarms** — notes already carry a `due` date; surface them as system notifications and integrate with the OS (Task Scheduler on Windows, calendar/alarm on Android, etc.).

### Engineering
- [x] **Tests + CI** — unit tests for the frontmatter parser, i18n, color, debounce, and fonts utilities (Vitest); a GitHub Actions workflow runs tests and the build on every push/PR.

## Later

- [ ] **PDF export** — render a note (or a set of notes) to PDF.
- [ ] **Own live-preview editor** — replace the `@atomic-editor` Markdown rendering with our own parser + renderer on top of CodeMirror. Keep CodeMirror as the text engine (cursor/input are fine); the goal is formatting quality better than Obsidian.

## Deferred (not now)

- App icon and packaging for Windows/macOS
- Backlinks / wiki-links
- Tags and priority UI (data model already exists in frontmatter, no UI yet)
- Git-based sync — replaced by the custom sync below

## Long-term

- [ ] **Own flexible sync** tailored to notes and reminders (not Git-based): backup + multi-device sync built around the note/reminder model, with OS integration.
