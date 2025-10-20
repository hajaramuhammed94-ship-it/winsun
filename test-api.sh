#!/bin/bash

echo "╔═══════════════════════════════════════════════════╗"
echo "║   🧪 Winsun API 测试脚本                         ║"
echo "╚═══════════════════════════════════════════════════╝"
echo ""

API_URL="http://localhost:5000/api"

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 测试函数
test_endpoint() {
    local name=$1
    local endpoint=$2
    local method=${3:-GET}
    local data=$4
    
    echo -n "测试 $name ... "
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" "$API_URL$endpoint")
    else
        response=$(curl -s -w "\n%{http_code}" -X $method \
            -H "Content-Type: application/json" \
            -d "$data" \
            "$API_URL$endpoint")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        echo -e "${GREEN}✅ 成功${NC} (HTTP $http_code)"
        return 0
    else
        echo -e "${RED}❌ 失败${NC} (HTTP $http_code)"
        echo "   响应: $body"
        return 1
    fi
}

echo "🔍 检查API服务器状态..."
echo ""

# 1. 健康检查
test_endpoint "健康检查" "/health"

echo ""
echo "📡 测试API端点..."
echo ""

# 2. 获取定价方案
test_endpoint "获取定价方案" "/pricing"

# 3. 获取用户反馈
test_endpoint "获取用户反馈" "/testimonials?featured=true"

# 4. 获取新闻列表
test_endpoint "获取新闻列表" "/news?limit=5"

# 5. 获取交易信号
test_endpoint "获取交易信号" "/signals?status=active"

# 6. 获取性能数据
test_endpoint "获取性能数据" "/performance?metric_type=net_value"

echo ""
echo "🔐 测试用户认证..."
echo ""

# 7. 用户注册 (使用随机邮箱)
RANDOM_EMAIL="test$(date +%s)@example.com"
test_endpoint "用户注册" "/auth/register" "POST" \
    "{\"email\":\"$RANDOM_EMAIL\",\"password\":\"123456\",\"username\":\"testuser\"}"

# 8. 用户登录
test_endpoint "用户登录" "/auth/login" "POST" \
    "{\"email\":\"$RANDOM_EMAIL\",\"password\":\"123456\"}"

echo ""
echo "📧 测试Newsletter订阅..."
echo ""

# 9. Newsletter订阅
RANDOM_SUB_EMAIL="subscriber$(date +%s)@example.com"
test_endpoint "Newsletter订阅" "/newsletter/subscribe" "POST" \
    "{\"email\":\"$RANDOM_SUB_EMAIL\"}"

echo ""
echo "📝 测试联系表单..."
echo ""

# 10. 提交联系表单
test_endpoint "提交联系表单" "/contact/submit" "POST" \
    "{\"name\":\"测试用户\",\"email\":\"test@example.com\",\"message\":\"这是一条测试消息\"}"

echo ""
echo "╔═══════════════════════════════════════════════════╗"
echo "║   ✅ API测试完成！                               ║"
echo "╚═══════════════════════════════════════════════════╝"
echo ""

