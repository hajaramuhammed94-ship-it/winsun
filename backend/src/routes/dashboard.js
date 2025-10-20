const express = require('express');
const router = express.Router();
const db = require('../../config/database-mock');
const jwt = require('jsonwebtoken');

// JWT验证中间件
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: '未提供认证令牌' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'winsun-secret-key-2024', (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, message: '令牌无效或已过期' });
        }
        req.user = user;
        next();
    });
};

// 获取用户订阅码列表
router.get('/subscriptions', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        
        // 查询用户的订阅码
        const result = await db.query(
            'SELECT * FROM subscriptions WHERE user_id = $1 ORDER BY created_at DESC',
            [userId]
        );
        
        res.json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error('获取订阅码列表失败:', error);
        res.status(500).json({
            success: false,
            message: '获取订阅码列表失败'
        });
    }
});

// 领取免费订阅码
router.post('/claim-free-code', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { exchange_uid, exchange } = req.body;
        
        if (!exchange_uid || !exchange) {
            return res.status(400).json({
                success: false,
                message: '请提供交易所UID和交易所名称'
            });
        }
        
        // 检查用户是否已经领取过免费订阅码
        const existingResult = await db.query(
            'SELECT * FROM subscriptions WHERE user_id = $1 AND plan_type = $2',
            [userId, 'free']
        );
        
        if (existingResult.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: '您已经领取过免费订阅码'
            });
        }
        
        // 生成订阅码
        const subcode = 'FREE-' + Math.random().toString(36).substring(2, 15).toUpperCase();
        
        // 创建订阅码记录
        const result = await db.query(
            `INSERT INTO subscriptions 
            (user_id, subcode, plan_type, status, exchange, exchange_uid, start_date, end_date) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
            RETURNING *`,
            [userId, subcode, 'free', 'active', exchange, exchange_uid, new Date().toISOString().split('T')[0], '永久']
        );
        
        res.json({
            success: true,
            data: result.rows[0],
            message: '免费订阅码领取成功'
        });
    } catch (error) {
        console.error('领取免费订阅码失败:', error);
        res.status(500).json({
            success: false,
            message: '领取免费订阅码失败'
        });
    }
});

// 获取订阅码详情
router.get('/subscriptions/:subcode', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { subcode } = req.params;

        const result = await db.query(
            'SELECT * FROM subscriptions WHERE user_id = $1 AND subcode = $2',
            [userId, subcode]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: '订阅码不存在'
            });
        }

        res.json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error('获取订阅码详情失败:', error);
        res.status(500).json({
            success: false,
            message: '获取订阅码详情失败'
        });
    }
});

// 购买订阅码
router.post('/purchase-subscription', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { plan_type, duration } = req.body; // plan_type: 'vip1' or 'vip2', duration: 30, 90, 180, 365

        // 验证参数
        if (!plan_type || !duration) {
            return res.status(400).json({
                success: false,
                message: '缺少必要参数'
            });
        }

        // 计算价格
        let price = 0;
        let vipLevel = 'VIP1';

        if (plan_type === 'vip1') {
            vipLevel = 'VIP1';
            if (duration === 30) price = 300;
            else if (duration === 90) price = 900;
            else if (duration === 180) price = 1800;
            else if (duration === 365) price = 3600;
        } else if (plan_type === 'vip2') {
            vipLevel = 'VIP2';
            if (duration === 30) price = 600;
            else if (duration === 90) price = 1800;
            else if (duration === 180) price = 3600;
            else if (duration === 365) price = 7200;
        }

        if (price === 0) {
            return res.status(400).json({
                success: false,
                message: '无效的套餐类型或时长'
            });
        }

        // 生成订阅码
        const subcode = vipLevel + '-' + Math.random().toString(36).substring(2, 15).toUpperCase();

        // 计算结束日期
        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + duration);

        // 创建订阅记录
        const result = await db.query(
            `INSERT INTO subscriptions
            (user_id, subcode, plan_type, status, exchange, exchange_uid, start_date, end_date, vip_level, max_devices)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *`,
            [
                userId,
                subcode,
                plan_type,
                'active',
                'purchased',
                'N/A',
                startDate.toISOString().split('T')[0],
                endDate.toISOString().split('T')[0],
                vipLevel,
                plan_type === 'vip2' ? 3 : 1
            ]
        );

        res.json({
            success: true,
            message: '购买成功！',
            data: {
                subcode: result.rows[0].subcode,
                vip_level: vipLevel,
                duration: duration,
                price: price,
                start_date: startDate.toISOString().split('T')[0],
                end_date: endDate.toISOString().split('T')[0]
            }
        });
    } catch (error) {
        console.error('购买订阅码失败:', error);
        res.status(500).json({
            success: false,
            message: '服务器错误'
        });
    }
});

// 获取用户VIP等级
router.get('/vip-status', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;

        // 获取用户所有有效订阅码
        const result = await db.query(
            'SELECT * FROM subscriptions WHERE user_id = $1 AND status = $2',
            [userId, 'active']
        );

        // 确定最高VIP等级
        let highestVip = 'VIP0';
        let maxDevices = 0;
        let latestEndDate = null;

        result.rows.forEach(sub => {
            if (sub.vip_level === 'VIP2' && highestVip !== 'VIP2') {
                highestVip = 'VIP2';
                maxDevices = 3;
            } else if (sub.vip_level === 'VIP1' && highestVip === 'VIP0') {
                highestVip = 'VIP1';
                maxDevices = 1;
            }

            // 找到最晚的结束日期
            if (!latestEndDate || new Date(sub.end_date) > new Date(latestEndDate)) {
                latestEndDate = sub.end_date;
            }
        });

        res.json({
            success: true,
            data: {
                vip_level: highestVip,
                max_devices: maxDevices,
                subscription_count: result.rows.length,
                expiry_date: latestEndDate || 'N/A'
            }
        });
    } catch (error) {
        console.error('获取VIP状态失败:', error);
        res.status(500).json({
            success: false,
            message: '服务器错误'
        });
    }
});

module.exports = router;

