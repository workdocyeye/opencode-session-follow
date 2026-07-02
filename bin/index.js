#!/usr/bin/env node
const path = require("path")
const { countByDirectory, findOrphan, updatePath } = require("../src/db")

const args = process.argv.slice(2)
const oldIdx = args.indexOf("--old")
const newIdx = args.indexOf("--new")

if (oldIdx !== -1 && newIdx !== -1) {
  const oldDir = args[oldIdx + 1]?.replace(/\\/g, "/")
  const newDir = args[newIdx + 1]?.replace(/\\/g, "/")
  if (!oldDir || !newDir) die("Usage: opencode-session-follow --old <path> --new <path>")
  if (countByDirectory(newDir) > 0) { log("当前路径已有会话，无需修复"); process.exit(0) }
  const orphan = findOrphan(path.basename(newDir), newDir)
  if (!orphan) { log("未找到匹配的旧会话记录"); process.exit(0) }
  updatePath(orphan.directory, newDir)
  log(`已修复: ${orphan.directory} → ${newDir}`)
  process.exit(0)
}

const cwd = process.cwd().replace(/\\/g, "/")
if (countByDirectory(cwd) > 0) { log("当前目录已有会话，无需修复"); process.exit(0) }

const orphan = findOrphan(path.basename(cwd), cwd)
if (!orphan) { log("未找到匹配的旧会话记录"); process.exit(0) }

updatePath(orphan.directory, cwd)
log(`已修复: ${orphan.directory} → ${cwd}`)
process.exit(0)

function log(m) { console.log(m) }
function die(m) { console.error(m); process.exit(1) }
