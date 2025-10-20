#!/bin/bash

echo "📥 开始下载Winsun静态资源..."

# 创建目录
mkdir -p static/css
mkdir -p static/js
mkdir -p static/assets
mkdir -p static/picture
mkdir -p static/image
mkdir -p static/webfonts

BASE_URL="https://www.winsun8.com"

# 下载CSS文件
echo "📄 下载CSS文件..."
wget -q -O static/css/font-awesome.css "$BASE_URL/static/css/font-awesome.css"
wget -q -O static/css/bootstrap.min.css "$BASE_URL/static/css/bootstrap.min.css"
wget -q -O static/css/slick.css "$BASE_URL/static/css/slick.css"

# 下载JS文件
echo "📄 下载JS文件..."
wget -q -O static/js/jquery-3.6.0.min.js "$BASE_URL/static/js/jquery-3.6.0.min.js"
wget -q -O static/js/bootstrap.bundle.min.js "$BASE_URL/static/js/bootstrap.bundle.min.js"
wget -q -O static/js/slick.min.js "$BASE_URL/static/js/slick.min.js"
wget -q -O static/js/gsap.min.js "$BASE_URL/static/js/gsap.min.js"
wget -q -O static/js/ScrollTrigger.min.js "$BASE_URL/static/js/ScrollTrigger.min.js"
wget -q -O static/js/smooth-scrollbar.js "$BASE_URL/static/js/smooth-scrollbar.js"

# 下载Logo和图片
echo "🖼️  下载图片资源..."
wget -q -O static/assets/winsun_logo_hd.png "$BASE_URL/static/assets/winsun_logo_hd.png"

# 下载字体
echo "🔤 下载字体文件..."
wget -q -O static/webfonts/fa-regular-400.woff2 "$BASE_URL/static/webfonts/fa-regular-400.woff2"
wget -q -O static/webfonts/fa-regular-400.ttf "$BASE_URL/static/webfonts/fa-regular-400.ttf"

echo "✅ 下载完成！"

