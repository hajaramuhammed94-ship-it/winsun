#!/bin/bash

# Winsun 完整功能测试脚本
# 测试所有API和前端功能

echo "╔═══════════════════════════════════════════════════════╗"
echo "║       🧪 Winsun 完整功能测试                         ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 测试计数器
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# 测试函数
test_endpoint() {
    local name=$1
    local url=$2
    local expected=$3
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    echo -n "测试 $TOTAL_TESTS: $name ... "
    
    response=$(curl -s "$url")
    
    if echo "$response" | grep -q "$expected"; then
        echo -e "${GREEN}✓ 通过${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        return 0
    else
        echo -e "${RED}✗ 失败${NC}"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        echo "  响应: $response"
        return 1
    fi
}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📡 测试后端API (http://localhost:5000)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 1. 健康检查
test_endpoint "健康检查" "http://localhost:5000/api/health" "ok"

# 2. 定价方案
test_endpoint "获取定价方案" "http://localhost:5000/api/pricing" "success"

# 3. 用户反馈
test_endpoint "获取用户反馈" "http://localhost:5000/api/testimonials" "success"

# 4. 新闻列表
test_endpoint "获取新闻列表" "http://localhost:5000/api/news" "success"

# 5. 交易信号
test_endpoint "获取交易信号" "http://localhost:5000/api/signals" "success"

# 6. 性能数据
test_endpoint "获取性能数据" "http://localhost:5000/api/performance" "success"

# 7. 性能统计
test_endpoint "获取性能统计" "http://localhost:5000/api/performance/summary" "success"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🌐 测试前端页面 (http://localhost:8080)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 8. 中文首页
test_endpoint "中文首页" "http://localhost:8080/" "Winsun"

# 9. 英文首页
test_endpoint "英文首页" "http://localhost:8080/en" "Winsun"

# 10. 登录页面
test_endpoint "登录页面" "http://localhost:8080/client/login.html" "login"

# 11. 注册页面
test_endpoint "注册页面" "http://localhost:8080/client/register.html" "register"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 测试图表功能"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 12. 检查Chart.js加载
test_endpoint "Chart.js库引用" "http://localhost:8080/" "chart.js"

# 13. 检查图表容器
test_endpoint "图表容器存在" "http://localhost:8080/" "performanceChart"

# 14. 检查图表脚本
test_endpoint "图表脚本引用" "http://localhost:8080/" "static/js/chart.js"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔐 测试用户认证功能"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 15. 测试用户注册
echo -n "测试 $((TOTAL_TESTS + 1)): 用户注册 ... "
TOTAL_TESTS=$((TOTAL_TESTS + 1))

RANDOM_EMAIL="test_$(date +%s)@example.com"
register_response=$(curl -s -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$RANDOM_EMAIL\",\"password\":\"Test123456\",\"username\":\"testuser\"}")

if echo "$register_response" | grep -q "success"; then
    echo -e "${GREEN}✓ 通过${NC}"
    PASSED_TESTS=$((PASSED_TESTS + 1))
    
    # 16. 测试用户登录
    echo -n "测试 $((TOTAL_TESTS + 1)): 用户登录 ... "
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    login_response=$(curl -s -X POST http://localhost:5000/api/auth/login \
      -H "Content-Type: application/json" \
      -d "{\"email\":\"$RANDOM_EMAIL\",\"password\":\"Test123456\"}")
    
    if echo "$login_response" | grep -q "token"; then
        echo -e "${GREEN}✓ 通过${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo -e "${RED}✗ 失败${NC}"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
else
    echo -e "${RED}✗ 失败${NC}"
    FAILED_TESTS=$((FAILED_TESTS + 1))
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    echo -e "${YELLOW}  跳过登录测试${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📧 测试Newsletter订阅"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 17. 测试Newsletter订阅
echo -n "测试 $((TOTAL_TESTS + 1)): Newsletter订阅 ... "
TOTAL_TESTS=$((TOTAL_TESTS + 1))

RANDOM_SUB_EMAIL="subscriber_$(date +%s)@example.com"
subscribe_response=$(curl -s -X POST http://localhost:5000/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$RANDOM_SUB_EMAIL\"}")

if echo "$subscribe_response" | grep -q "success"; then
    echo -e "${GREEN}✓ 通过${NC}"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    echo -e "${RED}✗ 失败${NC}"
    FAILED_TESTS=$((FAILED_TESTS + 1))
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📝 测试联系表单"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 18. 测试联系表单提交
echo -n "测试 $((TOTAL_TESTS + 1)): 联系表单提交 ... "
TOTAL_TESTS=$((TOTAL_TESTS + 1))

contact_response=$(curl -s -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"subject\":\"Test\",\"message\":\"Test message\"}")

if echo "$contact_response" | grep -q "success"; then
    echo -e "${GREEN}✓ 通过${NC}"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    echo -e "${RED}✗ 失败${NC}"
    FAILED_TESTS=$((FAILED_TESTS + 1))
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 详细数据测试"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 19. 测试性能数据格式
echo -n "测试 $((TOTAL_TESTS + 1)): 性能数据格式 ... "
TOTAL_TESTS=$((TOTAL_TESTS + 1))

perf_data=$(curl -s "http://localhost:5000/api/performance?metric_type=net_value")

if echo "$perf_data" | grep -q "date" && echo "$perf_data" | grep -q "value"; then
    echo -e "${GREEN}✓ 通过${NC}"
    PASSED_TESTS=$((PASSED_TESTS + 1))
    
    # 显示数据点数量
    data_count=$(echo "$perf_data" | grep -o "date" | wc -l)
    echo "  数据点数量: $data_count"
else
    echo -e "${RED}✗ 失败${NC}"
    FAILED_TESTS=$((FAILED_TESTS + 1))
fi

echo ""
echo "╔═══════════════════════════════════════════════════════╗"
echo "║                  📊 测试结果汇总                      ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo ""
echo "总测试数: $TOTAL_TESTS"
echo -e "${GREEN}通过: $PASSED_TESTS${NC}"
echo -e "${RED}失败: $FAILED_TESTS${NC}"
echo ""

# 计算成功率
if [ $TOTAL_TESTS -gt 0 ]; then
    success_rate=$((PASSED_TESTS * 100 / TOTAL_TESTS))
    echo "成功率: $success_rate%"
    echo ""
    
    if [ $success_rate -eq 100 ]; then
        echo -e "${GREEN}🎉 所有测试通过！项目运行完美！${NC}"
    elif [ $success_rate -ge 90 ]; then
        echo -e "${YELLOW}⚠️  大部分测试通过，有少量问题需要修复${NC}"
    else
        echo -e "${RED}❌ 多个测试失败，需要检查配置${NC}"
    fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🌐 访问地址:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  前端 (中文): http://localhost:8080/"
echo "  前端 (英文): http://localhost:8080/en"
echo "  登录页面:    http://localhost:8080/client/login.html"
echo "  注册页面:    http://localhost:8080/client/register.html"
echo "  API健康:     http://localhost:5000/api/health"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

