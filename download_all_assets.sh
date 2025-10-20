#!/bin/bash
BASE_URL="http://www.winsun8.com"
FRONTEND="frontend/public"

echo "开始下载所有静态资源..."

# 下载CSS文件
echo "下载CSS文件..."
curl -s "$BASE_URL/static/css/font-awesome.css" -o "$FRONTEND/static/css/font-awesome.css"
curl -s "$BASE_URL/static/css/bootstrap.min.css" -o "$FRONTEND/static/css/bootstrap.min.css"
curl -s "$BASE_URL/static/css/slick.css" -o "$FRONTEND/static/css/slick.css"
curl -s "$BASE_URL/static/css/app.css" -o "$FRONTEND/static/css/app.css"
curl -s "$BASE_URL/static/css/cs.css" -o "$FRONTEND/static/css/cs.css"
curl -s "$BASE_URL/static/css/wxg.css" -o "$FRONTEND/static/css/wxg.css"

# 下载JS文件
echo "下载JavaScript文件..."
curl -s "$BASE_URL/static/js/jquery-3.6.3.min.js" -o "$FRONTEND/static/js/jquery-3.6.3.min.js"
curl -s "$BASE_URL/static/js/bootstrap.min.js" -o "$FRONTEND/static/js/bootstrap.min.js"
curl -s "$BASE_URL/static/js/slick.min.js" -o "$FRONTEND/static/js/slick.min.js"
curl -s "$BASE_URL/static/js/jquery-appear.js" -o "$FRONTEND/static/js/jquery-appear.js"
curl -s "$BASE_URL/static/js/jquery-validator.js" -o "$FRONTEND/static/js/jquery-validator.js"
curl -s "$BASE_URL/static/js/jquery.nice-select.min.js" -o "$FRONTEND/static/js/jquery.nice-select.min.js"
curl -s "$BASE_URL/static/js/gsap.min.js" -o "$FRONTEND/static/js/gsap.min.js"
curl -s "$BASE_URL/static/js/scrollTrigger.min.js" -o "$FRONTEND/static/js/scrollTrigger.min.js"
curl -s "$BASE_URL/static/js/filp.min.js" -o "$FRONTEND/static/js/filp.min.js"
curl -s "$BASE_URL/static/js/ScrollToPlugin.min.js" -o "$FRONTEND/static/js/ScrollToPlugin.min.js"
curl -s "$BASE_URL/static/js/smooth-scrollbar.js" -o "$FRONTEND/static/js/smooth-scrollbar.js"
curl -s "$BASE_URL/static/js/app.js" -o "$FRONTEND/static/js/app.js"

# 下载图片资源
echo "下载图片资源..."
curl -s "$BASE_URL/static/assets/winsun_logo_hd.png" -o "$FRONTEND/static/assets/winsun_logo_hd.png"
curl -s "$BASE_URL/static/winsunui/logo_only.png" -o "$FRONTEND/static/winsunui/logo_only.png"
curl -s "$BASE_URL/static/winsunui/winsun_gui.png" -o "$FRONTEND/static/winsunui/winsun_gui.png"
curl -s "$BASE_URL/client/assets/windynamic.gif" -o "$FRONTEND/client/assets/windynamic.gif"

# 下载品牌图片
for i in {1..7}; do
    curl -s "$BASE_URL/static/picture/brand-0$i.png" -o "$FRONTEND/static/picture/brand-0$i.png" 2>/dev/null
done

# 下载其他图片
curl -s "$BASE_URL/static/picture/p-1.jpg" -o "$FRONTEND/static/picture/p-1.jpg"
curl -s "$BASE_URL/static/picture/p-01.png" -o "$FRONTEND/static/picture/p-01.png"
curl -s "$BASE_URL/static/picture/p-02.png" -o "$FRONTEND/static/picture/p-02.png"
curl -s "$BASE_URL/static/picture/p-03.png" -o "$FRONTEND/static/picture/p-03.png"
curl -s "$BASE_URL/static/picture/p-04.png" -o "$FRONTEND/static/picture/p-04.png"

# 下载HTML页面
echo "下载HTML页面..."
curl -s "$BASE_URL/" -o "$FRONTEND/index.html"
curl -s "$BASE_URL/indexen.html" -o "$FRONTEND/indexen.html"
curl -s "$BASE_URL/client/login.html" -o "$FRONTEND/client/login.html" 2>/dev/null
curl -s "$BASE_URL/client/register.html" -o "$FRONTEND/client/register.html" 2>/dev/null

echo "资源下载完成！"
