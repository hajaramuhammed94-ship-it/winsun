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
