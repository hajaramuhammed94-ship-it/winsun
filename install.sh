#!/bin/bash

echo "╔═══════════════════════════════════════════════════╗"
echo "║   🚀 Winsun 项目安装脚本                         ║"
echo "╚═══════════════════════════════════════════════════╝"
echo ""

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未安装Node.js"
    echo "请先安装Node.js: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js版本: $(node -v)"

# 检查npm
if ! command -v npm &> /dev/null; then
    echo "❌ 错误: 未安装npm"
    exit 1
fi

echo "✅ npm版本: $(npm -v)"

# 检查PostgreSQL
if ! command -v psql &> /dev/null; then
    echo "⚠️  警告: 未检测到PostgreSQL"
    echo "请确保PostgreSQL已安装并运行"
else
    echo "✅ PostgreSQL已安装"
fi

echo ""
echo "📦 开始安装依赖..."
echo ""

# 安装后端依赖
echo "1️⃣  安装后端依赖..."
cd backend
npm install
if [ $? -eq 0 ]; then
    echo "✅ 后端依赖安装成功"
else
    echo "❌ 后端依赖安装失败"
    exit 1
fi

cd ..

# 安装前端依赖
echo ""
echo "2️⃣  安装前端依赖..."
cd frontend
npm install
if [ $? -eq 0 ]; then
    echo "✅ 前端依赖安装成功"
else
    echo "❌ 前端依赖安装失败"
    exit 1
fi

cd ..

echo ""
echo "╔═══════════════════════════════════════════════════╗"
echo "║   ✅ 安装完成！                                  ║"
echo "╚═══════════════════════════════════════════════════╝"
echo ""
echo "📝 下一步操作："
echo ""
echo "1. 配置数据库："
echo "   createdb winsun_db"
echo ""
echo "2. 配置环境变量："
echo "   编辑 backend/.env 文件"
echo ""
echo "3. 初始化数据库："
echo "   cd backend && npm run db:migrate"
echo ""
echo "4. 启动项目："
echo "   ./start.sh"
echo ""

