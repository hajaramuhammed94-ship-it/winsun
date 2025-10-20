#!/bin/bash

echo "=== 检查 Vercel 部署资源 ==="
echo ""

BASE_URL="https://winsun-original.vercel.app"

# 检查的资源列表
resources=(
    "/client"
    "/client/index.html"
    "/client/assets/winsun_logo_hd.png"
    "/client/assets/windynamic.gif"
    "/client/css/bootstrap.min.css"
    "/client/js/jquery.min.js"
    "/client/js/bootstrap.bundle.min.js"
    "/client/cs.css"
    "/client/go.css"
)

for resource in "${resources[@]}"; do
    echo -n "检查 $resource ... "
    status=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$BASE_URL$resource" 2>/dev/null)
    
    if [ "$status" = "200" ]; then
        echo "✅ OK ($status)"
    elif [ "$status" = "000" ]; then
        echo "⏱️ 超时"
    else
        echo "❌ 失败 ($status)"
    fi
done

echo ""
echo "=== 检查完成 ==="

