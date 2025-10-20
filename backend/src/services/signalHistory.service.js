const db = require('../../config/database-mock');

class SignalHistoryService {
    constructor() {
        this.nextId = 1;
    }

    /**
     * 保存信号到历史记录
     */
    async saveSignal(signalData) {
        try {
            const {
                symbol,
                exchange = 'gate',
                timeframe = '1h',
                signal,
                confidence,
                price,
                stopLoss,
                takeProfit,
                riskLevel,
                indicators,
                reasons
            } = signalData;

            const query = `
                INSERT INTO signal_history (
                    symbol, exchange, timeframe, signal, confidence, price,
                    stop_loss, take_profit, risk_level, indicators, reasons
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                RETURNING *
            `;

            const values = [
                symbol,
                exchange,
                timeframe,
                signal,
                confidence,
                price,
                stopLoss,
                takeProfit,
                riskLevel,
                JSON.stringify(indicators),
                reasons
            ];

            const result = await db.query(query, values);
            console.log(`✅ 信号已保存: ${symbol} ${signal} (置信度: ${confidence}%)`);
            return result.rows[0];
        } catch (error) {
            console.error('❌ 保存信号失败:', error.message);
            throw error;
        }
    }

    /**
     * 批量保存信号
     */
    async saveMultipleSignals(signalsArray) {
        try {
            const savedSignals = [];
            for (const signalData of signalsArray) {
                const saved = await this.saveSignal(signalData);
                savedSignals.push(saved);
            }
            return savedSignals;
        } catch (error) {
            console.error('❌ 批量保存信号失败:', error.message);
            throw error;
        }
    }

    /**
     * 获取信号历史记录
     */
    async getSignalHistory(options = {}) {
        try {
            const {
                symbol,
                exchange,
                signal,
                startDate,
                endDate,
                limit = 100,
                offset = 0
            } = options;

            let query = 'SELECT * FROM signal_history WHERE 1=1';
            const values = [];
            let paramIndex = 1;

            if (symbol) {
                query += ` AND symbol = $${paramIndex}`;
                values.push(symbol);
                paramIndex++;
            }

            if (exchange) {
                query += ` AND exchange = $${paramIndex}`;
                values.push(exchange);
                paramIndex++;
            }

            if (signal) {
                query += ` AND signal = $${paramIndex}`;
                values.push(signal);
                paramIndex++;
            }

            if (startDate) {
                query += ` AND created_at >= $${paramIndex}`;
                values.push(startDate);
                paramIndex++;
            }

            if (endDate) {
                query += ` AND created_at <= $${paramIndex}`;
                values.push(endDate);
                paramIndex++;
            }

            query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
            values.push(limit, offset);

            const result = await db.query(query, values);
            return result.rows;
        } catch (error) {
            console.error('❌ 获取信号历史失败:', error.message);
            throw error;
        }
    }

    /**
     * 获取信号统计数据
     */
    async getSignalStatistics(options = {}) {
        try {
            const {
                symbol,
                exchange,
                startDate,
                endDate,
                groupBy = 'day' // day, week, month
            } = options;

            let query = `
                SELECT 
                    DATE_TRUNC('${groupBy}', created_at) as period,
                    COUNT(*) as total_signals,
                    COUNT(CASE WHEN signal = 'BUY' THEN 1 END) as buy_signals,
                    COUNT(CASE WHEN signal = 'SELL' THEN 1 END) as sell_signals,
                    COUNT(CASE WHEN signal = 'HOLD' THEN 1 END) as hold_signals,
                    AVG(confidence) as avg_confidence,
                    MIN(confidence) as min_confidence,
                    MAX(confidence) as max_confidence
                FROM signal_history
                WHERE 1=1
            `;

            const values = [];
            let paramIndex = 1;

            if (symbol) {
                query += ` AND symbol = $${paramIndex}`;
                values.push(symbol);
                paramIndex++;
            }

            if (exchange) {
                query += ` AND exchange = $${paramIndex}`;
                values.push(exchange);
                paramIndex++;
            }

            if (startDate) {
                query += ` AND created_at >= $${paramIndex}`;
                values.push(startDate);
                paramIndex++;
            }

            if (endDate) {
                query += ` AND created_at <= $${paramIndex}`;
                values.push(endDate);
                paramIndex++;
            }

            query += ' GROUP BY period ORDER BY period DESC';

            const result = await db.query(query, values);
            return result.rows;
        } catch (error) {
            console.error('❌ 获取信号统计失败:', error.message);
            throw error;
        }
    }

    /**
     * 获取信号准确率统计
     */
    async getAccuracyStatistics(options = {}) {
        try {
            const {
                symbol,
                exchange,
                startDate,
                endDate
            } = options;

            let query = `
                SELECT 
                    sh.symbol,
                    sh.exchange,
                    COUNT(sr.id) as total_executed,
                    COUNT(CASE WHEN sr.result = 'SUCCESS' THEN 1 END) as successful,
                    COUNT(CASE WHEN sr.result = 'FAILED' THEN 1 END) as failed,
                    ROUND(
                        COUNT(CASE WHEN sr.result = 'SUCCESS' THEN 1 END)::NUMERIC / 
                        NULLIF(COUNT(sr.id), 0) * 100, 
                        2
                    ) as accuracy_rate,
                    AVG(sr.profit_loss_percent) as avg_profit_loss_percent,
                    SUM(sr.profit_loss) as total_profit_loss
                FROM signal_history sh
                LEFT JOIN signal_results sr ON sh.id = sr.signal_id
                WHERE sr.result IS NOT NULL
            `;

            const values = [];
            let paramIndex = 1;

            if (symbol) {
                query += ` AND sh.symbol = $${paramIndex}`;
                values.push(symbol);
                paramIndex++;
            }

            if (exchange) {
                query += ` AND sh.exchange = $${paramIndex}`;
                values.push(exchange);
                paramIndex++;
            }

            if (startDate) {
                query += ` AND sh.created_at >= $${paramIndex}`;
                values.push(startDate);
                paramIndex++;
            }

            if (endDate) {
                query += ` AND sh.created_at <= $${paramIndex}`;
                values.push(endDate);
                paramIndex++;
            }

            query += ' GROUP BY sh.symbol, sh.exchange ORDER BY accuracy_rate DESC';

            const result = await db.query(query, values);
            return result.rows;
        } catch (error) {
            console.error('❌ 获取准确率统计失败:', error.message);
            throw error;
        }
    }

    /**
     * 记录信号执行结果
     */
    async recordSignalResult(signalId, resultData) {
        try {
            const {
                entryPrice,
                exitPrice,
                exitTime,
                result,
                hitStopLoss = false,
                hitTakeProfit = false
            } = resultData;

            // 计算盈亏
            const profitLoss = exitPrice - entryPrice;
            const profitLossPercent = ((exitPrice - entryPrice) / entryPrice) * 100;

            const query = `
                INSERT INTO signal_results (
                    signal_id, entry_price, exit_price, exit_time,
                    profit_loss, profit_loss_percent, result,
                    hit_stop_loss, hit_take_profit
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                RETURNING *
            `;

            const values = [
                signalId,
                entryPrice,
                exitPrice,
                exitTime,
                profitLoss,
                profitLossPercent,
                result,
                hitStopLoss,
                hitTakeProfit
            ];

            const queryResult = await db.query(query, values);
            console.log(`✅ 信号结果已记录: ${result} (盈亏: ${profitLossPercent.toFixed(2)}%)`);
            return queryResult.rows[0];
        } catch (error) {
            console.error('❌ 记录信号结果失败:', error.message);
            throw error;
        }
    }
}

module.exports = new SignalHistoryService();

