#!/bin/bash
BASE_URL="http://www.winsun8.com/client"
cd frontend/public/client

echo "下载CSS文件..."
curl -s "$BASE_URL/cs.css" -o cs.css
curl -s "$BASE_URL/go.css" -o go.css
curl -s "$BASE_URL/css/bootstrap.min.css" -o css/bootstrap.min.css
curl -s "$BASE_URL/css/bootstrap-icons.css" -o css/bootstrap-icons.css
curl -s "$BASE_URL/css/winsun-kool-form-pack.css" -o css/winsun-kool-form-pack.css

echo "下载JS文件..."
curl -s "$BASE_URL/appjs/jquery-3.6.1.min.js" -o appjs/jquery-3.6.1.min.js
curl -s "$BASE_URL/appjs/jquery.params.js" -o appjs/jquery.params.js
curl -s "$BASE_URL/appjs/json2.js" -o appjs/json2.js
curl -s "$BASE_URL/appjs/md5.js" -o appjs/md5.js
curl -s "$BASE_URL/js/bootstrap.bundle.min.js" -o js/bootstrap.bundle.min.js

echo "下载Logo..."
curl -s "$BASE_URL/assets/winsun_logo_hd.png" -o assets/winsun_logo_hd.png

echo "下载完成！"
ls -lh css/ js/ appjs/ assets/
