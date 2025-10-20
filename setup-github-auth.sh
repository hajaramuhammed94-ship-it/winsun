#!/bin/bash

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║       🔐 GitHub Token 认证配置脚本                       ║"
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

echo -e "${BLUE}📋 配置步骤:${NC}"
echo "1. 输入 GitHub Token"
echo "2. 配置 Git 凭证"
echo "3. 测试连接"
echo ""

# 步骤 1: 输入 Token
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}步骤 1/3: 输入 GitHub Personal Access Token${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${YELLOW}请在 GitHub 页面完成以下操作:${NC}"
echo "1. Expiration: 选择 '90 days' 或 'No expiration'"
echo "2. Select scopes: 勾选 'repo' (仓库完整权限)"
echo "3. 点击页面底部的 'Generate token' 按钮"
echo "4. 复制生成的 Token (格式: ghp_xxxxx...)"
echo ""

echo -e "${GREEN}请粘贴您的 GitHub Token:${NC}"
read -s token  # -s 参数隐藏输入
echo ""

# 验证 Token 格式
if [ -z "$token" ]; then
    echo -e "${RED}❌ Token 不能为空${NC}"
    exit 1
fi

if [[ ! $token =~ ^ghp_ ]]; then
    echo -e "${YELLOW}⚠️  警告: Token 格式可能不正确 (应该以 'ghp_' 开头)${NC}"
    echo -e "${YELLOW}是否继续? (y/n)${NC}"
    read -p "> " continue_anyway
    if [ "$continue_anyway" != "y" ]; then
        exit 1
    fi
fi

echo -e "${GREEN}✅ Token 已接收${NC}"
echo ""

# 步骤 2: 配置 Git
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}步骤 2/3: 配置 Git 凭证${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# 配置 Git 用户信息
echo -e "${GREEN}配置 Git 用户信息...${NC}"
git config user.name "hajaramuhammed94" 2>/dev/null || git config --global user.name "hajaramuhammed94"
git config user.email "iwayjws74857@outlook.com" 2>/dev/null || git config --global user.email "iwayjws74857@outlook.com"

# 配置凭证助手
echo -e "${GREEN}配置 Git credential helper...${NC}"
git config --global credential.helper store

# 保存 Token 到凭证文件
echo -e "${GREEN}保存 Token...${NC}"
mkdir -p ~/.git-credentials-backup
echo "https://hajaramuhammed94:$token@github.com" > ~/.git-credentials

echo -e "${GREEN}✅ Git 凭证配置完成${NC}"
echo ""

# 步骤 3: 配置 Remote URL
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}步骤 3/3: 配置 Remote URL${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# 检查是否已经有 remote
if git remote | grep -q "origin"; then
    echo -e "${YELLOW}⚠️  remote 'origin' 已存在${NC}"
    echo ""
    echo -e "${YELLOW}当前 remote URL:${NC}"
    git remote get-url origin
    echo ""
    echo -e "${YELLOW}是否更新为使用 Token? (y/n)${NC}"
    read -p "> " update_remote
    
    if [ "$update_remote" = "y" ] || [ "$update_remote" = "Y" ]; then
        echo -e "${GREEN}更新 remote URL...${NC}"
        git remote set-url origin "https://hajaramuhammed94:$token@github.com/hajaramuhammed94/winsun.git"
        echo -e "${GREEN}✅ Remote URL 已更新${NC}"
    else
        echo -e "${YELLOW}⚠️  跳过更新 remote URL${NC}"
    fi
else
    echo -e "${GREEN}添加 remote...${NC}"
    git remote add origin "https://hajaramuhammed94:$token@github.com/hajaramuhammed94/winsun.git"
    echo -e "${GREEN}✅ Remote 已添加${NC}"
fi

echo ""

# 验证配置
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}验证配置${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${BLUE}Git 用户信息:${NC}"
echo "  Name:  $(git config user.name)"
echo "  Email: $(git config user.email)"
echo ""

echo -e "${BLUE}Remote URL:${NC}"
# 隐藏 Token 显示
git remote get-url origin | sed "s/:.*@/:***@/"
echo ""

# 完成
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🎉 GitHub Token 配置完成！${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${BLUE}📋 配置摘要:${NC}"
echo ""
echo "✅ Git 用户信息已配置"
echo "✅ GitHub Token 已保存"
echo "✅ Git credential helper 已启用"
echo "✅ Remote URL 已配置"
echo ""

echo -e "${YELLOW}🚀 下一步:${NC}"
echo ""
echo "现在可以推送代码到 GitHub 了:"
echo ""
echo "  cd /home/jzy/桌面/量化/winsun-clone"
echo "  ./setup-git.sh"
echo ""
echo "或者手动推送:"
echo ""
echo "  git add ."
echo "  git commit -m 'Initial commit'"
echo "  git push -u origin main"
echo ""

echo -e "${BLUE}💡 提示:${NC}"
echo ""
echo "- Token 已保存，以后推送不需要再输入"
echo "- Token 保存在: ~/.git-credentials"
echo "- 如需更换 Token，重新运行此脚本即可"
echo ""

echo -e "${YELLOW}⚠️  安全提醒:${NC}"
echo ""
echo "- 不要分享您的 Token"
echo "- 不要将 Token 提交到代码仓库"
echo "- 定期更换 Token (建议 90 天)"
echo "- 如果 Token 泄露，立即在 GitHub 删除"
echo ""

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# 询问是否立即测试推送
echo -e "${YELLOW}是否立即测试推送到 GitHub? (y/n)${NC}"
read -p "> " test_push

if [ "$test_push" = "y" ] || [ "$test_push" = "Y" ]; then
    echo ""
    echo -e "${GREEN}测试推送...${NC}"
    echo ""
    
    # 检查是否有未提交的更改
    if [ -n "$(git status --porcelain)" ]; then
        echo -e "${YELLOW}发现未提交的更改，正在提交...${NC}"
        git add .
        git commit -m "Configure GitHub authentication and prepare for deployment"
    fi
    
    # 推送
    echo -e "${GREEN}正在推送到 GitHub...${NC}"
    git push -u origin main
    
    if [ $? -eq 0 ]; then
        echo ""
        echo -e "${GREEN}✅ 推送成功！${NC}"
        echo ""
        echo "查看您的仓库: https://github.com/hajaramuhammed94/winsun"
    else
        echo ""
        echo -e "${RED}❌ 推送失败${NC}"
        echo ""
        echo -e "${YELLOW}可能的原因:${NC}"
        echo "1. GitHub 仓库还未创建"
        echo "2. Token 权限不足"
        echo "3. 网络连接问题"
        echo ""
        echo -e "${BLUE}解决方案:${NC}"
        echo "1. 确保在 GitHub 创建了 'winsun' 仓库"
        echo "2. 检查 Token 是否勾选了 'repo' 权限"
        echo "3. 稍后手动推送: git push -u origin main"
    fi
else
    echo ""
    echo -e "${YELLOW}⚠️  跳过测试推送${NC}"
    echo ""
    echo "稍后可以手动推送:"
    echo "  git push -u origin main"
fi

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

