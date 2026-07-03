# opencode-session-follow

[![npm](https://img.shields.io/badge/npm-opencode--session--follow-blue)](https://github.com/workdocyeye/opencode-session-follow)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen)]()

OpenCode 的会话记录默认存储在全局 SQLite 数据库中，通过工作目录的绝对路径来匹配。当你移动或重命名项目文件夹后，之前的对话记录就「消失」了——数据还在，但路径对不上了。

这个工具解决的就是这个问题：搬完文件夹后跑一下，把旧会话的路径更新到新位置。

## 安装

```bash
npm install -g https://github.com/workdocyeye/opencode-session-follow
```

验证安装：

```bash
osf --help
```

## 用法

### 自动模式（仅移动，未重命名）

```bash
cd 新位置/我的项目
osf
```

工具自动检测当前目录，查找同名文件夹的旧会话记录并更新路径。

### 手动模式（移动+重命名，或自动匹配失败时）

```bash
osf --old "旧位置/我的项目" --new "新位置/我的项目"
```

## 工作原理

读取 OpenCode 数据库 `~/.local/share/opencode/opencode.db`，对匹配的会话记录执行一条 `UPDATE` 语句，修改两个字段：

- `directory` — 完整路径（如 `C:/Users/用户名/.../新位置/我的项目`）
- `path` — 相对路径（如 `Users/用户名/.../新位置/我的项目`）

不读取、不写入、不删除任何其他数据。

## 注意事项

- **自动模式**按文件夹名匹配。仅移动不重命名时可直接使用
- **手动模式**（`--old` / `--new`）适用于所有场景，包括重命名+移动
- **重复运行安全**：如果新路径已有会话记录，工具会自动跳过
- **跨平台**：Windows、macOS、Linux 均可使用

## License

MIT
