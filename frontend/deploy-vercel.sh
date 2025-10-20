#!/bin/bash

echo "🚀 Vercel部署脚本"
echo "=================="
echo ""

# 检查Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "📦 安装Vercel CLI..."
    npm install -g vercel
fi

echo "✅ Vercel CLI已安装"
echo ""

# 构建项目
echo "🔨 构建项目..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ 构建成功"
else
    echo "❌ 构建失败"
    exit 1
fi

echo ""
echo "📤 开始部署到Vercel..."
echo ""
echo "请按照提示操作:"
echo "1. 登录邮箱: iwayjws74857@outlook.com"
echo "2. 选择scope: cvsgetyes-projects"
echo "3. 项目名称: winsun-frontend"
echo ""

# 部署
vercel --prod

echo ""
echo "✅ 部署完成！"
echo ""
echo "📝 下一步:"
echo "1. 访问Vercel Dashboard配置环境变量"
echo "2. 部署后端到Railway/Render"
echo "3. 更新vercel.json中的API代理地址"

