# JazzNote — Roadmap

Current status: **v0.1.0** — feature-complete MVP: note CRUD, Obsidian-style live preview, autosave, themes, search/filters, per-note undo/redo.

Legend: `[x] done · [ ] next · [~] deferred`

## Next milestone (v0.2)

### Usability
- [ ] **English UI (i18n)** — the i18n dictionary and `t()` helper exist but are unused; all strings are hardcoded Russian. Wire it up and add English.
- [ ] **Folders** — move / rename / delete folders (deleting a non-empty folder currently fails), and create new notes inside the currently selected folder.
- [ ] **Custom vault path** — pick any folder as the notes vault via a system dialog (IPC handler already exists) and persist the choice.

### Correctness & cleanup
- [ ] **Code highlighting languages** — Java, C/C++, PHP, SQL, XML are registered but their CodeMirror language packages are missing; add the dependencies.
- [ ] **Robust frontmatter parser** — current parser is naive (no escaping, may break on `---` inside the body); make it reliable YAML-style parsing.
- [ ] **Dead code cleanup** — remove unused IPC handlers (`notes:readDir`, `notes:writeFileSync`, `notes:deleteDir` broken `unlink` usage) and the unused `theme/codemirror.ts`; fix `deleteDir` for non-empty directories.
- [ ] **Watcher efficiency** — the file watcher currently re-reads and re-parses the whole vault on every event; make reloads targeted.

### Reminders & notifications
- [ ] **Note reminders/alarms** — notes already carry a `due` date; surface them as system notifications and integrate with the OS (Task Scheduler on Windows, calendar/alarm on Android, etc.).

### Engineering
- [ ] **Tests + CI** — unit tests for the frontmatter parser, i18n, and utilities; a basic CI workflow.

## Next after that (v0.3)

- [ ] **PDF export** — render a note (or a set of notes) to PDF.
- [ ] **Own live-preview editor** — replace the `@atomic-editor` Markdown rendering with our own parser + renderer on top of CodeMirror. Keep CodeMirror as the text engine (cursor/input are fine); the goal is formatting quality better than Obsidian.

## Deferred (not now)

- App icon and packaging for Windows/macOS
- Backlinks / wiki-links
- Tags and priority UI (data model already exists in frontmatter, no UI yet)
- Git-based sync — replaced by the custom sync below

## Long-term

- [ ] **Own flexible sync** tailored to notes and reminders (not Git-based): backup + multi-device sync built around the note/reminder model, with OS integration.
