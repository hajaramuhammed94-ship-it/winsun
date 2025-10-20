#!/bin/bash

echo "╔═══════════════════════════════════════════════════╗"
echo "║   🚀 启动 Winsun 项目                            ║"
echo "╚═══════════════════════════════════════════════════╝"
echo ""

# 检查依赖是否已安装
if [ ! -d "backend/node_modules" ] || [ ! -d "frontend/node_modules" ]; then
    echo "⚠️  检测到依赖未安装，正在运行安装脚本..."
    ./install.sh
    if [ $? -ne 0 ]; then
        echo "❌ 安装失败"
        exit 1
    fi
fi

# 创建日志目录
mkdir -p logs

echo "🔧 启动后端服务器..."
cd backend
npm run dev > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
echo "✅ 后端服务器已启动 (PID: $BACKEND_PID)"
echo "   日志文件: logs/backend.log"
echo "   API地址: http://localhost:5000"

cd ..

# 等待后端启动
sleep 3

echo ""
echo "🌐 启动前端服务器..."
cd frontend
npm start > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "✅ 前端服务器已启动 (PID: $FRONTEND_PID)"
echo "   日志文件: logs/frontend.log"
echo "   网站地址: http://localhost:8080"

cd ..

# 保存PID
echo $BACKEND_PID > logs/backend.pid
echo $FRONTEND_PID > logs/frontend.pid

echo ""
echo "╔═══════════════════════════════════════════════════╗"
echo "║   ✅ 所有服务已启动！                            ║"
echo "╚═══════════════════════════════════════════════════╝"
echo ""
echo "📡 访问地址："
echo "   前端: http://localhost:8080"
echo "   API:  http://localhost:5000/api/health"
echo ""
echo "📝 管理命令："
echo "   查看日志: tail -f logs/backend.log"
echo "   查看日志: tail -f logs/frontend.log"
echo "   停止服务: ./stop.sh"
echo ""
echo "按 Ctrl+C 不会停止服务，请使用 ./stop.sh 停止"
echo ""

# 等待用户输入
read -p "按Enter键查看实时日志，或Ctrl+C退出..."

# 显示实时日志
tail -f logs/backend.log logs/frontend.log

