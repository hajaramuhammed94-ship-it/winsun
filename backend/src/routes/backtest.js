/**
 * 回测API路由
 * 提供策略回测服务
 */

const express = require('express');
const router = express.Router();
const backtestService = require('../services/backtest.service');
const { authenticateToken } = require('../middleware/auth');

/**
 * POST /api/backtest/run
 * 运行回测
 * Body: { symbol, timeframe, days, exchange }
 * 需要认证
 */
router.post('/run', authenticateToken, async (req, res) => {
    try {
        const {
            symbol = 'BTC/USDT',
            timeframe = '1h',
            days = 30,
            exchange = 'gate'
        } = req.body;

        console.log(`📊 开始回测: ${symbol}, ${timeframe}, ${days}天`);

        const result = await backtestService.runBacktest(
            symbol,
            timeframe,
            parseInt(days),
            exchange
        );

        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('回测失败:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;

