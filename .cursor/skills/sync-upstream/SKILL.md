---
name: sync-upstream
description: 同步 fork 仓库与上游（upstream）仓库的更新。用于当用户想要拉取原作者的最新代码、同步上游更新、或处理 fork 仓库同步问题时。
---

# 同步上游仓库更新

同步 fork 仓库与原作者（upstream）仓库的工作流。

## 前置检查

执行同步前，先确认环境：

```bash
# 检查远程仓库配置
git remote -v
```

预期输出应包含：
- `origin` - 用户自己的 fork 仓库
- `upstream` - 原作者仓库

如果缺少 `upstream`，需要先添加：

```bash
git remote add upstream <原作者仓库URL>
```

## 同步工作流

复制此清单跟踪进度：

```
同步进度：
- [ ] 步骤 1: 检查本地状态
- [ ] 步骤 2: 获取上游更新
- [ ] 步骤 3: 合并更新
- [ ] 步骤 4: 解决冲突（如有）
- [ ] 步骤 5: 确认结果
```

### 步骤 1: 检查本地状态

```bash
git status
```

- 如有未提交的更改，先 commit 或 stash
- 确保当前在目标分支（通常是 `main`）

### 步骤 2: 获取上游更新

```bash
git fetch upstream
```

### 步骤 3: 合并更新

```bash
git checkout main
git merge upstream/main
```

### 步骤 4: 解决冲突（如有）

如果合并产生冲突：

1. 使用 `git status` 查看冲突文件
2. 编辑冲突文件，解决冲突标记（`<<<<<<<`、`=======`、`>>>>>>>`）
3. 标记为已解决并完成合并：

```bash
git add <冲突文件>
git commit -m "merge: 同步 upstream 更新"
```

### 步骤 5: 确认结果

```bash
git log --oneline -5
git status
```

确认合并成功后，**询问用户**是否推送到 origin：

```bash
git push origin main
```

## 常见问题

### 没有 upstream 远程

```bash
git remote add upstream <原作者仓库URL>
```

### 本地有未提交的更改

```bash
# 选项 1: 暂存
git stash
# 同步完成后恢复
git stash pop

# 选项 2: 先提交
git add .
git commit -m "WIP: 保存当前进度"
```

### 合并后想撤销

```bash
# 撤销最近一次合并（未 push 前）
git reset --hard HEAD~1
```
