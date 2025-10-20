#!/bin/bash
BASE_URL="http://www.winsun8.com"
FRONTEND="frontend/public"

echo "📥 开始下载缺失的资源文件..."

# 创建必要的目录
mkdir -p "$FRONTEND/static/picture"
mkdir -p "$FRONTEND/static/image"
mkdir -p "$FRONTEND/static/webfonts"
mkdir -p "$FRONTEND/static/css"
mkdir -p "$FRONTEND/client/assets"

# 下载CSS文件
echo "📄 下载CSS文件..."
curl -s "$BASE_URL/static/css/css2.css" -o "$FRONTEND/static/css/css2.css" 2>/dev/null || echo "  ⚠️  css2.css 不存在"

# 下载字体文件
echo "🔤 下载字体文件..."
curl -s "$BASE_URL/static/css/Neon.ttf" -o "$FRONTEND/static/css/Neon.ttf" 2>/dev/null || echo "  ⚠️  Neon.ttf 不存在"
curl -s "$BASE_URL/static/webfonts/fa-regular-400.woff2" -o "$FRONTEND/static/webfonts/fa-regular-400.woff2" 2>/dev/null || echo "  ⚠️  fa-regular-400.woff2 不存在"
curl -s "$BASE_URL/static/webfonts/fa-regular-400.ttf" -o "$FRONTEND/static/webfonts/fa-regular-400.ttf" 2>/dev/null || echo "  ⚠️  fa-regular-400.ttf 不存在"

# 下载图片文件
echo "🖼️  下载图片文件..."
curl -s "$BASE_URL/client/assets/windynamic.gif" -o "$FRONTEND/client/assets/windynamic.gif"
curl -s "$BASE_URL/static/picture/p-3.jpg" -o "$FRONTEND/static/picture/p-3.jpg"
curl -s "$BASE_URL/static/picture/p-4.jpg" -o "$FRONTEND/static/picture/p-4.jpg"
curl -s "$BASE_URL/static/picture/p-5.jpg" -o "$FRONTEND/static/picture/p-5.jpg"
curl -s "$BASE_URL/static/picture/map-img.png" -o "$FRONTEND/static/picture/map-img.png"
curl -s "$BASE_URL/static/picture/user-01.png" -o "$FRONTEND/static/picture/user-01.png"
curl -s "$BASE_URL/static/picture/user-02.png" -o "$FRONTEND/static/picture/user-02.png"
curl -s "$BASE_URL/static/picture/user-03.png" -o "$FRONTEND/static/picture/user-03.png"
curl -s "$BASE_URL/static/picture/user-04.png" -o "$FRONTEND/static/picture/user-04.png"
curl -s "$BASE_URL/static/picture/star.png" -o "$FRONTEND/static/picture/star.png"
curl -s "$BASE_URL/static/picture/user_1.png" -o "$FRONTEND/static/picture/user_1.png"
curl -s "$BASE_URL/static/picture/user_2.png" -o "$FRONTEND/static/picture/user_2.png"
curl -s "$BASE_URL/static/picture/user_3.png" -o "$FRONTEND/static/picture/user_3.png"
curl -s "$BASE_URL/static/picture/user_4.png" -o "$FRONTEND/static/picture/user_4.png"
curl -s "$BASE_URL/static/picture/blog-01.jpg" -o "$FRONTEND/static/picture/blog-01.jpg"
curl -s "$BASE_URL/static/picture/blog-02.jpg" -o "$FRONTEND/static/picture/blog-02.jpg"
curl -s "$BASE_URL/static/picture/blog-03.jpg" -o "$FRONTEND/static/picture/blog-03.jpg"
curl -s "$BASE_URL/static/picture/blog-04.jpg" -o "$FRONTEND/static/picture/blog-04.jpg"
curl -s "$BASE_URL/static/picture/logo.png" -o "$FRONTEND/static/picture/logo.png"
curl -s "$BASE_URL/static/image/banner-bg-vector.png" -o "$FRONTEND/static/image/banner-bg-vector.png"
curl -s "$BASE_URL/static/image/about-bg-object.png" -o "$FRONTEND/static/image/about-bg-object.png"

# 下载favicon
echo "🎨 下载favicon..."
curl -s "$BASE_URL/favicon-32x32.png" -o "$FRONTEND/favicon-32x32.png"
curl -s "$BASE_URL/favicon-16x16.png" -o "$FRONTEND/favicon-16x16.png"
curl -s "$BASE_URL/apple-touch-icon.png" -o "$FRONTEND/apple-touch-icon.png"
curl -s "$BASE_URL/site.webmanifest" -o "$FRONTEND/site.webmanifest"

echo ""
echo "✅ 下载完成！检查文件..."
echo ""
echo "📊 图片文件统计："
ls -lh "$FRONTEND/static/picture/" 2>/dev/null | grep -v "^总计" | wc -l
echo ""
echo "📊 图像文件统计："
ls -lh "$FRONTEND/static/image/" 2>/dev/null | grep -v "^总计" | wc -l
echo ""
echo "🎉 所有资源下载完成！"
