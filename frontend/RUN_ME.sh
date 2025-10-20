#!/bin/bash

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║         🚀 Winsun前端启动脚本                            ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# 检查node_modules
if [ ! -d "node_modules" ] || [ $(ls node_modules 2>/dev/null | wc -l) -lt 50 ]; then
    echo "📦 依赖未安装或不完整，正在安装..."
    npm install --legacy-peer-deps
    echo ""
fi

echo "🚀 启动Vite开发服务器..."
echo ""
echo "📍 前端地址: http://localhost:3000"
echo "🔌 后端API: http://localhost:5000"
echo ""
echo "📝 测试账号:"
echo "   邮箱: 12345@qq.com"
echo "   密码: 123456"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

npm run dev

