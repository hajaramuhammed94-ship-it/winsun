-- 信号历史记录表
CREATE TABLE IF NOT EXISTS signal_history (
    id SERIAL PRIMARY KEY,
    symbol VARCHAR(20) NOT NULL,
    exchange VARCHAR(20) NOT NULL DEFAULT 'gate',
    timeframe VARCHAR(10) NOT NULL DEFAULT '1h',
    
    -- 信号信息
    signal VARCHAR(10) NOT NULL, -- BUY, SELL, HOLD
    confidence DECIMAL(5,2) NOT NULL, -- 0-100
    price DECIMAL(20,8) NOT NULL,
    
    -- 止损止盈
    stop_loss DECIMAL(20,8),
    take_profit DECIMAL(20,8),
    
    -- 风险评估
    risk_level VARCHAR(10), -- LOW, MEDIUM, HIGH
    
    -- 技术指标
    indicators JSONB, -- 存储所有技术指标数据
    
    -- 信号原因
    reasons TEXT[],
    
    -- 时间戳
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- 索引
    INDEX idx_symbol_created (symbol, created_at DESC),
    INDEX idx_exchange_created (exchange, created_at DESC),
    INDEX idx_signal_created (signal, created_at DESC)
);

-- 信号执行结果表（用于统计准确率）
CREATE TABLE IF NOT EXISTS signal_results (
    id SERIAL PRIMARY KEY,
    signal_id INTEGER REFERENCES signal_history(id) ON DELETE CASCADE,
    
    -- 执行信息
    entry_price DECIMAL(20,8) NOT NULL, -- 入场价格
    exit_price DECIMAL(20,8), -- 出场价格
    exit_time TIMESTAMP, -- 出场时间
    
    -- 结果
    profit_loss DECIMAL(20,8), -- 盈亏金额
    profit_loss_percent DECIMAL(10,4), -- 盈亏百分比
    result VARCHAR(20), -- SUCCESS, FAILED, STOPPED, PENDING
    
    -- 是否触发止损/止盈
    hit_stop_loss BOOLEAN DEFAULT FALSE,
    hit_take_profit BOOLEAN DEFAULT FALSE,
    
    -- 时间戳
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_signal_id (signal_id),
    INDEX idx_result (result),
    INDEX idx_created (created_at DESC)
);

-- 信号统计表（每日汇总）
CREATE TABLE IF NOT EXISTS signal_statistics (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL UNIQUE,
    
    -- 总体统计
    total_signals INTEGER DEFAULT 0,
    buy_signals INTEGER DEFAULT 0,
    sell_signals INTEGER DEFAULT 0,
    hold_signals INTEGER DEFAULT 0,
    
    -- 准确率统计
    total_executed INTEGER DEFAULT 0,
    successful_signals INTEGER DEFAULT 0,
    failed_signals INTEGER DEFAULT 0,
    accuracy_rate DECIMAL(5,2), -- 准确率百分比
    
    -- 盈亏统计
    total_profit_loss DECIMAL(20,8) DEFAULT 0,
    avg_profit_loss DECIMAL(20,8) DEFAULT 0,
    max_profit DECIMAL(20,8) DEFAULT 0,
    max_loss DECIMAL(20,8) DEFAULT 0,
    
    -- 按交易对统计
    symbol_stats JSONB, -- { "BTC/USDT": { "total": 10, "success": 7, ... }, ... }
    
    -- 时间戳
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_date (date DESC)
);

-- 用户信号订阅表（记录用户订阅的交易对）
CREATE TABLE IF NOT EXISTS user_signal_subscriptions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    symbol VARCHAR(20) NOT NULL,
    exchange VARCHAR(20) NOT NULL DEFAULT 'gate',
    
    -- 通知设置
    notify_telegram BOOLEAN DEFAULT FALSE,
    notify_email BOOLEAN DEFAULT FALSE,
    notify_websocket BOOLEAN DEFAULT TRUE,
    
    -- 过滤条件
    min_confidence DECIMAL(5,2) DEFAULT 0, -- 最小置信度
    signal_types VARCHAR(10)[], -- ['BUY', 'SELL'] 只接收特定类型信号
    
    -- 时间戳
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id, symbol, exchange),
    INDEX idx_user_id (user_id),
    INDEX idx_symbol (symbol)
);

-- 信号通知记录表
CREATE TABLE IF NOT EXISTS signal_notifications (
    id SERIAL PRIMARY KEY,
    signal_id INTEGER REFERENCES signal_history(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL,
    
    -- 通知方式
    notification_type VARCHAR(20) NOT NULL, -- telegram, email, websocket
    
    -- 通知状态
    status VARCHAR(20) NOT NULL, -- sent, failed, pending
    error_message TEXT,
    
    -- 时间戳
    sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_signal_id (signal_id),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_created (created_at DESC)
);

-- 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为需要的表添加更新时间触发器
CREATE TRIGGER update_signal_results_updated_at BEFORE UPDATE ON signal_results
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_signal_statistics_updated_at BEFORE UPDATE ON signal_statistics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_signal_subscriptions_updated_at BEFORE UPDATE ON user_signal_subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

