#!/bin/bash

echo "📥 开始下载缺失的 JS 文件..."

cd "$(dirname "$0")"

BASE_URL="https://www.winsun8.com"

# 下载 JS 文件
echo "📄 下载 JavaScript 文件..."

curl -s "$BASE_URL/static/js/jquery-3.6.3.min.js" -o "static/js/jquery-3.6.3.min.js"
curl -s "$BASE_URL/static/js/bootstrap.min.js" -o "static/js/bootstrap.min.js"
curl -s "$BASE_URL/static/js/jquery-appear.js" -o "static/js/jquery-appear.js"
curl -s "$BASE_URL/static/js/jquery-validator.js" -o "static/js/jquery-validator.js"
curl -s "$BASE_URL/static/js/jquery.nice-select.min.js" -o "static/js/jquery.nice-select.min.js"
curl -s "$BASE_URL/static/js/scrollTrigger.min.js" -o "static/js/scrollTrigger.min.js"
curl -s "$BASE_URL/static/js/filp.min.js" -o "static/js/filp.min.js"
curl -s "$BASE_URL/static/js/ScrollToPlugin.min.js" -o "static/js/ScrollToPlugin.min.js"

# 下载缺失的图片
echo "🖼️  下载缺失的图片..."
curl -s "$BASE_URL/static/picture/p-01.png" -o "static/picture/p-01.png"
curl -s "$BASE_URL/static/picture/p-02.png" -o "static/picture/p-02.png"
curl -s "$BASE_URL/static/picture/p-03.png" -o "static/picture/p-03.png"
curl -s "$BASE_URL/static/picture/p-04.png" -o "static/picture/p-04.png"

# 下载 winsunui 图片
mkdir -p static/winsunui
curl -s "$BASE_URL/static/winsunui/logo_only.png" -o "static/winsunui/logo_only.png"
curl -s "$BASE_URL/static/winsunui/winsun_gui.png" -o "static/winsunui/winsun_gui.png"

# 下载 client 资源
mkdir -p client/assets
curl -s "$BASE_URL/client/assets/windynamic.gif" -o "client/assets/windynamic.gif"

echo ""
echo "✅ 下载完成！"
echo ""
echo "📊 统计信息："
echo "  JS 文件: $(ls static/js/*.js 2>/dev/null | wc -l) 个"
echo "  Picture 文件: $(ls static/picture 2>/dev/null | wc -l) 个"
echo "  Winsunui 文件: $(ls static/winsunui 2>/dev/null | wc -l) 个"
echo ""

