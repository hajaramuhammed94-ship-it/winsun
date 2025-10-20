/**
 * 交易信号API路由
 * 提供高级交易信号生成服务
 */

const express = require('express');
const router = express.Router();
const signalService = require('../services/signal.service');
const { authenticateToken } = require('../middleware/auth');

/**
 * GET /api/signals/generate/:symbol
 * 生成单个交易对的实时信号
 * 参数: symbol (BTC-USDT), timeframe (1h), exchange (binance)
 * 需要认证
 */
router.get('/generate/:symbol', authenticateToken, async (req, res) => {
  try {
    const { symbol } = req.params;
    const { timeframe = '1h', exchange = 'gate' } = req.query;

    const signal = await signalService.generateSignal(
      symbol.replace('-', '/'),
      timeframe,
      exchange
    );

    res.json({
      success: true,
      data: signal
    });
  } catch (error) {
    console.error('生成信号失败:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * POST /api/signals/batch
 * 批量生成信号
 * Body: { symbols: ['BTC/USDT', 'ETH/USDT'], timeframe: '1h', exchange: 'binance' }
 * 需要认证
 */
router.post('/batch', authenticateToken, async (req, res) => {
  try {
    const { symbols, timeframe = '1h', exchange = 'gate' } = req.body;

    if (!symbols || !Array.isArray(symbols)) {
      return res.status(400).json({
        success: false,
        message: '请提供symbols数组'
      });
    }

    const signals = await signalService.generateMultipleSignals(
      symbols,
      timeframe,
      exchange
    );

    res.json({
      success: true,
      data: signals
    });
  } catch (error) {
    console.error('批量生成信号失败:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;

