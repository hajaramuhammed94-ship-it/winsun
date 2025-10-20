/**
 * 市场数据API路由
 * 提供实时价格、K线、订单簿等数据
 */

const express = require('express');
const router = express.Router();
const exchangeService = require('../services/exchange.service');

/**
 * GET /api/market/price/:symbol
 * 获取实时价格
 * 参数: symbol (BTC-USDT), exchange (binance)
 */
router.get('/price/:symbol', async (req, res) => {
    try {
        const { symbol } = req.params;
        const { exchange = 'gate' } = req.query;
        
        const price = await exchangeService.getPrice(
            symbol.replace('-', '/'), 
            exchange
        );
        
        res.json({
            success: true,
            data: price
        });
    } catch (error) {
        console.error('获取价格失败:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * GET /api/market/klines/:symbol
 * 获取K线数据
 * 参数: symbol, timeframe (1h), limit (100), exchange (binance)
 */
router.get('/klines/:symbol', async (req, res) => {
    try {
        const { symbol } = req.params;
        const {
            timeframe = '1h',
            limit = 100,
            exchange = 'gate'
        } = req.query;
        
        const klines = await exchangeService.getKlines(
            symbol.replace('-', '/'),
            timeframe,
            parseInt(limit),
            exchange
        );
        
        res.json({
            success: true,
            data: klines
        });
    } catch (error) {
        console.error('获取K线失败:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * GET /api/market/orderbook/:symbol
 * 获取订单簿
 * 参数: symbol, limit (20), exchange (binance)
 */
router.get('/orderbook/:symbol', async (req, res) => {
    try {
        const { symbol } = req.params;
        const { limit = 20, exchange = 'gate' } = req.query;
        
        const orderbook = await exchangeService.getOrderBook(
            symbol.replace('-', '/'),
            parseInt(limit),
            exchange
        );
        
        res.json({
            success: true,
            data: orderbook
        });
    } catch (error) {
        console.error('获取订单簿失败:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * POST /api/market/prices
 * 批量获取价格
 * Body: { symbols: ['BTC/USDT', 'ETH/USDT'], exchange: 'binance' }
 */
router.post('/prices', async (req, res) => {
    try {
        const { symbols, exchange = 'gate' } = req.body;
        
        if (!symbols || !Array.isArray(symbols)) {
            return res.status(400).json({
                success: false,
                message: '请提供symbols数组'
            });
        }
        
        const prices = await exchangeService.getMultiplePrices(symbols, exchange);
        
        res.json({
            success: true,
            data: prices
        });
    } catch (error) {
        console.error('批量获取价格失败:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * GET /api/market/markets
 * 获取支持的市场列表
 * 参数: exchange (binance)
 */
router.get('/markets', async (req, res) => {
    try {
        const { exchange = 'gate' } = req.query;

        const markets = await exchangeService.getMarkets(exchange);
        
        res.json({
            success: true,
            data: markets
        });
    } catch (error) {
        console.error('获取市场列表失败:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * GET /api/market/stats/:symbol
 * 获取24小时统计
 * 参数: symbol, exchange (binance)
 */
router.get('/stats/:symbol', async (req, res) => {
    try {
        const { symbol } = req.params;
        const { exchange = 'gate' } = req.query;

        const stats = await exchangeService.get24hStats(
            symbol.replace('-', '/'),
            exchange
        );
        
        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('获取24h统计失败:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * GET /api/market/cache/stats
 * 获取缓存统计
 */
router.get('/cache/stats', (req, res) => {
    try {
        const stats = exchangeService.getCacheStats();
        
        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('获取缓存统计失败:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * POST /api/market/cache/clear
 * 清除缓存
 */
router.post('/cache/clear', (req, res) => {
    try {
        exchangeService.clearCache();
        
        res.json({
            success: true,
            message: '缓存已清除'
        });
    } catch (error) {
        console.error('清除缓存失败:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;

