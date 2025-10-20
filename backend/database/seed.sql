-- Winsun数据库种子数据

-- 插入测试用户 (密码: password123, 已用bcrypt加密)
INSERT INTO users (email, password, username, full_name, is_verified) VALUES
('test@winsun.com', '$2a$10$YourHashedPasswordHere', 'testuser', 'Test User', true),
('admin@winsun.com', '$2a$10$YourHashedPasswordHere', 'admin', 'Admin User', true);

-- 插入用户反馈
INSERT INTO testimonials (user_name, content, rating, position, is_featured) VALUES
('Julia Fernandez', 'Q：Winsun能否替我自动交易？ A：绝不。 我们提供的是"认知差"优势。想象一下，拥有一个全天候工作的首席分析师团队，将最复杂的市场数据转化为清晰的"做多"或"做空"指令，并附上令人信服的理由。决策权永远在您手中，但您决策的智慧将被无限放大。', 5, 'Crypto Trader', true),
('Emily Watson', 'Q：我只是个普通投资者，Winsun对我而言是否过于复杂？ A：这正是为您打造的。 Winsun的伟大之处在于，它将机构级的分析能力变成简单直接的信号。您无需理解复杂的术语，我们要做的就是为您劈开市场的信息洪流，直指核心机遇。无论是新手还是专家，都能获得超越自身经验的交易智慧。', 5, 'Investor', true),
('Amelia Clarke', 'Q：在众多分析工具中，为什么你们的信号更值得信赖？ A：因为我们的洞察源自数据深处。当别人还在看K线时，我们的系统已在分析链上巨鲸的转账动向、交易所的资金流速和衍生品市场的情绪极值。我们交付的不是"猜测"，而是基于数据交叉验证的高概率答案。这是您一直在寻找的终极优势。', 5, 'Analyst', true),
('Olivia Harrison', 'Q：我会被信号轰炸吗？ A：我们厌恶噪音。 并非所有的交易市场波动都值得参与，Winsun的核心价值在于"过滤"。我们强大的算法会为您剔除99%的市场干扰，每日仅推送1-3个经过千锤百炼的黄金机会。我们确保您的每一次关注，都价值千金。', 5, 'Day Trader', true);

-- 插入新闻文章
INSERT INTO news (title, slug, content, excerpt, author, category, is_published, published_at) VALUES
('Winsun平台正式上线', 'winsun-platform-launch', '经过数月的精心准备，Winsun加密货币分析平台正式上线。我们致力于为全球交易者提供最专业的市场分析和交易信号...', '经过数月的精心准备，Winsun加密货币分析平台正式上线', 'Winsun Team', 'announcement', true, CURRENT_TIMESTAMP),
('如何使用Winsun信号进行交易', 'how-to-use-winsun-signals', '本文将详细介绍如何正确使用Winsun提供的交易信号，包括信号解读、风险管理和仓位控制...', '详细介绍如何正确使用Winsun提供的交易信号', 'Trading Expert', 'tutorial', true, CURRENT_TIMESTAMP),
('加密货币市场分析：2025年趋势展望', 'crypto-market-2025-outlook', '2025年加密货币市场将迎来新的发展机遇。本文从技术面、基本面和宏观经济角度分析市场趋势...', '2025年加密货币市场趋势分析', 'Market Analyst', 'analysis', true, CURRENT_TIMESTAMP);

-- 插入定价方案
INSERT INTO pricing_plans (name, price, currency, billing_period, features, is_popular, is_active) VALUES
('基础版', 99.00, 'USD', 'monthly', 
 '{"signals_per_day": 1, "support": "email", "features": ["每日1个精选信号", "邮件支持", "基础市场分析"]}', 
 false, true),
('专业版', 299.00, 'USD', 'monthly', 
 '{"signals_per_day": 3, "support": "priority", "features": ["每日3个精选信号", "优先支持", "深度市场分析", "实时提醒"]}', 
 true, true),
('企业版', 999.00, 'USD', 'monthly', 
 '{"signals_per_day": "unlimited", "support": "24/7", "features": ["无限信号", "24/7专属支持", "定制化分析", "API访问", "专属顾问"]}', 
 false, true);

-- 插入性能数据 (模拟净值曲线)
INSERT INTO performance_data (date, value, metric_type) VALUES
('2024-01-01', 10000.00, 'net_value'),
('2024-02-01', 10500.00, 'net_value'),
('2024-03-01', 11200.00, 'net_value'),
('2024-04-01', 10800.00, 'net_value'),
('2024-05-01', 12100.00, 'net_value'),
('2024-06-01', 13500.00, 'net_value'),
('2024-07-01', 13200.00, 'net_value'),
('2024-08-01', 14800.00, 'net_value'),
('2024-09-01', 15600.00, 'net_value'),
('2024-10-01', 16200.00, 'net_value'),
('2024-11-01', 17500.00, 'net_value'),
('2024-12-01', 18900.00, 'net_value'),
('2025-01-01', 19500.00, 'net_value'),
('2025-02-01', 21000.00, 'net_value'),
('2025-03-01', 22500.00, 'net_value'),
('2025-04-01', 23800.00, 'net_value'),
('2025-05-01', 25200.00, 'net_value'),
('2025-06-01', 26500.00, 'net_value'),
('2025-07-01', 28000.00, 'net_value'),
('2025-08-01', 29500.00, 'net_value'),
('2025-09-01', 31200.00, 'net_value'),
('2025-10-01', 33000.00, 'net_value');

-- 插入交易信号示例
INSERT INTO trading_signals (symbol, signal_type, price, target_price, stop_loss, confidence_score, analysis, status) VALUES
('BTC', 'BUY', 45000.00, 48000.00, 43500.00, 85, 
 '链上数据显示大额资金持续流入，技术面突破关键阻力位，建议逢低建仓。风险收益比1:3，止损设置在43500。', 
 'active'),
('ETH', 'BUY', 2800.00, 3200.00, 2700.00, 78, 
 'ETH/BTC比率触底反弹，DeFi锁仓量持续增长，技术面形成双底形态，建议分批建仓。', 
 'active'),
('SOL', 'SELL', 120.00, 110.00, 125.00, 72, 
 '短期涨幅过大，链上活跃度下降，建议获利了结。目标价110，止损125。', 
 'active');

-- 插入Newsletter订阅示例
INSERT INTO subscriptions (email) VALUES
('subscriber1@example.com'),
('subscriber2@example.com'),
('subscriber3@example.com');

-- 插入联系消息示例
INSERT INTO contact_messages (name, email, subject, message) VALUES
('John Doe', 'john@example.com', '咨询定价', '您好，我想了解更多关于专业版的详细信息。'),
('Jane Smith', 'jane@example.com', '技术支持', '我在使用过程中遇到了一些问题，希望能得到帮助。');

