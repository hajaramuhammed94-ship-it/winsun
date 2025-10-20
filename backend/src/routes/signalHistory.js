const express = require('express');
const router = express.Router();
const signalHistoryService = require('../services/signalHistory.service');
const { authenticateToken } = require('../middleware/auth');

/**
 * @route   GET /api/signal-history
 * @desc    获取信号历史记录
 * @access  Private
 */
router.get('/', authenticateToken, async (req, res) => {
    try {
        const {
            symbol,
            exchange,
            signal,
            startDate,
            endDate,
            limit = 100,
            offset = 0
        } = req.query;

        const options = {
            symbol,
            exchange,
            signal,
            startDate,
            endDate,
            limit: parseInt(limit),
            offset: parseInt(offset)
        };

        const history = await signalHistoryService.getSignalHistory(options);

        res.json({
            success: true,
            data: {
                signals: history,
                count: history.length,
                limit: parseInt(limit),
                offset: parseInt(offset)
            }
        });
    } catch (error) {
        console.error('获取信号历史失败:', error);
        res.status(500).json({
            success: false,
            message: '获取信号历史失败',
            error: error.message
        });
    }
});

/**
 * @route   GET /api/signal-history/statistics
 * @desc    获取信号统计数据
 * @access  Private
 */
router.get('/statistics', authenticateToken, async (req, res) => {
    try {
        const {
            symbol,
            exchange,
            startDate,
            endDate,
            groupBy = 'day'
        } = req.query;

        const options = {
            symbol,
            exchange,
            startDate,
            endDate,
            groupBy
        };

        const statistics = await signalHistoryService.getSignalStatistics(options);

        res.json({
            success: true,
            data: statistics
        });
    } catch (error) {
        console.error('获取信号统计失败:', error);
        res.status(500).json({
            success: false,
            message: '获取信号统计失败',
            error: error.message
        });
    }
});

/**
 * @route   GET /api/signal-history/accuracy
 * @desc    获取信号准确率统计
 * @access  Private
 */
router.get('/accuracy', authenticateToken, async (req, res) => {
    try {
        const {
            symbol,
            exchange,
            startDate,
            endDate
        } = req.query;

        const options = {
            symbol,
            exchange,
            startDate,
            endDate
        };

        const accuracy = await signalHistoryService.getAccuracyStatistics(options);

        res.json({
            success: true,
            data: accuracy
        });
    } catch (error) {
        console.error('获取准确率统计失败:', error);
        res.status(500).json({
            success: false,
            message: '获取准确率统计失败',
            error: error.message
        });
    }
});

/**
 * @route   POST /api/signal-history/result
 * @desc    记录信号执行结果
 * @access  Private
 */
router.post('/result', authenticateToken, async (req, res) => {
    try {
        const {
            signalId,
            entryPrice,
            exitPrice,
            exitTime,
            result,
            hitStopLoss,
            hitTakeProfit
        } = req.body;

        if (!signalId || !entryPrice) {
            return res.status(400).json({
                success: false,
                message: '缺少必要参数: signalId, entryPrice'
            });
        }

        const resultData = {
            entryPrice,
            exitPrice,
            exitTime,
            result,
            hitStopLoss,
            hitTakeProfit
        };

        const savedResult = await signalHistoryService.recordSignalResult(signalId, resultData);

        res.json({
            success: true,
            data: savedResult,
            message: '信号结果已记录'
        });
    } catch (error) {
        console.error('记录信号结果失败:', error);
        res.status(500).json({
            success: false,
            message: '记录信号结果失败',
            error: error.message
        });
    }
});

/**
 * @route   GET /api/signal-history/dashboard
 * @desc    获取仪表板数据（综合统计）
 * @access  Private
 */
router.get('/dashboard', authenticateToken, async (req, res) => {
    try {
        const { days = 7 } = req.query;
        
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(days));

        // 获取最近的信号历史
        const recentSignals = await signalHistoryService.getSignalHistory({
            startDate: startDate.toISOString(),
            limit: 50
        });

        // 获取统计数据
        const statistics = await signalHistoryService.getSignalStatistics({
            startDate: startDate.toISOString(),
            groupBy: 'day'
        });

        // 获取准确率数据
        const accuracy = await signalHistoryService.getAccuracyStatistics({
            startDate: startDate.toISOString()
        });

        // 计算总体统计
        const totalSignals = recentSignals.length;
        const buySignals = recentSignals.filter(s => s.signal === 'BUY').length;
        const sellSignals = recentSignals.filter(s => s.signal === 'SELL').length;
        const holdSignals = recentSignals.filter(s => s.signal === 'HOLD').length;
        
        const avgConfidence = recentSignals.length > 0
            ? recentSignals.reduce((sum, s) => sum + parseFloat(s.confidence), 0) / recentSignals.length
            : 0;

        res.json({
            success: true,
            data: {
                overview: {
                    totalSignals,
                    buySignals,
                    sellSignals,
                    holdSignals,
                    avgConfidence: avgConfidence.toFixed(2)
                },
                recentSignals: recentSignals.slice(0, 10),
                statistics,
                accuracy
            }
        });
    } catch (error) {
        console.error('获取仪表板数据失败:', error);
        res.status(500).json({
            success: false,
            message: '获取仪表板数据失败',
            error: error.message
        });
    }
});

module.exports = router;

