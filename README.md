# opencode-session-follow

[![npm](https://img.shields.io/badge/npm-opencode--session--follow-blue)](https://github.com/workdocyeye/opencode-session-follow)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen)]()

[中文文档](./README.zh.md)

OpenCode stores all session history in a global SQLite database. Sessions are associated with projects by their absolute directory path. When you move or rename a project folder, your previous conversations become inaccessible — the data still exists, but the path no longer matches.

This tool restores the connection. Run it after moving a folder, and it updates the stored path to point to the new location.

## Install

```bash
npm install -g https://github.com/workdocyeye/opencode-session-follow
```

Verify:

```bash
osf --help
```

## Usage

### Auto mode (folder moved but not renamed)

```bash
cd new-location/my-project
osf
```

The tool detects the current directory, finds orphaned sessions with a matching folder name, and updates them.

### Manual mode (folder moved and renamed)

```bash
osf --old "old-location/my-project" --new "new-location/my-project"
```

## How it works

Reads the OpenCode database at `~/.local/share/opencode/opencode.db` and runs a single `UPDATE` on the matching session row:

- `directory` — full path (e.g. `C:/Users/you/.../new-location/my-project`)
- `path` — relative path (e.g. `Users/you/.../new-location/my-project`)

No other data is read, written, or deleted.

## Notes

- **Auto mode** matches by folder name. Works when the folder is only moved, not renamed.
- **Manual mode** (`--old`/`--new`) works for any scenario, including rename + move.
- **Safe to re-run**: if the new path already has sessions, the tool skips it.
- **Cross-platform**: Windows, macOS, Linux.

## License

MIT
