#!/bin/bash

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║     🚀 Winsun Git + GitHub + Vercel 自动集成脚本        ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 获取脚本所在目录
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo -e "${BLUE}📋 集成步骤:${NC}"
echo "1. 初始化 Git 仓库"
echo "2. 创建 .gitignore"
echo "3. 提交初始代码"
echo "4. 连接到 GitHub"
echo "5. 推送代码"
echo ""

# 步骤 1: 检查是否已经是 Git 仓库
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}步骤 1/5: 初始化 Git 仓库${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

if [ -d ".git" ]; then
    echo -e "${YELLOW}⚠️  Git 仓库已存在，跳过初始化${NC}"
else
    echo -e "${GREEN}正在初始化 Git 仓库...${NC}"
    git init
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Git 仓库初始化成功${NC}"
    else
        echo -e "${RED}❌ Git 仓库初始化失败${NC}"
        exit 1
    fi
fi

echo ""

# 配置 Git 用户信息
echo -e "${GREEN}配置 Git 用户信息...${NC}"
git config user.name "hajaramuhammed94" 2>/dev/null || git config --global user.name "hajaramuhammed94"
git config user.email "iwayjws74857@outlook.com" 2>/dev/null || git config --global user.email "iwayjws74857@outlook.com"

echo -e "${GREEN}✅ Git 用户信息配置完成${NC}"
echo ""

# 步骤 2: 创建 .gitignore
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}步骤 2/5: 创建 .gitignore${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${GREEN}正在创建 .gitignore...${NC}"

cat > .gitignore << 'EOF'
# 依赖
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
package-lock.json
yarn.lock

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
.parcel-cache/

# 数据库
*.db
*.sqlite
*.sqlite3

# 上传文件
uploads/

# 备份文件
*.backup
*.bak
*.old

# 测试覆盖率
coverage/
.nyc_output/

# Python
__pycache__/
*.py[cod]
*$py.class
.Python
venv/
ENV/

# macOS
.DS_Store
.AppleDouble
.LSOverride

# Windows
Thumbs.db
ehthumbs.db
Desktop.ini
EOF

echo -e "${GREEN}✅ .gitignore 创建完成${NC}"
echo ""

# 步骤 3: 提交初始代码
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}步骤 3/5: 提交初始代码${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${GREEN}正在添加文件到 Git...${NC}"
git add .

echo ""
echo -e "${BLUE}将要提交的文件:${NC}"
git status --short | head -20
echo ""

echo -e "${GREEN}正在提交代码...${NC}"
git commit -m "Initial commit: Winsun cryptocurrency trading platform

- Frontend: React + TypeScript + Vite
- Backend: Node.js + Express + Socket.IO
- Features: Trading signals, real-time updates, user authentication
- Deployment: Vercel (frontend + backend separated)"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ 代码提交成功${NC}"
else
    echo -e "${YELLOW}⚠️  没有新的更改需要提交${NC}"
fi

echo ""

# 步骤 4: 连接到 GitHub
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}步骤 4/5: 连接到 GitHub${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${YELLOW}请输入您的 GitHub 用户名 (默认: hajaramuhammed94):${NC}"
read -p "> " GITHUB_USERNAME
GITHUB_USERNAME=${GITHUB_USERNAME:-hajaramuhammed94}

echo ""
echo -e "${YELLOW}请输入仓库名称 (默认: winsun):${NC}"
read -p "> " REPO_NAME
REPO_NAME=${REPO_NAME:-winsun}

echo ""
echo -e "${GREEN}GitHub 仓库 URL: https://github.com/$GITHUB_USERNAME/$REPO_NAME.git${NC}"
echo ""

# 检查是否已经有 remote
if git remote | grep -q "origin"; then
    echo -e "${YELLOW}⚠️  remote 'origin' 已存在，正在更新...${NC}"
    git remote set-url origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
else
    echo -e "${GREEN}正在添加 remote...${NC}"
    git remote add origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
fi

echo -e "${GREEN}✅ GitHub 远程仓库配置完成${NC}"
echo ""

# 步骤 5: 推送代码
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}步骤 5/5: 推送代码到 GitHub${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${YELLOW}⚠️  准备推送代码到 GitHub...${NC}"
echo ""
echo -e "${YELLOW}请确保您已经在 GitHub 创建了仓库: https://github.com/$GITHUB_USERNAME/$REPO_NAME${NC}"
echo ""
echo -e "${YELLOW}是否继续推送? (y/n)${NC}"
read -p "> " CONTINUE

if [ "$CONTINUE" = "y" ] || [ "$CONTINUE" = "Y" ]; then
    echo ""
    echo -e "${GREEN}正在推送代码...${NC}"
    
    # 重命名分支为 main
    git branch -M main
    
    # 推送代码
    git push -u origin main
    
    if [ $? -eq 0 ]; then
        echo ""
        echo -e "${GREEN}✅ 代码推送成功！${NC}"
    else
        echo ""
        echo -e "${RED}❌ 代码推送失败${NC}"
        echo ""
        echo -e "${YELLOW}可能的原因:${NC}"
        echo "1. GitHub 仓库不存在"
        echo "2. 没有推送权限"
        echo "3. 需要配置 SSH 密钥或 Personal Access Token"
        echo ""
        echo -e "${BLUE}解决方案:${NC}"
        echo "1. 确保在 GitHub 创建了仓库: https://github.com/new"
        echo "2. 配置 Personal Access Token:"
        echo "   https://github.com/settings/tokens"
        echo "3. 或配置 SSH 密钥:"
        echo "   ssh-keygen -t ed25519 -C 'iwayjws74857@outlook.com'"
        echo ""
        exit 1
    fi
else
    echo ""
    echo -e "${YELLOW}⚠️  跳过推送步骤${NC}"
    echo ""
    echo -e "${BLUE}稍后可以手动推送:${NC}"
    echo "   git push -u origin main"
fi

echo ""
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🎉 Git 设置完成！${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${BLUE}📋 设置摘要:${NC}"
echo ""
echo "✅ Git 仓库已初始化"
echo "✅ .gitignore 已创建"
echo "✅ 初始代码已提交"
echo "✅ GitHub 远程仓库已配置"
echo "✅ 代码已推送到 GitHub (如果选择了推送)"
echo ""

echo -e "${YELLOW}📋 下一步: 连接 Vercel 到 Git${NC}"
echo ""
echo "1. 前端项目:"
echo "   https://vercel.com/cvsgetyes-projects/winsun-original/settings/git"
echo ""
echo "2. 后端项目:"
echo "   https://vercel.com/cvsgetyes-projects/winsun-backend/settings/git"
echo ""
echo "3. 配置说明:"
echo "   - 选择 GitHub 仓库: $GITHUB_USERNAME/$REPO_NAME"
echo "   - 前端 Root Directory: frontend"
echo "   - 后端 Root Directory: backend"
echo ""

echo -e "${BLUE}🔗 有用的链接:${NC}"
echo ""
echo "GitHub 仓库: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
echo "Vercel 控制台: https://vercel.com/cvsgetyes-projects"
echo "Git 集成指南: $SCRIPT_DIR/Git集成指南.md"
echo ""

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

