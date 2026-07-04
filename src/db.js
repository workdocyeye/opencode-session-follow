const { execSync } = require("child_process")
const { writeFileSync, unlinkSync, existsSync } = require("fs")
const { tmpdir } = require("os")
const { join } = require("path")

const esc = (s) => s.replace(/'/g, "''")

function tmpSql(sql) {
  const tmp = join(tmpdir(), "ocf-" + process.pid + ".sql")
  writeFileSync(tmp, sql, "utf-8")
  return tmp
}

function sqlite3(sql) {
  const f = tmpSql(sql)
  const db = dbPath()
  try {
    return execSync(`sqlite3 "${db}" < "${f}"`, { encoding: "utf-8" }).trim()
  } finally {
    try { unlinkSync(f) } catch {}
  }
}

function dbPath() {
  const home = require("os").homedir()
  if (process.platform === "darwin") {
    return join(home, "Library", "Application Support", "opencode", "opencode.db")
  }
  return join(home, ".local", "share", "opencode", "opencode.db")
}

function countByDirectory(dir) {
  return parseInt(sqlite3(`.headers off\nSELECT COUNT(*) FROM session WHERE directory = '${esc(dir)}';\n`)) || 0
}

function findByDirectory(dir) {
  const rows = sqlite3(`.headers off\nSELECT id, directory, path FROM session WHERE directory = '${esc(dir)}' LIMIT 1;\n`)
  if (!rows) return null
  const p = rows.split("|")
  return p.length >= 2 ? { id: p[0], directory: p[1], path: p[2] || "" } : null
}

function findOrphan(name, currentDir) {
  const rows = sqlite3(
    `.headers off\nSELECT id, directory, path FROM session WHERE directory LIKE '%${esc(name)}%' AND directory != '${esc(currentDir)}' ORDER BY time_created DESC LIMIT 1;\n`
  )
  if (!rows) return null
  const p = rows.split("|")
  return p.length >= 2 ? { id: p[0], directory: p[1], path: p[2] || "" } : null
}

function updatePath(oldDir, newDir) {
  const newPath = newDir.replace(/^[A-Za-z]:\//, "")
  sqlite3(`UPDATE session SET directory = '${esc(newDir)}', path = '${esc(newPath)}' WHERE directory = '${esc(oldDir)}';\n`)
  return 1
}

module.exports = { dbPath, countByDirectory, findByDirectory, findOrphan, updatePath }
