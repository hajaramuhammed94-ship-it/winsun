/**
 * 高级信号算法服务
 * 多策略组合，置信度计算，风险评估，止损止盈建议
 */

const exchangeService = require('./exchange.service');
const indicatorsService = require('./indicators.service');

class SignalService {
    constructor() {
        // 策略权重配置
        this.strategyWeights = {
            ma: 0.25,        // 移动平均线策略
            rsi: 0.20,       // RSI策略
            macd: 0.20,      // MACD策略
            bollinger: 0.15, // 布林带策略
            kdj: 0.10,       // KDJ策略
            volume: 0.10     // 成交量策略
        };
    }

    /**
     * 生成综合交易信号
     * @param {string} symbol - 交易对
     * @param {string} timeframe - 时间周期
     * @param {string} exchange - 交易所
     * @returns {Object} 交易信号
     */
    async generateSignal(symbol = 'BTC/USDT', timeframe = '1h', exchange = 'gate') {
        try {
            // 获取K线数据
            const klines = await exchangeService.getKlines(symbol, timeframe, 100, exchange);
            
            if (klines.length < 50) {
                throw new Error('K线数据不足');
            }

            // 计算所有技术指标
            const indicators = indicatorsService.calculateAllIndicators(klines);
            
            // 当前价格
            const currentPrice = klines[klines.length - 1].close;
            
            // 执行各个策略
            const maSignal = this.maStrategy(indicators);
            const rsiSignal = this.rsiStrategy(indicators);
            const macdSignal = this.macdStrategy(indicators);
            const bollingerSignal = this.bollingerStrategy(indicators, currentPrice);
            const kdjSignal = this.kdjStrategy(indicators);
            const volumeSignal = this.volumeStrategy(klines);

            // 计算综合信号
            const combinedSignal = this.combineSignals({
                ma: maSignal,
                rsi: rsiSignal,
                macd: macdSignal,
                bollinger: bollingerSignal,
                kdj: kdjSignal,
                volume: volumeSignal
            });

            // 计算止损止盈
            const stopLoss = this.calculateStopLoss(currentPrice, indicators, combinedSignal.signal);
            const takeProfit = this.calculateTakeProfit(currentPrice, indicators, combinedSignal.signal);

            // 风险评估
            const risk = this.assessRisk(indicators, klines);

            return {
                symbol: symbol,
                exchange: exchange,
                timeframe: timeframe,
                signal: combinedSignal.signal,
                confidence: combinedSignal.confidence,
                price: currentPrice,
                stopLoss: stopLoss,
                takeProfit: takeProfit,
                risk: risk,
                indicators: {
                    ma5: indicators.ma5[indicators.ma5.length - 1],
                    ma20: indicators.ma20[indicators.ma20.length - 1],
                    ma50: indicators.ma50[indicators.ma50.length - 1],
                    rsi: indicators.rsi,
                    macd: indicators.macd,
                    bollingerBands: indicators.bollingerBands,
                    kdj: indicators.kdj,
                    atr: indicators.atr
                },
                strategies: {
                    ma: maSignal,
                    rsi: rsiSignal,
                    macd: macdSignal,
                    bollinger: bollingerSignal,
                    kdj: kdjSignal,
                    volume: volumeSignal
                },
                reasons: combinedSignal.reasons,
                timestamp: Date.now(),
                datetime: new Date().toISOString()
            };
        } catch (error) {
            console.error('❌ 生成信号失败:', error.message);
            throw error;
        }
    }

    /**
     * MA移动平均线策略
     */
    maStrategy(indicators) {
        const ma5 = indicators.ma5[indicators.ma5.length - 1];
        const ma20 = indicators.ma20[indicators.ma20.length - 1];
        const ma50 = indicators.ma50[indicators.ma50.length - 1];

        let signal = 'HOLD';
        let confidence = 0.5;
        let reason = '';

        // 金叉：短期均线上穿长期均线
        if (ma5 > ma20 && ma20 > ma50) {
            signal = 'BUY';
            confidence = 0.8;
            reason = 'MA金叉（5>20>50）';
        }
        // 死叉：短期均线下穿长期均线
        else if (ma5 < ma20 && ma20 < ma50) {
            signal = 'SELL';
            confidence = 0.8;
            reason = 'MA死叉（5<20<50）';
        }
        // 部分金叉
        else if (ma5 > ma20) {
            signal = 'BUY';
            confidence = 0.6;
            reason = 'MA5上穿MA20';
        }
        // 部分死叉
        else if (ma5 < ma20) {
            signal = 'SELL';
            confidence = 0.6;
            reason = 'MA5下穿MA20';
        }

        return { signal, confidence, reason };
    }

    /**
     * RSI策略
     */
    rsiStrategy(indicators) {
        const rsi = indicators.rsi;
        let signal = 'HOLD';
        let confidence = 0.5;
        let reason = '';

        if (rsi < 30) {
            signal = 'BUY';
            confidence = 0.85;
            reason = `RSI超卖（${rsi.toFixed(2)}）`;
        } else if (rsi < 40) {
            signal = 'BUY';
            confidence = 0.65;
            reason = `RSI偏低（${rsi.toFixed(2)}）`;
        } else if (rsi > 70) {
            signal = 'SELL';
            confidence = 0.85;
            reason = `RSI超买（${rsi.toFixed(2)}）`;
        } else if (rsi > 60) {
            signal = 'SELL';
            confidence = 0.65;
            reason = `RSI偏高（${rsi.toFixed(2)}）`;
        } else {
            reason = `RSI中性（${rsi.toFixed(2)}）`;
        }

        return { signal, confidence, reason };
    }

    /**
     * MACD策略
     */
    macdStrategy(indicators) {
        const { macd, signal: macdSignal, histogram } = indicators.macd;
        let signal = 'HOLD';
        let confidence = 0.5;
        let reason = '';

        // MACD金叉
        if (macd > macdSignal && histogram > 0) {
            signal = 'BUY';
            confidence = 0.75;
            reason = 'MACD金叉';
        }
        // MACD死叉
        else if (macd < macdSignal && histogram < 0) {
            signal = 'SELL';
            confidence = 0.75;
            reason = 'MACD死叉';
        }
        // MACD柱状图转正
        else if (histogram > 0) {
            signal = 'BUY';
            confidence = 0.6;
            reason = 'MACD柱状图为正';
        }
        // MACD柱状图转负
        else if (histogram < 0) {
            signal = 'SELL';
            confidence = 0.6;
            reason = 'MACD柱状图为负';
        }

        return { signal, confidence, reason };
    }

    /**
     * 布林带策略
     */
    bollingerStrategy(indicators, currentPrice) {
        const { upper, middle, lower } = indicators.bollingerBands;
        let signal = 'HOLD';
        let confidence = 0.5;
        let reason = '';

        const upperDist = (upper - currentPrice) / currentPrice;
        const lowerDist = (currentPrice - lower) / currentPrice;

        // 价格接近下轨
        if (currentPrice <= lower) {
            signal = 'BUY';
            confidence = 0.8;
            reason = '价格触及布林带下轨';
        } else if (lowerDist < 0.01) {
            signal = 'BUY';
            confidence = 0.65;
            reason = '价格接近布林带下轨';
        }
        // 价格接近上轨
        else if (currentPrice >= upper) {
            signal = 'SELL';
            confidence = 0.8;
            reason = '价格触及布林带上轨';
        } else if (upperDist < 0.01) {
            signal = 'SELL';
            confidence = 0.65;
            reason = '价格接近布林带上轨';
        }
        // 价格在中轨附近
        else {
            reason = '价格在布林带中轨附近';
        }

        return { signal, confidence, reason };
    }

    /**
     * KDJ策略
     */
    kdjStrategy(indicators) {
        const { k, d, j } = indicators.kdj;
        let signal = 'HOLD';
        let confidence = 0.5;
        let reason = '';

        // KDJ超卖
        if (k < 20 && d < 20) {
            signal = 'BUY';
            confidence = 0.75;
            reason = `KDJ超卖（K:${k.toFixed(1)}, D:${d.toFixed(1)}）`;
        }
        // KDJ超买
        else if (k > 80 && d > 80) {
            signal = 'SELL';
            confidence = 0.75;
            reason = `KDJ超买（K:${k.toFixed(1)}, D:${d.toFixed(1)}）`;
        }
        // KDJ金叉
        else if (k > d && k < 50) {
            signal = 'BUY';
            confidence = 0.65;
            reason = 'KDJ金叉';
        }
        // KDJ死叉
        else if (k < d && k > 50) {
            signal = 'SELL';
            confidence = 0.65;
            reason = 'KDJ死叉';
        }

        return { signal, confidence, reason };
    }

    /**
     * 成交量策略
     */
    volumeStrategy(klines) {
        const volumes = klines.map(k => k.volume);
        const recentVolumes = volumes.slice(-10);
        const avgVolume = recentVolumes.reduce((a, b) => a + b, 0) / recentVolumes.length;
        const currentVolume = volumes[volumes.length - 1];
        const prevClose = klines[klines.length - 2].close;
        const currentClose = klines[klines.length - 1].close;

        let signal = 'HOLD';
        let confidence = 0.5;
        let reason = '';

        const volumeRatio = currentVolume / avgVolume;

        // 放量上涨
        if (currentClose > prevClose && volumeRatio > 1.5) {
            signal = 'BUY';
            confidence = 0.7;
            reason = `放量上涨（量比${volumeRatio.toFixed(2)}）`;
        }
        // 放量下跌
        else if (currentClose < prevClose && volumeRatio > 1.5) {
            signal = 'SELL';
            confidence = 0.7;
            reason = `放量下跌（量比${volumeRatio.toFixed(2)}）`;
        }
        // 缩量
        else if (volumeRatio < 0.7) {
            reason = `缩量（量比${volumeRatio.toFixed(2)}）`;
        }

        return { signal, confidence, reason };
    }

    /**
     * 组合多个策略信号
     */
    combineSignals(signals) {
        let buyScore = 0;
        let sellScore = 0;
        const reasons = [];

        for (const [strategy, result] of Object.entries(signals)) {
            const weight = this.strategyWeights[strategy] || 0.1;
            
            if (result.signal === 'BUY') {
                buyScore += result.confidence * weight;
                reasons.push(`✅ ${result.reason}`);
            } else if (result.signal === 'SELL') {
                sellScore += result.confidence * weight;
                reasons.push(`❌ ${result.reason}`);
            } else {
                reasons.push(`➖ ${result.reason}`);
            }
        }

        let finalSignal = 'HOLD';
        let confidence = 0.5;

        if (buyScore > sellScore && buyScore > 0.5) {
            finalSignal = 'BUY';
            confidence = Math.min(buyScore, 0.95);
        } else if (sellScore > buyScore && sellScore > 0.5) {
            finalSignal = 'SELL';
            confidence = Math.min(sellScore, 0.95);
        }

        return {
            signal: finalSignal,
            confidence: confidence,
            buyScore: buyScore,
            sellScore: sellScore,
            reasons: reasons
        };
    }

    /**
     * 计算止损价格
     */
    calculateStopLoss(currentPrice, indicators, signal) {
        const atr = indicators.atr;
        const stopLossMultiplier = 2; // ATR倍数

        if (signal === 'BUY') {
            return currentPrice - (atr * stopLossMultiplier);
        } else if (signal === 'SELL') {
            return currentPrice + (atr * stopLossMultiplier);
        }
        return null;
    }

    /**
     * 计算止盈价格
     */
    calculateTakeProfit(currentPrice, indicators, signal) {
        const atr = indicators.atr;
        const takeProfitMultiplier = 3; // ATR倍数

        if (signal === 'BUY') {
            return currentPrice + (atr * takeProfitMultiplier);
        } else if (signal === 'SELL') {
            return currentPrice - (atr * takeProfitMultiplier);
        }
        return null;
    }

    /**
     * 风险评估
     */
    assessRisk(indicators, klines) {
        const atr = indicators.atr;
        const currentPrice = klines[klines.length - 1].close;
        const volatility = (atr / currentPrice) * 100;

        let riskLevel = 'MEDIUM';
        let riskScore = 50;

        if (volatility < 1) {
            riskLevel = 'LOW';
            riskScore = 30;
        } else if (volatility > 3) {
            riskLevel = 'HIGH';
            riskScore = 80;
        }

        return {
            level: riskLevel,
            score: riskScore,
            volatility: volatility.toFixed(2) + '%',
            atr: atr
        };
    }

    /**
     * 批量生成信号
     */
    async generateMultipleSignals(symbols, timeframe = '1h', exchange = 'gate') {
        const promises = symbols.map(symbol =>
            this.generateSignal(symbol, timeframe, exchange).catch(err => ({
                symbol,
                error: err.message
            }))
        );
        return await Promise.all(promises);
    }
}

module.exports = new SignalService();

