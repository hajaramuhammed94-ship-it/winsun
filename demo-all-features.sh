#!/bin/bash

# Winsun 功能演示脚本
# 展示所有当前可用的功能

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║         🚀 Winsun 功能演示脚本                           ║"
echo "║         展示所有当前可用的功能                            ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

API_URL="http://localhost:5000"
WEB_URL="http://localhost:8080"

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 检查服务器是否运行
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📡 步骤1: 检查服务器状态"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 检查后端
if curl -s "$API_URL/api/health" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ 后端服务器运行正常${NC} ($API_URL)"
else
    echo -e "${RED}❌ 后端服务器未运行${NC}"
    echo "请先启动后端: cd backend && npm start"
    exit 1
fi

# 检查前端
if curl -s -I "$WEB_URL" | grep "200 OK" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ 前端服务器运行正常${NC} ($WEB_URL)"
else
    echo -e "${YELLOW}⚠️  前端服务器未运行${NC}"
    echo "请先启动前端: cd frontend && npm start"
fi

echo ""
sleep 2

# 功能1: 用户注册
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📝 步骤2: 测试用户注册功能"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

TEST_EMAIL="demo$(date +%s)@qq.com"
TEST_PASSWORD="123456"
TEST_USERNAME="demouser"

echo "注册新用户..."
echo "  邮箱: $TEST_EMAIL"
echo "  密码: $TEST_PASSWORD"
echo "  用户名: $TEST_USERNAME"
echo ""

REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\",\"username\":\"$TEST_USERNAME\"}")

if echo "$REGISTER_RESPONSE" | grep -q "success.*true"; then
    echo -e "${GREEN}✅ 注册成功！${NC}"
    echo "$REGISTER_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$REGISTER_RESPONSE"
else
    echo -e "${RED}❌ 注册失败${NC}"
    echo "$REGISTER_RESPONSE"
fi

echo ""
sleep 2

# 功能2: 用户登录
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔐 步骤3: 测试用户登录功能"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "使用VIP2账户登录..."
echo "  邮箱: 12345@qq.com"
echo "  密码: 123456"
echo ""

LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"12345@qq.com","password":"123456"}')

if echo "$LOGIN_RESPONSE" | grep -q "success.*true"; then
    echo -e "${GREEN}✅ 登录成功！${NC}"
    TOKEN=$(echo "$LOGIN_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['token'])" 2>/dev/null)
    echo "Token: ${TOKEN:0:50}..."
else
    echo -e "${RED}❌ 登录失败${NC}"
    echo "$LOGIN_RESPONSE"
    exit 1
fi

echo ""
sleep 2

# 功能3: 查看订阅码
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎫 步骤4: 查看订阅码列表"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

SUBSCRIPTIONS=$(curl -s "$API_URL/api/dashboard/subscriptions" \
  -H "Authorization: Bearer $TOKEN")

if echo "$SUBSCRIPTIONS" | grep -q "success.*true"; then
    echo -e "${GREEN}✅ 获取订阅码成功！${NC}"
    echo ""
    echo "$SUBSCRIPTIONS" | python3 -m json.tool 2>/dev/null || echo "$SUBSCRIPTIONS"
    
    # 提取订阅码信息
    SUBCODE=$(echo "$SUBSCRIPTIONS" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data['data'][0]['subcode'] if data['data'] else 'N/A')" 2>/dev/null)
    VIP_LEVEL=$(echo "$SUBSCRIPTIONS" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data['data'][0]['vip_level'] if data['data'] else 'N/A')" 2>/dev/null)
    END_DATE=$(echo "$SUBSCRIPTIONS" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data['data'][0]['end_date'] if data['data'] else 'N/A')" 2>/dev/null)
    
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${BLUE}📊 订阅码详情${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "  订阅码: $SUBCODE"
    echo "  VIP等级: $VIP_LEVEL"
    echo "  到期日期: $END_DATE"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
else
    echo -e "${YELLOW}⚠️  暂无订阅码${NC}"
fi

echo ""
sleep 2

# 功能4: 查看VIP状态
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "👑 步骤5: 查看VIP状态"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

VIP_STATUS=$(curl -s "$API_URL/api/dashboard/vip-status" \
  -H "Authorization: Bearer $TOKEN")

if echo "$VIP_STATUS" | grep -q "success.*true"; then
    echo -e "${GREEN}✅ 获取VIP状态成功！${NC}"
    echo ""
    echo "$VIP_STATUS" | python3 -m json.tool 2>/dev/null || echo "$VIP_STATUS"
else
    echo -e "${RED}❌ 获取VIP状态失败${NC}"
fi

echo ""
sleep 2

# 功能5: 购买VIP订阅码
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🛒 步骤6: 测试购买VIP订阅码"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "购买VIP1 月付套餐 (¥300/30天)..."
echo ""

PURCHASE_RESPONSE=$(curl -s -X POST "$API_URL/api/dashboard/purchase-subscription" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"plan_type":"vip1","duration":30}')

if echo "$PURCHASE_RESPONSE" | grep -q "success.*true"; then
    echo -e "${GREEN}✅ 购买成功！${NC}"
    echo ""
    echo "$PURCHASE_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$PURCHASE_RESPONSE"
    
    NEW_SUBCODE=$(echo "$PURCHASE_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['subcode'])" 2>/dev/null)
    echo ""
    echo -e "${BLUE}🎉 新订阅码: $NEW_SUBCODE${NC}"
else
    echo -e "${RED}❌ 购买失败${NC}"
    echo "$PURCHASE_RESPONSE"
fi

echo ""
sleep 2

# 显示可访问的页面
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🌐 步骤7: 可访问的页面"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo ""
echo -e "${BLUE}📄 前端页面:${NC}"
echo "  • 首页:         $WEB_URL/"
echo "  • 登录页面:     $WEB_URL/client/login.html"
echo "  • 注册页面:     $WEB_URL/client/register.html"
echo "  • 仪表板:       $WEB_URL/dashboard/index.html"
echo "  • 购买页面:     $WEB_URL/dashboard/purchase.html"
echo ""
echo -e "${BLUE}🔌 API端点:${NC}"
echo "  • 健康检查:     $API_URL/api/health"
echo "  • 用户注册:     $API_URL/api/auth/register"
echo "  • 用户登录:     $API_URL/api/auth/login"
echo "  • 订阅码列表:   $API_URL/api/dashboard/subscriptions"
echo "  • VIP状态:      $API_URL/api/dashboard/vip-status"
echo "  • 购买订阅:     $API_URL/api/dashboard/purchase-subscription"
echo ""

sleep 2

# 总结
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ 功能演示完成"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo ""
echo -e "${GREEN}🎉 所有功能测试完成！${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 功能状态总结"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${GREEN}✅ 已实现并可用:${NC}"
echo "  • 用户注册/登录系统"
echo "  • JWT Token认证"
echo "  • VIP订阅码管理"
echo "  • 订阅码购买功能"
echo "  • VIP状态查询"
echo "  • 仪表板界面"
echo ""
echo -e "${YELLOW}⚠️  部分实现（演示数据）:${NC}"
echo "  • 交易信号分析"
echo "  • 性能图表"
echo "  • 订单数据"
echo ""
echo -e "${RED}❌ 需要开发:${NC}"
echo "  • 真实交易所API连接"
echo "  • 实时交易信号生成"
echo "  • 真实支付集成"
echo "  • Windows/Android客户端"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📖 查看详细文档"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  • 如何使用真实功能: cat HOW_TO_USE_REAL_FEATURES.md"
echo "  • VIP2账户设置:     cat VIP2_ACCOUNT_SETUP.md"
echo "  • 快速启动指南:     cat QUICK_START.md"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 下一步建议"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. 访问仪表板查看VIP2账户:"
echo "   $WEB_URL/dashboard/index.html"
echo "   邮箱: 12345@qq.com"
echo "   密码: 123456"
echo ""
echo "2. 测试购买功能:"
echo "   $WEB_URL/dashboard/purchase.html"
echo ""
echo "3. 查看API文档:"
echo "   cat README.md"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

