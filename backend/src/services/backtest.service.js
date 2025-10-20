/**
 * 回测系统服务
 * 用于验证交易策略的有效性
 * 提供历史数据回测、收益率统计、风险分析
 */

const exchangeService = require('./exchange.service');
const signalService = require('./signal.service');

class BacktestService {
    constructor() {
        this.initialCapital = 10000; // 初始资金（USDT）
        this.tradingFee = 0.001; // 交易手续费 0.1%
    }

    /**
     * 执行回测
     * @param {string} symbol - 交易对
     * @param {string} timeframe - 时间周期
     * @param {number} days - 回测天数
     * @param {string} exchange - 交易所
     * @returns {Object} 回测结果
     */
    async runBacktest(symbol = 'BTC/USDT', timeframe = '1h', days = 30, exchange = 'binance') {
        try {
            console.log(`🔄 开始回测: ${symbol} (${timeframe}, ${days}天)`);
            
            // 计算需要的K线数量
            const periodsPerDay = this.getPeriodsPerDay(timeframe);
            const limit = Math.min(days * periodsPerDay, 1000); // 最多1000条
            
            // 获取历史K线数据
            const klines = await exchangeService.getKlines(symbol, timeframe, limit, exchange);
            
            if (klines.length < 100) {
                throw new Error('历史数据不足，至少需要100条K线');
            }

            console.log(`✅ 获取到 ${klines.length} 条历史K线数据`);

            // 初始化回测状态
            const backtestState = {
                capital: this.initialCapital,
                position: 0, // 持仓数量
                positionValue: 0, // 持仓价值
                trades: [],
                currentTrade: null,
                equity: [] // 权益曲线
            };

            // 遍历K线，生成信号并模拟交易
            for (let i = 100; i < klines.length; i++) {
                const historicalKlines = klines.slice(0, i + 1);
                const currentPrice = historicalKlines[i].close;
                
                // 生成信号（使用历史数据）
                const signal = await this.generateHistoricalSignal(
                    historicalKlines,
                    symbol,
                    timeframe,
                    exchange
                );

                // 执行交易逻辑
                this.executeTradeLogic(backtestState, signal, currentPrice, historicalKlines[i].datetime);

                // 记录权益
                const totalEquity = backtestState.capital + backtestState.positionValue;
                backtestState.equity.push({
                    datetime: historicalKlines[i].datetime,
                    equity: totalEquity,
                    capital: backtestState.capital,
                    positionValue: backtestState.positionValue
                });
            }

            // 如果还有持仓，平仓
            if (backtestState.position > 0) {
                const finalPrice = klines[klines.length - 1].close;
                this.closePosition(backtestState, finalPrice, klines[klines.length - 1].datetime, 'BACKTEST_END');
            }

            // 计算统计指标
            const statistics = this.calculateStatistics(backtestState, klines);

            console.log(`✅ 回测完成: 总收益率 ${statistics.totalReturn.toFixed(2)}%`);

            return {
                symbol: symbol,
                timeframe: timeframe,
                days: days,
                exchange: exchange,
                initialCapital: this.initialCapital,
                finalCapital: backtestState.capital + backtestState.positionValue,
                trades: backtestState.trades,
                equity: backtestState.equity,
                statistics: statistics
            };

        } catch (error) {
            console.error('❌ 回测失败:', error.message);
            throw error;
        }
    }

    /**
     * 生成历史信号（使用历史数据）
     */
    async generateHistoricalSignal(klines, symbol, timeframe, exchange) {
        try {
            // 使用signalService的逻辑，但传入历史K线
            const indicatorsService = require('./indicators.service');
            const indicators = indicatorsService.calculateAllIndicators(klines);
            const currentPrice = klines[klines.length - 1].close;

            // 简化的信号生成（复用signalService的策略）
            const maSignal = this.evaluateMAStrategy(indicators);
            const rsiSignal = this.evaluateRSIStrategy(indicators);
            const macdSignal = this.evaluateMACDStrategy(indicators);

            // 综合判断
            let signal = 'HOLD';
            let confidence = 0.5;

            const buySignals = [maSignal, rsiSignal, macdSignal].filter(s => s === 'BUY').length;
            const sellSignals = [maSignal, rsiSignal, macdSignal].filter(s => s === 'SELL').length;

            if (buySignals >= 2) {
                signal = 'BUY';
                confidence = 0.7 + (buySignals * 0.1);
            } else if (sellSignals >= 2) {
                signal = 'SELL';
                confidence = 0.7 + (sellSignals * 0.1);
            }

            return { signal, confidence, price: currentPrice };
        } catch (error) {
            return { signal: 'HOLD', confidence: 0.5, price: klines[klines.length - 1].close };
        }
    }

    /**
     * MA策略评估
     */
    evaluateMAStrategy(indicators) {
        const ma5 = indicators.ma5[indicators.ma5.length - 1];
        const ma20 = indicators.ma20[indicators.ma20.length - 1];
        
        if (ma5 > ma20) return 'BUY';
        if (ma5 < ma20) return 'SELL';
        return 'HOLD';
    }

    /**
     * RSI策略评估
     */
    evaluateRSIStrategy(indicators) {
        const rsi = indicators.rsi;
        
        if (rsi < 30) return 'BUY';
        if (rsi > 70) return 'SELL';
        return 'HOLD';
    }

    /**
     * MACD策略评估
     */
    evaluateMACDStrategy(indicators) {
        const { macd, signal, histogram } = indicators.macd;
        
        if (macd > signal && histogram > 0) return 'BUY';
        if (macd < signal && histogram < 0) return 'SELL';
        return 'HOLD';
    }

    /**
     * 执行交易逻辑
     */
    executeTradeLogic(state, signal, currentPrice, datetime) {
        // 如果没有持仓且信号为买入
        if (state.position === 0 && signal.signal === 'BUY' && signal.confidence > 0.6) {
            this.openPosition(state, currentPrice, datetime, signal);
        }
        // 如果有持仓且信号为卖出
        else if (state.position > 0 && signal.signal === 'SELL' && signal.confidence > 0.6) {
            this.closePosition(state, currentPrice, datetime, signal);
        }
        // 更新持仓价值
        else if (state.position > 0) {
            state.positionValue = state.position * currentPrice;
        }
    }

    /**
     * 开仓
     */
    openPosition(state, price, datetime, signal) {
        const investAmount = state.capital * 0.95; // 使用95%的资金
        const fee = investAmount * this.tradingFee;
        const quantity = (investAmount - fee) / price;

        state.position = quantity;
        state.positionValue = quantity * price;
        state.capital -= investAmount;

        state.currentTrade = {
            type: 'BUY',
            entryPrice: price,
            entryTime: datetime,
            quantity: quantity,
            fee: fee,
            confidence: signal.confidence
        };

        console.log(`  📈 开仓: ${price.toFixed(2)} USDT, 数量: ${quantity.toFixed(6)}`);
    }

    /**
     * 平仓
     */
    closePosition(state, price, datetime, signal) {
        const sellAmount = state.position * price;
        const fee = sellAmount * this.tradingFee;
        const netAmount = sellAmount - fee;

        state.capital += netAmount;

        const trade = {
            ...state.currentTrade,
            exitPrice: price,
            exitTime: datetime,
            exitFee: fee,
            profit: netAmount - (state.currentTrade.quantity * state.currentTrade.entryPrice),
            profitPercent: ((price - state.currentTrade.entryPrice) / state.currentTrade.entryPrice) * 100,
            duration: new Date(datetime) - new Date(state.currentTrade.entryTime),
            exitConfidence: typeof signal === 'object' ? signal.confidence : 0.5
        };

        state.trades.push(trade);
        state.position = 0;
        state.positionValue = 0;
        state.currentTrade = null;

        console.log(`  📉 平仓: ${price.toFixed(2)} USDT, 盈亏: ${trade.profit.toFixed(2)} USDT (${trade.profitPercent.toFixed(2)}%)`);
    }

    /**
     * 计算统计指标
     */
    calculateStatistics(state, klines) {
        const finalEquity = state.capital + state.positionValue;
        const totalReturn = ((finalEquity - this.initialCapital) / this.initialCapital) * 100;

        const winningTrades = state.trades.filter(t => t.profit > 0);
        const losingTrades = state.trades.filter(t => t.profit <= 0);

        const winRate = state.trades.length > 0 
            ? (winningTrades.length / state.trades.length) * 100 
            : 0;

        const avgProfit = winningTrades.length > 0
            ? winningTrades.reduce((sum, t) => sum + t.profit, 0) / winningTrades.length
            : 0;

        const avgLoss = losingTrades.length > 0
            ? losingTrades.reduce((sum, t) => sum + t.profit, 0) / losingTrades.length
            : 0;

        const profitFactor = Math.abs(avgLoss) > 0 ? avgProfit / Math.abs(avgLoss) : 0;

        // 计算最大回撤
        const maxDrawdown = this.calculateMaxDrawdown(state.equity);

        // 计算夏普比率（简化版）
        const returns = state.trades.map(t => t.profitPercent);
        const sharpeRatio = this.calculateSharpeRatio(returns);

        return {
            totalReturn: totalReturn,
            totalTrades: state.trades.length,
            winningTrades: winningTrades.length,
            losingTrades: losingTrades.length,
            winRate: winRate,
            avgProfit: avgProfit,
            avgLoss: avgLoss,
            profitFactor: profitFactor,
            maxDrawdown: maxDrawdown,
            sharpeRatio: sharpeRatio,
            finalEquity: finalEquity
        };
    }

    /**
     * 计算最大回撤
     */
    calculateMaxDrawdown(equity) {
        let maxDrawdown = 0;
        let peak = equity[0].equity;

        for (const point of equity) {
            if (point.equity > peak) {
                peak = point.equity;
            }
            const drawdown = ((peak - point.equity) / peak) * 100;
            if (drawdown > maxDrawdown) {
                maxDrawdown = drawdown;
            }
        }

        return maxDrawdown;
    }

    /**
     * 计算夏普比率
     */
    calculateSharpeRatio(returns) {
        if (returns.length === 0) return 0;

        const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
        const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
        const stdDev = Math.sqrt(variance);

        return stdDev > 0 ? avgReturn / stdDev : 0;
    }

    /**
     * 获取每天的周期数
     */
    getPeriodsPerDay(timeframe) {
        const periods = {
            '1m': 1440,
            '5m': 288,
            '15m': 96,
            '1h': 24,
            '4h': 6,
            '1d': 1
        };
        return periods[timeframe] || 24;
    }
}

module.exports = new BacktestService();

