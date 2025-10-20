/**
 * 技术指标服务
 * 提供10+种常用技术指标计算
 * MA, EMA, RSI, MACD, 布林带, KDJ, ATR, OBV, CCI, Williams %R
 */

class IndicatorsService {
    /**
     * 计算简单移动平均线 (SMA/MA)
     * @param {Array} prices - 价格数组
     * @param {number} period - 周期
     * @returns {Array} MA值数组
     */
    calculateMA(prices, period) {
        const ma = [];
        for (let i = period - 1; i < prices.length; i++) {
            const sum = prices.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
            ma.push(sum / period);
        }
        return ma;
    }

    /**
     * 计算指数移动平均线 (EMA)
     * @param {Array} prices - 价格数组
     * @param {number} period - 周期
     * @returns {Array} EMA值数组
     */
    calculateEMA(prices, period) {
        const k = 2 / (period + 1);
        const ema = [prices[0]];

        for (let i = 1; i < prices.length; i++) {
            ema.push(prices[i] * k + ema[i - 1] * (1 - k));
        }

        return ema;
    }

    /**
     * 计算相对强弱指标 (RSI)
     * @param {Array} prices - 价格数组
     * @param {number} period - 周期，默认14
     * @returns {number} RSI值 (0-100)
     */
    calculateRSI(prices, period = 14) {
        if (prices.length < period + 1) {
            return 50; // 数据不足，返回中性值
        }

        const changes = [];
        for (let i = 1; i < prices.length; i++) {
            changes.push(prices[i] - prices[i - 1]);
        }

        const gains = changes.map(c => c > 0 ? c : 0);
        const losses = changes.map(c => c < 0 ? Math.abs(c) : 0);

        let avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
        let avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;

        // 使用Wilder's smoothing方法
        for (let i = period; i < changes.length; i++) {
            avgGain = (avgGain * (period - 1) + gains[i]) / period;
            avgLoss = (avgLoss * (period - 1) + losses[i]) / period;
        }

        if (avgLoss === 0) return 100;

        const rs = avgGain / avgLoss;
        const rsi = 100 - (100 / (1 + rs));

        return rsi;
    }

    /**
     * 计算MACD指标
     * @param {Array} prices - 价格数组
     * @param {number} fastPeriod - 快线周期，默认12
     * @param {number} slowPeriod - 慢线周期，默认26
     * @param {number} signalPeriod - 信号线周期，默认9
     * @returns {Object} {macd, signal, histogram}
     */
    calculateMACD(prices, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) {
        const emaFast = this.calculateEMA(prices, fastPeriod);
        const emaSlow = this.calculateEMA(prices, slowPeriod);
        
        // 对齐数组长度
        const diff = emaFast.length - emaSlow.length;
        const macdLine = emaFast.slice(diff).map((val, i) => val - emaSlow[i]);
        
        const signalLine = this.calculateEMA(macdLine, signalPeriod);
        
        // 对齐MACD线和信号线
        const diff2 = macdLine.length - signalLine.length;
        const histogram = macdLine.slice(diff2).map((val, i) => val - signalLine[i]);

        return {
            macd: macdLine[macdLine.length - 1],
            signal: signalLine[signalLine.length - 1],
            histogram: histogram[histogram.length - 1],
            macdLine: macdLine,
            signalLine: signalLine,
            histogramLine: histogram
        };
    }

    /**
     * 计算布林带 (Bollinger Bands)
     * @param {Array} prices - 价格数组
     * @param {number} period - 周期，默认20
     * @param {number} stdDev - 标准差倍数，默认2
     * @returns {Object} {upper, middle, lower}
     */
    calculateBollingerBands(prices, period = 20, stdDev = 2) {
        const ma = this.calculateMA(prices, period);
        const middle = ma[ma.length - 1];

        // 计算标准差
        const slice = prices.slice(-period);
        const variance = slice.reduce((sum, price) => {
            return sum + Math.pow(price - middle, 2);
        }, 0) / period;
        const std = Math.sqrt(variance);

        return {
            upper: middle + (stdDev * std),
            middle: middle,
            lower: middle - (stdDev * std),
            std: std
        };
    }

    /**
     * 计算KDJ指标
     * @param {Array} highs - 最高价数组
     * @param {Array} lows - 最低价数组
     * @param {Array} closes - 收盘价数组
     * @param {number} period - 周期，默认9
     * @returns {Object} {k, d, j}
     */
    calculateKDJ(highs, lows, closes, period = 9) {
        const n = Math.min(highs.length, lows.length, closes.length);
        if (n < period) {
            return { k: 50, d: 50, j: 50 };
        }

        // 计算RSV
        const recentHighs = highs.slice(-period);
        const recentLows = lows.slice(-period);
        const currentClose = closes[closes.length - 1];

        const highestHigh = Math.max(...recentHighs);
        const lowestLow = Math.min(...recentLows);

        let rsv = 50;
        if (highestHigh !== lowestLow) {
            rsv = ((currentClose - lowestLow) / (highestHigh - lowestLow)) * 100;
        }

        // 简化计算：使用当前RSV
        const k = rsv;
        const d = this.calculateMA([rsv], 3)[0] || rsv;
        const j = 3 * k - 2 * d;

        return {
            k: Math.max(0, Math.min(100, k)),
            d: Math.max(0, Math.min(100, d)),
            j: Math.max(0, Math.min(100, j))
        };
    }

    /**
     * 计算ATR (Average True Range) - 平均真实波幅
     * @param {Array} highs - 最高价数组
     * @param {Array} lows - 最低价数组
     * @param {Array} closes - 收盘价数组
     * @param {number} period - 周期，默认14
     * @returns {number} ATR值
     */
    calculateATR(highs, lows, closes, period = 14) {
        const trueRanges = [];
        
        for (let i = 1; i < closes.length; i++) {
            const high = highs[i];
            const low = lows[i];
            const prevClose = closes[i - 1];
            
            const tr = Math.max(
                high - low,
                Math.abs(high - prevClose),
                Math.abs(low - prevClose)
            );
            
            trueRanges.push(tr);
        }

        // 计算ATR（使用EMA）
        const atr = this.calculateEMA(trueRanges, period);
        return atr[atr.length - 1];
    }

    /**
     * 计算OBV (On Balance Volume) - 能量潮
     * @param {Array} closes - 收盘价数组
     * @param {Array} volumes - 成交量数组
     * @returns {number} OBV值
     */
    calculateOBV(closes, volumes) {
        let obv = 0;
        
        for (let i = 1; i < closes.length; i++) {
            if (closes[i] > closes[i - 1]) {
                obv += volumes[i];
            } else if (closes[i] < closes[i - 1]) {
                obv -= volumes[i];
            }
        }

        return obv;
    }

    /**
     * 计算CCI (Commodity Channel Index) - 顺势指标
     * @param {Array} highs - 最高价数组
     * @param {Array} lows - 最低价数组
     * @param {Array} closes - 收盘价数组
     * @param {number} period - 周期，默认20
     * @returns {number} CCI值
     */
    calculateCCI(highs, lows, closes, period = 20) {
        // 计算典型价格
        const typicalPrices = [];
        for (let i = 0; i < closes.length; i++) {
            typicalPrices.push((highs[i] + lows[i] + closes[i]) / 3);
        }

        // 计算SMA
        const sma = this.calculateMA(typicalPrices, period);
        const currentTP = typicalPrices[typicalPrices.length - 1];
        const currentSMA = sma[sma.length - 1];

        // 计算平均偏差
        const recentTP = typicalPrices.slice(-period);
        const meanDeviation = recentTP.reduce((sum, tp) => {
            return sum + Math.abs(tp - currentSMA);
        }, 0) / period;

        if (meanDeviation === 0) return 0;

        const cci = (currentTP - currentSMA) / (0.015 * meanDeviation);
        return cci;
    }

    /**
     * 计算Williams %R - 威廉指标
     * @param {Array} highs - 最高价数组
     * @param {Array} lows - 最低价数组
     * @param {Array} closes - 收盘价数组
     * @param {number} period - 周期，默认14
     * @returns {number} Williams %R值 (-100 到 0)
     */
    calculateWilliamsR(highs, lows, closes, period = 14) {
        const recentHighs = highs.slice(-period);
        const recentLows = lows.slice(-period);
        const currentClose = closes[closes.length - 1];

        const highestHigh = Math.max(...recentHighs);
        const lowestLow = Math.min(...recentLows);

        if (highestHigh === lowestLow) return -50;

        const williamsR = ((highestHigh - currentClose) / (highestHigh - lowestLow)) * -100;
        return williamsR;
    }

    /**
     * 计算所有指标（综合分析）
     * @param {Array} klines - K线数据数组
     * @returns {Object} 所有指标的计算结果
     */
    calculateAllIndicators(klines) {
        const closes = klines.map(k => k.close);
        const highs = klines.map(k => k.high);
        const lows = klines.map(k => k.low);
        const volumes = klines.map(k => k.volume);

        return {
            ma5: this.calculateMA(closes, 5),
            ma10: this.calculateMA(closes, 10),
            ma20: this.calculateMA(closes, 20),
            ma50: this.calculateMA(closes, 50),
            ema12: this.calculateEMA(closes, 12),
            ema26: this.calculateEMA(closes, 26),
            rsi: this.calculateRSI(closes, 14),
            macd: this.calculateMACD(closes),
            bollingerBands: this.calculateBollingerBands(closes),
            kdj: this.calculateKDJ(highs, lows, closes),
            atr: this.calculateATR(highs, lows, closes),
            obv: this.calculateOBV(closes, volumes),
            cci: this.calculateCCI(highs, lows, closes),
            williamsR: this.calculateWilliamsR(highs, lows, closes)
        };
    }
}

module.exports = new IndicatorsService();

