#!/bin/bash

echo "🖼️  开始下载所有图片资源..."

cd "$(dirname "$0")"

# 创建目录
mkdir -p static/picture
mkdir -p static/image

BASE_URL="https://www.winsun8.com"

# 下载 picture 目录的图片
echo "📥 下载 picture 目录图片..."

# Brand logos
for i in {01..07}; do
    echo "  下载 brand-$i.png..."
    curl -s "$BASE_URL/static/picture/brand-$i.png" -o "static/picture/brand-$i.png" 2>/dev/null || echo "    ⚠️  brand-$i.png 下载失败"
done

# Portfolio images
for i in {1..5}; do
    echo "  下载 p-$i.jpg..."
    curl -s "$BASE_URL/static/picture/p-$i.jpg" -o "static/picture/p-$i.jpg" 2>/dev/null || echo "    ⚠️  p-$i.jpg 下载失败"
done

# User avatars (01-04 format)
for i in {01..04}; do
    echo "  下载 user-$i.png..."
    curl -s "$BASE_URL/static/picture/user-$i.png" -o "static/picture/user-$i.png" 2>/dev/null || echo "    ⚠️  user-$i.png 下载失败"
done

# User avatars (1-4 format)
for i in {1..4}; do
    echo "  下载 user_$i.png..."
    curl -s "$BASE_URL/static/picture/user_$i.png" -o "static/picture/user_$i.png" 2>/dev/null || echo "    ⚠️  user_$i.png 下载失败"
done

# Blog images
for i in {01..04}; do
    echo "  下载 blog-$i.jpg..."
    curl -s "$BASE_URL/static/picture/blog-$i.jpg" -o "static/picture/blog-$i.jpg" 2>/dev/null || echo "    ⚠️  blog-$i.jpg 下载失败"
done

# Other images
echo "  下载其他图片..."
curl -s "$BASE_URL/static/picture/star.png" -o "static/picture/star.png" 2>/dev/null
curl -s "$BASE_URL/static/picture/logo.png" -o "static/picture/logo.png" 2>/dev/null
curl -s "$BASE_URL/static/picture/map-img.png" -o "static/picture/map-img.png" 2>/dev/null

# 下载 image 目录的图片
echo "📥 下载 image 目录图片..."
curl -s "$BASE_URL/static/image/banner-bg-vector.png" -o "static/image/banner-bg-vector.png" 2>/dev/null
curl -s "$BASE_URL/static/image/about-bg-object.png" -o "static/image/about-bg-object.png" 2>/dev/null

# 下载 favicon
echo "📥 下载网站图标..."
curl -s "$BASE_URL/favicon-32x32.png" -o "favicon-32x32.png" 2>/dev/null
curl -s "$BASE_URL/favicon-16x16.png" -o "favicon-16x16.png" 2>/dev/null
curl -s "$BASE_URL/apple-touch-icon.png" -o "apple-touch-icon.png" 2>/dev/null

echo ""
echo "✅ 下载完成！"
echo ""
echo "📊 统计信息："
echo "  Picture 目录: $(ls static/picture 2>/dev/null | wc -l) 个文件"
echo "  Image 目录: $(ls static/image 2>/dev/null | wc -l) 个文件"
echo ""

