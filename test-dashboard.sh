#!/bin/bash
echo "🧪 测试仪表板页面..."
echo ""

echo "1. 检查页面是否可访问..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/dashboard/index.html)
if [ "$STATUS" = "200" ]; then
    echo "   ✅ 页面可访问 (HTTP $STATUS)"
else
    echo "   ❌ 页面不可访问 (HTTP $STATUS)"
fi

echo ""
echo "2. 检查JavaScript文件..."
for file in jquery-3.6.1.min.js jquery.params.js json2.js md5.js; do
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/dashboard/dashboardjs/$file)
    if [ "$STATUS" = "200" ]; then
        echo "   ✅ $file (HTTP $STATUS)"
    else
        echo "   ❌ $file (HTTP $STATUS)"
    fi
done

echo ""
echo "3. 检查CSS文件..."
for file in tron.css win_dark.css tun_dark.css style_dark.css go.css; do
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/dashboard/xcss/$file)
    if [ "$STATUS" = "200" ]; then
        echo "   ✅ $file (HTTP $STATUS)"
    else
        echo "   ❌ $file (HTTP $STATUS)"
    fi
done

echo ""
echo "4. 检查字体文件..."
for file in fa-solid-900.woff2 fa-brands-400.woff2; do
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/dashboard/fonts/$file)
    if [ "$STATUS" = "200" ]; then
        echo "   ✅ $file (HTTP $STATUS)"
    else
        echo "   ❌ $file (HTTP $STATUS)"
    fi
done

echo ""
echo "5. 检查图片文件..."
for file in winsun_logo_hd.png winsun_logo_dsn.png Tutorial_windows.jpg; do
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/dashboard/$file)
    if [ "$STATUS" = "200" ]; then
        echo "   ✅ $file (HTTP $STATUS)"
    else
        echo "   ❌ $file (HTTP $STATUS)"
    fi
done

echo ""
echo "6. 检查Favicon..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/favicon.ico)
if [ "$STATUS" = "200" ]; then
    echo "   ✅ favicon.ico (HTTP $STATUS)"
else
    echo "   ❌ favicon.ico (HTTP $STATUS)"
fi

echo ""
echo "7. 检查API..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/health)
if [ "$STATUS" = "200" ]; then
    echo "   ✅ 后端API运行正常 (HTTP $STATUS)"
else
    echo "   ❌ 后端API异常 (HTTP $STATUS)"
fi

echo ""
echo "✅ 测试完成！"
