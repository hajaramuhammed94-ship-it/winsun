#!/bin/bash
BASE_URL="http://www.winsun8.com"

# CSS files
curl -s "$BASE_URL/static/css/app.css" -o app.css
curl -s "$BASE_URL/static/css/cs.css" -o cs.css
curl -s "$BASE_URL/static/css/wxg.css" -o wxg.css

# JS files
curl -s "$BASE_URL/static/js/app.js" -o app.js

# HTML pages
curl -s "$BASE_URL/indexen.html" -o indexen.html
curl -s "$BASE_URL/client/login.html" -o login.html
curl -s "$BASE_URL/client/register.html" -o register.html 2>/dev/null || echo "register page not accessible"

echo "Download complete"
