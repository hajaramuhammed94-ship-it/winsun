# 🚀 Git + Vercel 集成指南

## 💡 为什么配合 Git 会更好？

### ✅ 使用 Git 的巨大优势

| 功能 | 不用 Git ❌ | 使用 Git ✅ |
|------|------------|------------|
| **自动部署** | 手动运行 `vercel --prod` | 推送代码自动部署 |
| **版本控制** | 无法回滚 | 随时回滚到任何版本 |
| **团队协作** | 难以协作 | 多人同时开发 |
| **预览部署** | 无预览 | 每个分支自动预览 |
| **部署历史** | 难以追踪 | 完整的部署记录 |
| **代码备份** | 本地丢失就没了 | 云端永久保存 |
| **CI/CD** | 手动测试 | 自动测试和部署 |

---

## 🎯 推荐的工作流程

### 当前方式（手动）❌
```bash
1. 修改代码
2. 运行 vercel --prod
3. 等待部署
4. 重复...
```

### Git + Vercel 方式（自动）✅
```bash
1. 修改代码
2. git add .
3. git commit -m "更新功能"
4. git push
5. ✨ Vercel 自动检测并部署！
```

---

## 📋 完整设置步骤

### 步骤 1: 初始化 Git 仓库

```bash
cd /home/jzy/桌面/量化/winsun-clone

# 初始化 Git
git init

# 配置用户信息（如果还没配置）
git config user.name "Your Name"
git config user.email "iwayjws74857@outlook.com"
```

---

### 步骤 2: 创建 .gitignore 文件

这很重要！避免提交不必要的文件：

```bash
cat > .gitignore << 'EOF'
# 依赖
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# 构建输出
dist/
build/
.next/
out/
.vercel/

# 环境变量
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# 编辑器
.vscode/
.idea/
*.swp
*.swo
*~
.DS_Store

# 日志
logs/
*.log

# 临时文件
*.tmp
.cache/
.temp/

# 数据库
*.db
*.sqlite
*.sqlite3

# 上传文件
uploads/

# 备份文件
*.backup
*.bak
EOF
```

---

### 步骤 3: 提交初始代码

```bash
# 添加所有文件
git add .

# 查看将要提交的文件
git status

# 提交
git commit -m "Initial commit: Winsun trading platform"
```

---

### 步骤 4: 创建 GitHub 仓库

#### 方法 A: 使用 GitHub CLI（推荐）

```bash
# 安装 GitHub CLI（如果还没安装）
# Ubuntu/Debian:
# sudo apt install gh

# 登录 GitHub
gh auth login

# 创建仓库并推送
gh repo create winsun-clone --public --source=. --push
```

#### 方法 B: 手动创建

1. 访问: https://github.com/new
2. 仓库名: `winsun-clone`
3. 选择 Public 或 Private
4. **不要**勾选 "Initialize with README"
5. 点击 "Create repository"

然后运行：

```bash
# 添加远程仓库
git remote add origin https://github.com/YOUR_USERNAME/winsun-clone.git

# 推送代码
git branch -M main
git push -u origin main
```

---

### 步骤 5: 连接 Vercel 到 Git

#### 5.1 连接前端项目

1. 访问: https://vercel.com/cvsgetyes-projects/winsun-original/settings/git

2. 点击 "Connect Git Repository"

3. 选择 GitHub

4. 选择仓库: `winsun-clone`

5. 配置项目设置:
   ```
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   ```

6. 点击 "Deploy"

#### 5.2 连接后端项目

1. 访问: https://vercel.com/cvsgetyes-projects/winsun-backend/settings/git

2. 点击 "Connect Git Repository"

3. 选择 GitHub

4. 选择仓库: `winsun-clone`

5. 配置项目设置:
   ```
   Framework Preset: Other
   Root Directory: backend
   Build Command: (留空)
   Output Directory: (留空)
   ```

6. 添加环境变量:
   ```
   JWT_SECRET=your-super-secret-jwt-key
   FRONTEND_URL=https://winsun-original.vercel.app
   NODE_ENV=production
   ```

7. 点击 "Deploy"

---

## 🌳 推荐的分支策略

### 简单项目（个人开发）

```
main (生产环境)
  ↓
  自动部署到 Vercel 生产环境
```

### 团队项目（推荐）

```
main (生产环境)
  ↑
  ← merge ← develop (开发环境)
              ↑
              ← merge ← feature/new-feature (功能分支)
```

**工作流程**:
```bash
# 1. 创建功能分支
git checkout -b feature/add-new-signal

# 2. 开发功能
# ... 修改代码 ...

# 3. 提交
git add .
git commit -m "Add new trading signal algorithm"

# 4. 推送到 GitHub
git push origin feature/add-new-signal

# 5. 在 GitHub 创建 Pull Request
# Vercel 会自动为这个 PR 创建预览部署！

# 6. 审查通过后合并到 develop
git checkout develop
git merge feature/add-new-signal

# 7. 测试通过后合并到 main
git checkout main
git merge develop
git push origin main

# ✨ Vercel 自动部署到生产环境！
```

---

## 🔄 自动部署流程

### 连接 Git 后的工作流程

```
┌─────────────────────────────────────────────────────────┐
│  1. 开发者推送代码到 GitHub                              │
│     git push origin main                                │
└────────────────┬────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────────────┐
│  2. GitHub 触发 Webhook 通知 Vercel                     │
└────────────────┬────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────────────┐
│  3. Vercel 自动拉取最新代码                              │
└────────────────┬────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────────────┐
│  4. Vercel 自动构建项目                                  │
│     - 安装依赖 (npm install)                            │
│     - 运行构建 (npm run build)                          │
│     - 运行测试（如果配置）                               │
└────────────────┬────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────────────┐
│  5. Vercel 自动部署                                      │
│     - main 分支 → 生产环境                              │
│     - 其他分支 → 预览环境                               │
└────────────────┬────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────────────┐
│  6. 部署完成，发送通知                                   │
│     - 邮件通知                                          │
│     - Slack/Discord 通知（可选）                        │
└─────────────────────────────────────────────────────────┘
```

---

## 🎨 预览部署的强大功能

### 每个 Pull Request 都有独立的预览 URL！

```bash
# 创建功能分支
git checkout -b feature/new-dashboard

# 推送到 GitHub
git push origin feature/new-dashboard

# 在 GitHub 创建 Pull Request
```

**Vercel 会自动**:
1. ✅ 为这个 PR 创建预览部署
2. ✅ 生成唯一的预览 URL: `winsun-original-git-feature-new-dashboard.vercel.app`
3. ✅ 在 PR 中添加评论，包含预览链接
4. ✅ 每次推送新代码，自动更新预览

**好处**:
- 🎯 在合并前就能看到效果
- 🧪 可以分享给团队成员测试
- 🔒 不影响生产环境
- 📊 可以并行开发多个功能

---

## 📊 对比：手动部署 vs Git 自动部署

### 场景 1: 修复一个 Bug

#### 手动部署 ❌
```bash
1. 修改代码                    (2分钟)
2. cd frontend
3. vercel --prod               (等待 3-5分钟)
4. cd ../backend
5. vercel --prod               (等待 3-5分钟)
6. 测试                        (5分钟)
7. 发现问题，重复步骤 1-6

总耗时: 15-20分钟
```

#### Git 自动部署 ✅
```bash
1. 修改代码                    (2分钟)
2. git add .
3. git commit -m "Fix bug"
4. git push                    (10秒)
5. ✨ Vercel 自动部署          (3-5分钟，可以去做其他事)
6. 收到部署完成通知
7. 测试                        (5分钟)

总耗时: 8-10分钟，且大部分时间可以做其他事
```

---

### 场景 2: 团队协作

#### 手动部署 ❌
```
问题:
- ❌ 多人修改同一文件，容易冲突
- ❌ 不知道谁改了什么
- ❌ 无法回滚到之前的版本
- ❌ 难以并行开发
```

#### Git 自动部署 ✅
```
优势:
- ✅ Git 自动处理冲突
- ✅ 完整的修改历史
- ✅ 一键回滚
- ✅ 分支隔离，互不影响
- ✅ Code Review 流程
```

---

## 🔧 实用的 Git 命令

### 日常开发

```bash
# 查看状态
git status

# 查看修改
git diff

# 添加文件
git add .                    # 添加所有文件
git add frontend/src/        # 添加特定目录

# 提交
git commit -m "描述信息"

# 推送
git push

# 拉取最新代码
git pull
```

### 分支管理

```bash
# 创建并切换到新分支
git checkout -b feature/new-feature

# 切换分支
git checkout main

# 查看所有分支
git branch -a

# 删除分支
git branch -d feature/old-feature

# 合并分支
git merge feature/new-feature
```

### 回滚操作

```bash
# 查看提交历史
git log --oneline

# 回滚到指定提交
git reset --hard <commit-hash>

# 撤销最后一次提交（保留修改）
git reset --soft HEAD~1

# 撤销文件修改
git checkout -- filename
```

---

## 🎯 立即开始使用 Git

### 快速设置脚本

我可以帮您创建一个自动化脚本：

```bash
#!/bin/bash

echo "🚀 开始设置 Git + Vercel 集成..."

cd /home/jzy/桌面/量化/winsun-clone

# 1. 初始化 Git
echo "📦 初始化 Git 仓库..."
git init

# 2. 配置用户信息
echo "👤 配置 Git 用户信息..."
git config user.name "cvsgetye"
git config user.email "iwayjws74857@outlook.com"

# 3. 创建 .gitignore
echo "📝 创建 .gitignore..."
cat > .gitignore << 'EOF'
node_modules/
dist/
.env
.env.local
.vercel/
*.log
.DS_Store
*.db
*.sqlite
uploads/
*.backup
EOF

# 4. 提交初始代码
echo "💾 提交初始代码..."
git add .
git commit -m "Initial commit: Winsun trading platform with frontend and backend"

echo ""
echo "✅ Git 仓库设置完成！"
echo ""
echo "📋 下一步："
echo "1. 在 GitHub 创建仓库: https://github.com/new"
echo "2. 运行以下命令连接远程仓库:"
echo ""
echo "   git remote add origin https://github.com/YOUR_USERNAME/winsun-clone.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "3. 在 Vercel 连接 Git 仓库"
echo "   前端: https://vercel.com/cvsgetyes-projects/winsun-original/settings/git"
echo "   后端: https://vercel.com/cvsgetyes-projects/winsun-backend/settings/git"
```

---

## 📚 推荐的项目结构（使用 Git）

```
winsun-clone/
├── .git/                    # Git 仓库
├── .gitignore              # Git 忽略文件
├── README.md               # 项目说明
├── frontend/               # 前端项目
│   ├── .gitignore
│   ├── package.json
│   └── ...
├── backend/                # 后端项目
│   ├── .gitignore
│   ├── package.json
│   └── ...
├── docs/                   # 文档
│   ├── API.md
│   ├── DEPLOYMENT.md
│   └── ...
└── .github/                # GitHub 配置
    └── workflows/          # GitHub Actions（可选）
        └── test.yml        # 自动测试
```

---

## 🎉 总结

### 使用 Git 的好处

| 方面 | 提升 |
|------|------|
| **部署效率** | ⬆️ 50% |
| **团队协作** | ⬆️ 200% |
| **代码安全** | ⬆️ 100% |
| **开发体验** | ⬆️ 150% |

### 立即行动

1. ✅ 运行设置脚本初始化 Git
2. ✅ 在 GitHub 创建仓库
3. ✅ 连接 Vercel 到 Git
4. ✅ 享受自动部署的便利！

---

**需要帮助吗？** 我可以帮您：
1. 运行自动设置脚本
2. 创建 GitHub 仓库
3. 配置 Vercel Git 集成

