#!/bin/bash

echo "╔═══════════════════════════════════════════════════╗"
echo "║   🛑 停止 Winsun 项目                            ║"
echo "╚═══════════════════════════════════════════════════╝"
echo ""

# 停止后端
if [ -f logs/backend.pid ]; then
    BACKEND_PID=$(cat logs/backend.pid)
    if ps -p $BACKEND_PID > /dev/null 2>&1; then
        echo "🛑 停止后端服务器 (PID: $BACKEND_PID)..."
        kill $BACKEND_PID
        echo "✅ 后端服务器已停止"
    else
        echo "⚠️  后端服务器未运行"
    fi
    rm logs/backend.pid
else
    echo "⚠️  未找到后端PID文件"
fi

echo ""

# 停止前端
if [ -f logs/frontend.pid ]; then
    FRONTEND_PID=$(cat logs/frontend.pid)
    if ps -p $FRONTEND_PID > /dev/null 2>&1; then
        echo "🛑 停止前端服务器 (PID: $FRONTEND_PID)..."
        kill $FRONTEND_PID
        echo "✅ 前端服务器已停止"
    else
        echo "⚠️  前端服务器未运行"
    fi
    rm logs/frontend.pid
else
    echo "⚠️  未找到前端PID文件"
fi

echo ""
echo "╔═══════════════════════════════════════════════════╗"
echo "║   ✅ 所有服务已停止                              ║"
echo "╚═══════════════════════════════════════════════════╝"
echo ""

