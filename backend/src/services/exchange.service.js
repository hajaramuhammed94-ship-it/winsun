/**
 * 交易所API服务
 * 支持多个交易所：Binance, Gate.io, OKX
 * 提供实时价格、K线数据、订单簿等功能
 */

const ccxt = require('ccxt');
const NodeCache = require('node-cache');

// 创建缓存实例（5秒过期）
const priceCache = new NodeCache({ stdTTL: 5 });
const klineCache = new NodeCache({ stdTTL: 60 }); // K线缓存1分钟

class ExchangeService {
    constructor() {
        // 初始化多个交易所
        this.exchanges = {
            binance: new ccxt.binance({
                enableRateLimit: true,
                options: {
                    defaultType: 'spot', // 现货交易
                    adjustForTimeDifference: true
                }
            }),
            gate: new ccxt.gateio({
                enableRateLimit: true,
                options: {
                    defaultType: 'spot'
                }
            }),
            okx: new ccxt.okx({
                enableRateLimit: true,
                options: {
                    defaultType: 'spot'
                }
            })
        };

        console.log('✅ 交易所服务初始化完成');
    }

    /**
     * 获取实时价格
     * @param {string} symbol - 交易对，如 'BTC/USDT'
     * @param {string} exchange - 交易所名称，默认 'binance'
     * @returns {Object} 价格信息
     */
    async getPrice(symbol = 'BTC/USDT', exchange = 'gate') {
        try {
            // 检查缓存
            const cacheKey = `price_${exchange}_${symbol}`;
            const cached = priceCache.get(cacheKey);
            if (cached) {
                return cached;
            }

            // 获取实时价格
            const ticker = await this.exchanges[exchange].fetchTicker(symbol);
            
            const result = {
                symbol: symbol,
                exchange: exchange,
                price: ticker.last,
                bid: ticker.bid,
                ask: ticker.ask,
                high24h: ticker.high,
                low24h: ticker.low,
                volume24h: ticker.baseVolume,
                quoteVolume24h: ticker.quoteVolume,
                change24h: ticker.change,
                percentage24h: ticker.percentage,
                timestamp: ticker.timestamp,
                datetime: ticker.datetime
            };

            // 存入缓存
            priceCache.set(cacheKey, result);
            
            return result;
        } catch (error) {
            console.error(`❌ 获取价格失败 [${exchange}/${symbol}]:`, error.message);
            throw new Error(`获取价格失败: ${error.message}`);
        }
    }

    /**
     * 获取K线数据
     * @param {string} symbol - 交易对
     * @param {string} timeframe - 时间周期 '1m', '5m', '15m', '1h', '4h', '1d'
     * @param {number} limit - 数据条数
     * @param {string} exchange - 交易所名称
     * @returns {Array} K线数据数组
     */
    async getKlines(symbol = 'BTC/USDT', timeframe = '1h', limit = 100, exchange = 'gate') {
        try {
            // 检查缓存
            const cacheKey = `kline_${exchange}_${symbol}_${timeframe}_${limit}`;
            const cached = klineCache.get(cacheKey);
            if (cached) {
                return cached;
            }

            const ohlcv = await this.exchanges[exchange].fetchOHLCV(
                symbol, 
                timeframe, 
                undefined, 
                limit
            );

            const result = ohlcv.map(candle => ({
                timestamp: candle[0],
                datetime: new Date(candle[0]).toISOString(),
                open: candle[1],
                high: candle[2],
                low: candle[3],
                close: candle[4],
                volume: candle[5]
            }));

            // 存入缓存
            klineCache.set(cacheKey, result);

            return result;
        } catch (error) {
            console.error(`❌ 获取K线失败 [${exchange}/${symbol}]:`, error.message);
            throw new Error(`获取K线失败: ${error.message}`);
        }
    }

    /**
     * 获取订单簿
     * @param {string} symbol - 交易对
     * @param {number} limit - 深度
     * @param {string} exchange - 交易所名称
     * @returns {Object} 订单簿数据
     */
    async getOrderBook(symbol = 'BTC/USDT', limit = 20, exchange = 'binance') {
        try {
            const orderbook = await this.exchanges[exchange].fetchOrderBook(symbol, limit);
            
            return {
                symbol: symbol,
                exchange: exchange,
                bids: orderbook.bids.slice(0, limit).map(bid => ({
                    price: bid[0],
                    amount: bid[1],
                    total: bid[0] * bid[1]
                })),
                asks: orderbook.asks.slice(0, limit).map(ask => ({
                    price: ask[0],
                    amount: ask[1],
                    total: ask[0] * ask[1]
                })),
                timestamp: orderbook.timestamp,
                datetime: orderbook.datetime
            };
        } catch (error) {
            console.error(`❌ 获取订单簿失败 [${exchange}/${symbol}]:`, error.message);
            throw new Error(`获取订单簿失败: ${error.message}`);
        }
    }

    /**
     * 获取多个交易对的价格
     * @param {Array} symbols - 交易对数组
     * @param {string} exchange - 交易所名称
     * @returns {Array} 价格数组
     */
    async getMultiplePrices(symbols = ['BTC/USDT', 'ETH/USDT'], exchange = 'binance') {
        try {
            const promises = symbols.map(symbol => 
                this.getPrice(symbol, exchange).catch(err => ({
                    symbol,
                    exchange,
                    error: err.message
                }))
            );
            return await Promise.all(promises);
        } catch (error) {
            console.error('❌ 获取多个价格失败:', error.message);
            throw new Error(`获取多个价格失败: ${error.message}`);
        }
    }

    /**
     * 获取交易所支持的所有交易对
     * @param {string} exchange - 交易所名称
     * @returns {Array} 交易对列表
     */
    async getMarkets(exchange = 'binance') {
        try {
            const markets = await this.exchanges[exchange].loadMarkets();
            // 只返回USDT交易对
            return Object.keys(markets)
                .filter(symbol => symbol.includes('/USDT'))
                .map(symbol => ({
                    symbol: symbol,
                    base: markets[symbol].base,
                    quote: markets[symbol].quote,
                    active: markets[symbol].active
                }));
        } catch (error) {
            console.error('❌ 获取市场列表失败:', error.message);
            throw new Error(`获取市场列表失败: ${error.message}`);
        }
    }

    /**
     * 获取24小时行情统计
     * @param {string} symbol - 交易对
     * @param {string} exchange - 交易所名称
     * @returns {Object} 24小时统计数据
     */
    async get24hStats(symbol = 'BTC/USDT', exchange = 'binance') {
        try {
            const ticker = await this.exchanges[exchange].fetchTicker(symbol);
            
            return {
                symbol: symbol,
                exchange: exchange,
                open: ticker.open,
                high: ticker.high,
                low: ticker.low,
                close: ticker.close,
                volume: ticker.baseVolume,
                quoteVolume: ticker.quoteVolume,
                change: ticker.change,
                percentage: ticker.percentage,
                average: ticker.average,
                timestamp: ticker.timestamp
            };
        } catch (error) {
            console.error(`❌ 获取24h统计失败 [${exchange}/${symbol}]:`, error.message);
            throw new Error(`获取24h统计失败: ${error.message}`);
        }
    }

    /**
     * 获取交易所余额（需要API密钥）
     * @param {string} exchange - 交易所名称
     * @param {Object} credentials - API凭证 {apiKey, secret}
     * @returns {Object} 余额信息
     */
    async getBalance(exchange = 'binance', credentials = {}) {
        try {
            // 创建带凭证的交易所实例
            const exchangeWithAuth = new ccxt[exchange]({
                apiKey: credentials.apiKey,
                secret: credentials.secret,
                enableRateLimit: true
            });

            const balance = await exchangeWithAuth.fetchBalance();
            
            // 只返回非零余额
            const nonZeroBalances = {};
            for (const [currency, amount] of Object.entries(balance.total)) {
                if (amount > 0) {
                    nonZeroBalances[currency] = {
                        free: balance.free[currency] || 0,
                        used: balance.used[currency] || 0,
                        total: amount
                    };
                }
            }

            return nonZeroBalances;
        } catch (error) {
            console.error(`❌ 获取余额失败 [${exchange}]:`, error.message);
            throw new Error(`获取余额失败: ${error.message}`);
        }
    }

    /**
     * 清除缓存
     */
    clearCache() {
        priceCache.flushAll();
        klineCache.flushAll();
        console.log('✅ 缓存已清除');
    }

    /**
     * 获取缓存统计
     */
    getCacheStats() {
        return {
            price: priceCache.getStats(),
            kline: klineCache.getStats()
        };
    }
}

// 导出单例
module.exports = new ExchangeService();

