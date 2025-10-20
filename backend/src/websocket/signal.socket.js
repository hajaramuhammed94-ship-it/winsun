/**
 * WebSocket信号推送服务
 * 实时推送交易信号给客户端
 * 支持VIP等级推送频率控制和多设备管理
 */

const signalService = require('../services/signal.service');
const signalHistoryService = require('../services/signalHistory.service');
const db = require('../../config/database-mock');

// 存储用户连接信息
const userConnections = new Map();
const socketToUser = new Map();

module.exports = (io) => {
    console.log('✅ WebSocket服务器初始化完成');

    io.on('connection', (socket) => {
        console.log(`🔌 新连接: ${socket.id}`);

        /**
         * 认证事件
         * 客户端需要发送订阅码进行认证
         */
        socket.on('authenticate', async (data) => {
            try {
                const { subcode } = data;

                if (!subcode) {
                    socket.emit('auth-error', { message: '请提供订阅码' });
                    return;
                }

                // 查询订阅码信息
                const result = await db.query(
                    'SELECT * FROM subscriptions WHERE subcode = $1 AND status = $2',
                    [subcode, 'active']
                );

                if (result.rows.length === 0) {
                    socket.emit('auth-error', { message: '无效的订阅码或订阅已过期' });
                    return;
                }

                const subscription = result.rows[0];

                // 检查订阅是否过期
                const endDate = new Date(subscription.end_date);
                if (endDate < new Date()) {
                    socket.emit('auth-error', { message: '订阅已过期' });
                    return;
                }

                // 保存用户信息到socket
                socket.userId = subscription.user_id;
                socket.vipLevel = subscription.vip_level;
                socket.subcode = subcode;
                socket.maxDevices = subscription.max_devices || 1;
                socket.authenticated = true;

                // 添加到连接映射
                if (!userConnections.has(subscription.user_id)) {
                    userConnections.set(subscription.user_id, []);
                }
                const connections = userConnections.get(subscription.user_id);

                // 检查设备数限制
                if (connections.length >= socket.maxDevices) {
                    socket.emit('auth-error', {
                        message: `超过最大设备数限制（${socket.maxDevices}个）`,
                        currentDevices: connections.length
                    });
                    socket.disconnect();
                    return;
                }

                connections.push(socket.id);
                socketToUser.set(socket.id, subscription.user_id);

                // 发送认证成功消息
                socket.emit('authenticated', {
                    vipLevel: subscription.vip_level,
                    maxDevices: socket.maxDevices,
                    currentDevices: connections.length,
                    expiryDate: subscription.end_date,
                    message: '认证成功'
                });

                console.log(`✅ 用户认证成功: ${socket.userId}, VIP: ${socket.vipLevel}, 设备: ${connections.length}/${socket.maxDevices}`);

                // 开始推送信号
                startSignalPush(socket, subscription);

            } catch (error) {
                console.error('❌ 认证失败:', error);
                socket.emit('auth-error', { message: '认证失败，请稍后重试' });
            }
        });

        /**
         * 订阅交易对
         */
        socket.on('subscribe', (data) => {
            if (!socket.authenticated) {
                socket.emit('error', { message: '请先认证' });
                return;
            }

            const { symbols } = data;
            if (!symbols || !Array.isArray(symbols)) {
                socket.emit('error', { message: '请提供有效的交易对数组' });
                return;
            }

            socket.subscribedSymbols = symbols;
            console.log(`📊 用户 ${socket.userId} 订阅交易对:`, symbols);

            socket.emit('subscribed', {
                symbols: symbols,
                message: '订阅成功'
            });
        });

        /**
         * 取消订阅
         */
        socket.on('unsubscribe', (data) => {
            const { symbols } = data;
            if (socket.subscribedSymbols && symbols) {
                socket.subscribedSymbols = socket.subscribedSymbols.filter(
                    s => !symbols.includes(s)
                );
                console.log(`📊 用户 ${socket.userId} 取消订阅:`, symbols);
            }
        });

        /**
         * 手动请求信号
         */
        socket.on('request-signal', async (data) => {
            if (!socket.authenticated) {
                socket.emit('error', { message: '请先认证' });
                return;
            }

            try {
                const { symbol, timeframe = '1h', exchange = 'gate' } = data;
                const signal = await signalService.generateSignal(symbol, timeframe, exchange);

                socket.emit('signal-response', {
                    symbol: symbol,
                    signal: signal,
                    timestamp: Date.now()
                });
            } catch (error) {
                socket.emit('error', { message: '生成信号失败: ' + error.message });
            }
        });

        /**
         * 断开连接
         */
        socket.on('disconnect', () => {
            console.log(`❌ 连接断开: ${socket.id}`);

            // 清理定时器
            if (socket.signalInterval) {
                clearInterval(socket.signalInterval);
            }

            // 从连接映射中移除
            const userId = socketToUser.get(socket.id);
            if (userId && userConnections.has(userId)) {
                const connections = userConnections.get(userId);
                const index = connections.indexOf(socket.id);
                if (index > -1) {
                    connections.splice(index, 1);
                }
                if (connections.length === 0) {
                    userConnections.delete(userId);
                }
                socketToUser.delete(socket.id);
            }
        });

        /**
         * 错误处理
         */
        socket.on('error', (error) => {
            console.error(`❌ Socket错误 [${socket.id}]:`, error);
        });
    });
};

/**
 * 开始推送信号
 */
function startSignalPush(socket, subscription) {
    // 根据VIP等级设置推送频率
    let interval;
    if (subscription.vip_level === 'VIP2') {
        interval = 5000; // 5秒
    } else if (subscription.vip_level === 'VIP1') {
        interval = 15000; // 15秒
    } else {
        interval = 60000; // 60秒（免费用户）
    }

    // 默认订阅的交易对
    if (!socket.subscribedSymbols) {
        socket.subscribedSymbols = ['BTC/USDT', 'ETH/USDT', 'BNB/USDT'];
    }

    console.log(`⏰ 开始推送信号，间隔: ${interval}ms (${subscription.vip_level})`);

    // 立即推送一次
    pushSignals(socket);

    // 定时推送
    socket.signalInterval = setInterval(async () => {
        if (!socket.authenticated || !socket.connected) {
            clearInterval(socket.signalInterval);
            return;
        }

        await pushSignals(socket);
    }, interval);
}

/**
 * 推送信号
 */
async function pushSignals(socket) {
    try {
        if (!socket.subscribedSymbols || socket.subscribedSymbols.length === 0) {
            return;
        }

        // 生成信号
        const signals = await signalService.generateMultipleSignals(
            socket.subscribedSymbols,
            '1h',
            'gate'
        );

        // 过滤掉错误的信号
        const validSignals = signals.filter(s => !s.error);

        if (validSignals.length > 0) {
            // 保存信号到历史记录
            try {
                const signalsToSave = validSignals.map(s => ({
                    symbol: s.symbol,
                    exchange: 'gate',
                    timeframe: '1h',
                    signal: s.signal,
                    confidence: s.confidence,
                    price: s.price,
                    stopLoss: s.stopLoss,
                    takeProfit: s.takeProfit,
                    riskLevel: s.riskLevel,
                    indicators: s.indicators,
                    reasons: s.reasons
                }));

                await signalHistoryService.saveMultipleSignals(signalsToSave);
            } catch (saveError) {
                console.error('⚠️ 保存信号历史失败:', saveError.message);
                // 不影响推送，继续执行
            }

            // 推送给客户端
            socket.emit('trading-signals', {
                signals: validSignals,
                timestamp: Date.now(),
                vipLevel: socket.vipLevel
            });

            console.log(`📡 推送 ${validSignals.length} 个信号给用户 ${socket.userId} (${socket.vipLevel})`);
        }

    } catch (error) {
        console.error('❌ 推送信号失败:', error);
        socket.emit('error', { message: '推送信号失败' });
    }
}

/**
 * 获取在线用户统计
 */
function getOnlineStats() {
    const stats = {
        totalUsers: userConnections.size,
        totalConnections: socketToUser.size,
        users: []
    };

    for (const [userId, connections] of userConnections.entries()) {
        stats.users.push({
            userId: userId,
            connections: connections.length
        });
    }

    return stats;
}

// 导出统计函数
module.exports.getOnlineStats = getOnlineStats;

