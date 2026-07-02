# opencode-session-follow

OpenCode 的会话记录默认存储在全局 SQLite 数据库中，通过工作目录的路径来匹配。当你把项目文件夹移动位置后，旧会话就「消失」了——数据还在，但路径对不上。

这个工具解决的就是这个问题：**搬完文件夹后跑一下，把旧会话的路径更新到新位置。**

## 安装

```bash
# 从 GitHub 安装
npm i -g https://github.com/workdocyeye/opencode-session-follow

# 或从 npm（以后支持）
npm i -g opencode-session-follow
```

## 用法

```bash
# 进到新目录，自动检测
cd 集合文件夹/项目A
osf

# 或手动指定路径
osf --old "Desktop/项目A" --new "集合文件夹/项目A"
```

支持全称：

```bash
opencode-session-follow --old "Desktop/项目A" --new "集合文件夹/项目A"
```

## 工作原理

读取 OpenCode 的数据库 `~/.local/share/opencode/opencode.db`，执行一条 `UPDATE` 语句将会话记录的 `directory` 和 `path` 字段更新为新路径。仅此而已，不做任何其他修改。

## 零依赖

纯 Node.js，没有任何外部依赖。通过 `sqlite3` 命令行工具操作数据库。

## License

MIT
