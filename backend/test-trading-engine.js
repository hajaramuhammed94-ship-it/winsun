/**
 * 交易引擎测试脚本
 * 测试交易所API、技术指标、信号生成
 */

const exchangeService = require('./src/services/exchange.service');
const indicatorsService = require('./src/services/indicators.service');
const signalService = require('./src/services/signal.service');

console.log('╔═══════════════════════════════════════════════════════════╗');
console.log('║     🚀 Winsun交易引擎测试                              ║');
console.log('╚═══════════════════════════════════════════════════════════╝');
console.log('');

async function testExchangeAPI() {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 测试1: 交易所API集成');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');

    try {
        // 测试获取BTC价格
        console.log('1️⃣  测试获取BTC/USDT价格...');
        const btcPrice = await exchangeService.getPrice('BTC/USDT', 'binance');
        console.log('   ✅ BTC价格:', btcPrice.price);
        console.log('   📊 24h涨跌:', btcPrice.percentage24h + '%');
        console.log('   📈 24h最高:', btcPrice.high24h);
        console.log('   📉 24h最低:', btcPrice.low24h);
        console.log('');

        // 测试获取K线
        console.log('2️⃣  测试获取K线数据...');
        const klines = await exchangeService.getKlines('BTC/USDT', '1h', 10, 'binance');
        console.log('   ✅ 获取到', klines.length, '条K线数据');
        console.log('   最新K线:');
        const latest = klines[klines.length - 1];
        console.log('   - 时间:', latest.datetime);
        console.log('   - 开盘:', latest.open);
        console.log('   - 收盘:', latest.close);
        console.log('   - 成交量:', latest.volume);
        console.log('');

        // 测试批量获取价格
        console.log('3️⃣  测试批量获取价格...');
        const symbols = ['BTC/USDT', 'ETH/USDT', 'BNB/USDT'];
        const prices = await exchangeService.getMultiplePrices(symbols, 'binance');
        console.log('   ✅ 批量获取成功:');
        prices.forEach(p => {
            if (!p.error) {
                console.log(`   - ${p.symbol}: $${p.price}`);
            }
        });
        console.log('');

        return true;
    } catch (error) {
        console.error('   ❌ 测试失败:', error.message);
        return false;
    }
}

async function testIndicators() {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📈 测试2: 技术指标计算');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');

    try {
        // 获取K线数据
        const klines = await exchangeService.getKlines('BTC/USDT', '1h', 100, 'binance');
        
        // 计算所有指标
        console.log('1️⃣  计算所有技术指标...');
        const indicators = indicatorsService.calculateAllIndicators(klines);
        
        console.log('   ✅ 指标计算完成:');
        console.log('');
        console.log('   📊 移动平均线:');
        console.log('   - MA5:', indicators.ma5[indicators.ma5.length - 1].toFixed(2));
        console.log('   - MA20:', indicators.ma20[indicators.ma20.length - 1].toFixed(2));
        console.log('   - MA50:', indicators.ma50[indicators.ma50.length - 1].toFixed(2));
        console.log('');
        
        console.log('   📊 RSI指标:');
        console.log('   - RSI(14):', indicators.rsi.toFixed(2));
        if (indicators.rsi < 30) {
            console.log('   - 状态: 超卖 🟢');
        } else if (indicators.rsi > 70) {
            console.log('   - 状态: 超买 🔴');
        } else {
            console.log('   - 状态: 中性 🟡');
        }
        console.log('');
        
        console.log('   📊 MACD指标:');
        console.log('   - MACD:', indicators.macd.macd.toFixed(2));
        console.log('   - Signal:', indicators.macd.signal.toFixed(2));
        console.log('   - Histogram:', indicators.macd.histogram.toFixed(2));
        console.log('');
        
        console.log('   📊 布林带:');
        console.log('   - 上轨:', indicators.bollingerBands.upper.toFixed(2));
        console.log('   - 中轨:', indicators.bollingerBands.middle.toFixed(2));
        console.log('   - 下轨:', indicators.bollingerBands.lower.toFixed(2));
        console.log('');
        
        console.log('   📊 KDJ指标:');
        console.log('   - K:', indicators.kdj.k.toFixed(2));
        console.log('   - D:', indicators.kdj.d.toFixed(2));
        console.log('   - J:', indicators.kdj.j.toFixed(2));
        console.log('');

        return true;
    } catch (error) {
        console.error('   ❌ 测试失败:', error.message);
        return false;
    }
}

async function testSignalGeneration() {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎯 测试3: 交易信号生成');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');

    try {
        // 生成BTC信号
        console.log('1️⃣  生成BTC/USDT交易信号...');
        const btcSignal = await signalService.generateSignal('BTC/USDT', '1h', 'binance');
        
        console.log('   ✅ 信号生成成功:');
        console.log('');
        console.log('   🎯 交易信号:', btcSignal.signal);
        console.log('   📊 置信度:', (btcSignal.confidence * 100).toFixed(1) + '%');
        console.log('   💰 当前价格: $' + btcSignal.price.toFixed(2));
        
        if (btcSignal.stopLoss) {
            console.log('   🛑 止损价格: $' + btcSignal.stopLoss.toFixed(2));
        }
        if (btcSignal.takeProfit) {
            console.log('   🎯 止盈价格: $' + btcSignal.takeProfit.toFixed(2));
        }
        
        console.log('   ⚠️  风险等级:', btcSignal.risk.level);
        console.log('   📈 波动率:', btcSignal.risk.volatility);
        console.log('');
        
        console.log('   📋 信号原因:');
        btcSignal.reasons.forEach(reason => {
            console.log('   ' + reason);
        });
        console.log('');

        // 批量生成信号
        console.log('2️⃣  批量生成多个交易对信号...');
        const symbols = ['BTC/USDT', 'ETH/USDT', 'BNB/USDT'];
        const signals = await signalService.generateMultipleSignals(symbols, '1h', 'binance');
        
        console.log('   ✅ 批量生成成功:');
        signals.forEach(signal => {
            if (!signal.error) {
                const emoji = signal.signal === 'BUY' ? '🟢' : signal.signal === 'SELL' ? '🔴' : '🟡';
                console.log(`   ${emoji} ${signal.symbol}: ${signal.signal} (${(signal.confidence * 100).toFixed(0)}%)`);
            }
        });
        console.log('');

        return true;
    } catch (error) {
        console.error('   ❌ 测试失败:', error.message);
        return false;
    }
}

async function runAllTests() {
    const startTime = Date.now();
    
    const test1 = await testExchangeAPI();
    const test2 = await testIndicators();
    const test3 = await testSignalGeneration();
    
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 测试总结');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('   测试1 (交易所API):', test1 ? '✅ 通过' : '❌ 失败');
    console.log('   测试2 (技术指标):', test2 ? '✅ 通过' : '❌ 失败');
    console.log('   测试3 (信号生成):', test3 ? '✅ 通过' : '❌ 失败');
    console.log('');
    console.log('   总耗时:', duration, '秒');
    console.log('');
    
    if (test1 && test2 && test3) {
        console.log('🎉 所有测试通过！交易引擎工作正常！');
    } else {
        console.log('⚠️  部分测试失败，请检查错误信息');
    }
    console.log('');
}

// 运行测试
runAllTests().catch(error => {
    console.error('测试过程出错:', error);
    process.exit(1);
});

