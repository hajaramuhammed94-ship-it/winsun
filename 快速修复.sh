#!/bin/bash

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║         🔧 Winsun 前后端匹配修复脚本                    ║"
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

echo -e "${BLUE}📋 修复步骤:${NC}"
echo "1. 重新部署后端到 Vercel"
echo "2. 更新前端配置"
echo "3. 重新部署前端"
echo "4. 验证部署"
echo ""

# 步骤 1: 部署后端
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}步骤 1/4: 部署后端到 Vercel${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

cd "$SCRIPT_DIR/backend"

echo -e "${GREEN}正在部署后端...${NC}"
echo ""
echo -e "${YELLOW}⚠️  请注意记录部署后的 URL！${NC}"
echo ""

# 部署后端
npx vercel --prod

if [ $? -ne 0 ]; then
    echo ""
    echo -e "${RED}❌ 后端部署失败！${NC}"
    echo ""
    echo "可能的原因:"
    echo "1. 未登录 Vercel CLI (运行: npx vercel login)"
    echo "2. 网络连接问题"
    echo "3. 项目配置错误"
    echo ""
    exit 1
fi

echo ""
echo -e "${GREEN}✅ 后端部署成功！${NC}"
echo ""

# 提示用户输入后端 URL
echo -e "${YELLOW}请输入后端部署的 URL (例如: https://winsun-backend.vercel.app):${NC}"
read -p "后端 URL: " BACKEND_URL

if [ -z "$BACKEND_URL" ]; then
    echo -e "${RED}❌ 未输入后端 URL，退出修复${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ 后端 URL: $BACKEND_URL${NC}"
echo ""

# 步骤 2: 测试后端
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}步骤 2/4: 测试后端健康检查${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${GREEN}正在测试后端...${NC}"
echo ""

HEALTH_CHECK=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/api/health")

if [ "$HEALTH_CHECK" = "200" ]; then
    echo -e "${GREEN}✅ 后端健康检查通过！${NC}"
    echo ""
    curl -s "$BACKEND_URL/api/health" | jq '.' 2>/dev/null || curl -s "$BACKEND_URL/api/health"
    echo ""
else
    echo -e "${RED}❌ 后端健康检查失败 (HTTP $HEALTH_CHECK)${NC}"
    echo ""
    echo "请检查:"
    echo "1. URL 是否正确"
    echo "2. 后端是否部署成功"
    echo "3. Vercel 项目是否正常运行"
    echo ""
    echo -e "${YELLOW}是否继续修复前端? (y/n)${NC}"
    read -p "> " CONTINUE
    if [ "$CONTINUE" != "y" ]; then
        exit 1
    fi
fi

# 步骤 3: 更新前端配置
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}步骤 3/4: 更新前端配置${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

cd "$SCRIPT_DIR/frontend"

echo -e "${GREEN}正在更新 vercel.json...${NC}"

# 备份原文件
cp vercel.json vercel.json.backup

# 更新 vercel.json
cat > vercel.json << EOF
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "$BACKEND_URL/api/:path*"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
EOF

echo -e "${GREEN}✅ vercel.json 已更新${NC}"
echo ""

# 更新静态前端配置
echo -e "${GREEN}正在更新 frontend-static/client/config.js...${NC}"

cd "$SCRIPT_DIR/frontend-static/client"

# 备份原文件
cp config.js config.js.backup

# 使用 sed 更新 baseUrl
sed -i "s|baseUrl: 'https://winsun-backend-[^']*'|baseUrl: '$BACKEND_URL'|g" config.js

echo -e "${GREEN}✅ config.js 已更新${NC}"
echo ""

# 步骤 4: 部署前端
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}步骤 4/4: 部署前端到 Vercel${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

cd "$SCRIPT_DIR/frontend"

echo -e "${GREEN}正在部署前端...${NC}"
echo ""

npx vercel --prod

if [ $? -ne 0 ]; then
    echo ""
    echo -e "${RED}❌ 前端部署失败！${NC}"
    echo ""
    echo "配置文件已更新，您可以稍后手动部署:"
    echo "cd $SCRIPT_DIR/frontend"
    echo "npx vercel --prod"
    echo ""
    exit 1
fi

echo ""
echo -e "${GREEN}✅ 前端部署成功！${NC}"
echo ""

# 完成
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🎉 修复完成！${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${BLUE}📋 修复摘要:${NC}"
echo ""
echo "✅ 后端已部署到: $BACKEND_URL"
echo "✅ 前端配置已更新"
echo "✅ 前端已重新部署"
echo ""

echo -e "${YELLOW}⚠️  重要提醒:${NC}"
echo ""
echo "1. 请在 Vercel 控制台配置环境变量:"
echo "   https://vercel.com/cvsgetyes-projects/winsun-backend/settings/environment-variables"
echo ""
echo "   需要添加:"
echo "   - JWT_SECRET=your-super-secret-jwt-key"
echo "   - FRONTEND_URL=https://winsun-original.vercel.app"
echo ""
echo "2. 配置环境变量后，需要重新部署后端:"
echo "   cd $SCRIPT_DIR/backend"
echo "   npx vercel --prod"
echo ""

echo -e "${BLUE}🧪 测试步骤:${NC}"
echo ""
echo "1. 测试后端:"
echo "   curl $BACKEND_URL/api/health"
echo ""
echo "2. 访问前端:"
echo "   https://winsun-original.vercel.app"
echo ""
echo "3. 测试登录:"
echo "   邮箱: 12345@qq.com"
echo "   密码: 123456"
echo ""

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

