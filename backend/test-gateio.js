/**
 * 测试Gate.io交易所连接
 */

const ccxt = require('ccxt');

async function testGateIO() {
    console.log('🔄 测试Gate.io连接...\n');

    try {
        // 创建Gate.io交易所实例
        const exchange = new ccxt.gateio({
            enableRateLimit: true,
            timeout: 30000, // 30秒超时
        });

        console.log('1️⃣ 测试获取BTC/USDT价格...');
        const ticker = await exchange.fetchTicker('BTC/USDT');
        console.log('✅ BTC/USDT价格:', ticker.last);
        console.log('   24h最高:', ticker.high);
        console.log('   24h最低:', ticker.low);
        console.log('   24h成交量:', ticker.baseVolume);
        console.log('');

        console.log('2️⃣ 测试获取ETH/USDT价格...');
        const ethTicker = await exchange.fetchTicker('ETH/USDT');
        console.log('✅ ETH/USDT价格:', ethTicker.last);
        console.log('');

        console.log('3️⃣ 测试获取K线数据...');
        const klines = await exchange.fetchOHLCV('BTC/USDT', '1h', undefined, 10);
        console.log(`✅ 获取到 ${klines.length} 条K线数据`);
        console.log('   最新K线:', {
            time: new Date(klines[klines.length - 1][0]).toLocaleString(),
            open: klines[klines.length - 1][1],
            high: klines[klines.length - 1][2],
            low: klines[klines.length - 1][3],
            close: klines[klines.length - 1][4],
            volume: klines[klines.length - 1][5]
        });
        console.log('');

        console.log('4️⃣ 测试批量获取价格...');
        const markets = ['BTC/USDT', 'ETH/USDT', 'BNB/USDT'];
        for (const market of markets) {
            const t = await exchange.fetchTicker(market);
            console.log(`✅ ${market}: $${t.last}`);
        }
        console.log('');

        console.log('🎉 Gate.io连接测试成功！');
        console.log('✅ 所有功能正常，可以使用Gate.io作为数据源');

    } catch (error) {
        console.error('❌ Gate.io连接失败:', error.message);
        console.error('');
        console.error('可能的原因:');
        console.error('1. 网络连接问题');
        console.error('2. Gate.io API限流');
        console.error('3. 交易对不存在');
        console.error('');
        console.error('建议: 使用模拟数据或配置代理');
    }
}

testGateIO();

