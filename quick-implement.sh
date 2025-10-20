#!/bin/bash

# Winsun克隆网站 - 快速实现脚本
# 自动安装依赖并创建核心功能文件

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║     🚀 Winsun克隆网站 - 核心功能快速实现              ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 检查Node.js
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 步骤1: 检查环境"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js未安装${NC}"
    echo "请先安装Node.js: https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}✅ Node.js版本: $(node -v)${NC}"
echo -e "${GREEN}✅ npm版本: $(npm -v)${NC}"
echo ""

# 安装依赖
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 步骤2: 安装核心依赖"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cd backend

echo "安装 ccxt (交易所API库)..."
npm install ccxt --save

echo "安装 socket.io (WebSocket库)..."
npm install socket.io --save

echo "安装 node-cache (缓存库)..."
npm install node-cache --save

echo -e "${GREEN}✅ 依赖安装完成${NC}"
echo ""

# 创建目录结构
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📁 步骤3: 创建目录结构"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

mkdir -p src/services
mkdir -p src/websocket
mkdir -p src/routes

echo -e "${GREEN}✅ 目录创建完成${NC}"
echo ""

# 创建测试脚本
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🧪 步骤4: 创建测试脚本"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 创建交易所API测试
cat > test-exchange.js << 'EOF'
const ccxt = require('ccxt');

async function testExchange() {
    console.log('🧪 测试交易所API连接...\n');
    
    try {
        // 初始化Binance
        const binance = new ccxt.binance({
            enableRateLimit: true
        });
        
        console.log('1️⃣ 测试获取BTC/USDT价格...');
        const ticker = await binance.fetchTicker('BTC/USDT');
        console.log('   ✅ BTC价格:', ticker.last);
        console.log('   📊 24h涨跌:', ticker.percentage + '%');
        console.log('   📈 24h最高:', ticker.high);
        console.log('   📉 24h最低:', ticker.low);
        console.log('   💰 24h成交量:', ticker.baseVolume);
        console.log('');
        
        console.log('2️⃣ 测试获取K线数据...');
        const ohlcv = await binance.fetchOHLCV('BTC/USDT', '1h', undefined, 5);
        console.log('   ✅ 获取到', ohlcv.length, '条K线数据');
        console.log('   最新K线:');
        const latest = ohlcv[ohlcv.length - 1];
        console.log('   - 时间:', new Date(latest[0]).toISOString());
        console.log('   - 开盘:', latest[1]);
        console.log('   - 最高:', latest[2]);
        console.log('   - 最低:', latest[3]);
        console.log('   - 收盘:', latest[4]);
        console.log('   - 成交量:', latest[5]);
        console.log('');
        
        console.log('3️⃣ 测试获取订单簿...');
        const orderbook = await binance.fetchOrderBook('BTC/USDT', 5);
        console.log('   ✅ 买单数量:', orderbook.bids.length);
        console.log('   ✅ 卖单数量:', orderbook.asks.length);
        console.log('   最高买价:', orderbook.bids[0][0]);
        console.log('   最低卖价:', orderbook.asks[0][0]);
        console.log('');
        
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🎉 所有测试通过！交易所API工作正常！');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
    } catch (error) {
        console.error('❌ 测试失败:', error.message);
        process.exit(1);
    }
}

testExchange();
EOF

echo -e "${GREEN}✅ 测试脚本创建完成${NC}"
echo ""

# 运行测试
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 步骤5: 运行测试"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

node test-exchange.js

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 实现进度"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${GREEN}✅ 已完成:${NC}"
echo "  • 安装ccxt交易所API库"
echo "  • 安装socket.io WebSocket库"
echo "  • 安装node-cache缓存库"
echo "  • 创建目录结构"
echo "  • 测试Binance API连接"
echo ""
echo -e "${YELLOW}⏳ 待实现:${NC}"
echo "  • 创建exchange.service.js (交易所服务)"
echo "  • 创建signal.service.js (信号算法)"
echo "  • 创建signal.socket.js (WebSocket推送)"
echo "  • 创建market.js路由"
echo "  • 创建signal.js路由"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📖 下一步"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. 查看详细实现指南:"
echo "   cat ../IMPLEMENTATION_GUIDE.md"
echo ""
echo "2. 查看原始网站分析:"
echo "   cat ../ORIGINAL_WINSUN_ANALYSIS.md"
echo ""
echo "3. 查看分析总结:"
echo "   cat ../ANALYSIS_SUMMARY.md"
echo ""
echo "4. 手动创建服务文件:"
echo "   # 复制IMPLEMENTATION_GUIDE.md中的代码到对应文件"
echo "   nano src/services/exchange.service.js"
echo "   nano src/services/signal.service.js"
echo "   nano src/websocket/signal.socket.js"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${BLUE}💡 提示: 所有代码已在IMPLEMENTATION_GUIDE.md中提供${NC}"
echo -e "${BLUE}   您只需要复制粘贴到对应的文件即可！${NC}"
echo ""

