// 模拟数据库 - 用于快速演示
const mockData = {
  users: [
    {
      id: 1,
      email: '12345@qq.com',
      password: '$2a$10$o76nYbuEbGXLVIrdfDcsBOmqAbeGs.N/l5rTpDJX0yWEO/YPGHI9.', // 密码: 123456
      username: 'vip2user',
      is_active: true,
      created_at: new Date()
    }
  ],
  subscriptions: [
    {
      id: 1,
      user_id: 1,
      subcode: 'VIP2-ADMIN-GRANTED-001',
      plan_type: 'vip2',
      status: 'active',
      exchange: 'manual',
      exchange_uid: 'ADMIN_GRANTED',
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1年后
      vip_level: 'VIP2',
      max_devices: 3,
      created_at: new Date()
    }
  ],
  signal_history: [],
  signal_results: [],
  signal_statistics: [],
  user_signal_subscriptions: [],
  signal_notifications: [],
  testimonials: [
    {
      id: 1,
      user_name: 'Julia Fernandez',
      content: 'Q：Winsun能否替我自动交易？ A：绝不。我们提供的是"认知差"优势。想象一下，拥有一个全天候工作的首席分析师团队，将最复杂的市场数据转化为清晰的"做多"或"做空"指令，并附上令人信服的理由。',
      rating: 5,
      position: 'Crypto Trader',
      is_featured: true
    },
    {
      id: 2,
      user_name: 'Emily Watson',
      content: 'Q：我只是个普通投资者，Winsun对我而言是否过于复杂？ A：这正是为您打造的。Winsun的伟大之处在于，它将机构级的分析能力变成简单直接的信号。',
      rating: 5,
      position: 'Investor',
      is_featured: true
    },
    {
      id: 3,
      user_name: 'Amelia Clarke',
      content: 'Q：在众多分析工具中，为什么你们的信号更值得信赖？ A：因为我们的洞察源自数据深处。当别人还在看K线时，我们的系统已在分析链上巨鲸的转账动向。',
      rating: 5,
      position: 'Analyst',
      is_featured: true
    }
  ],
  news: [
    {
      id: 1,
      title: 'Winsun平台正式上线',
      slug: 'winsun-platform-launch',
      content: '经过数月的精心准备，Winsun加密货币分析平台正式上线。',
      excerpt: '经过数月的精心准备，Winsun加密货币分析平台正式上线',
      author: 'Winsun Team',
      category: 'announcement',
      is_published: true
    }
  ],
  pricing_plans: [
    {
      id: 1,
      name: '基础版',
      price: 99.00,
      currency: 'USD',
      billing_period: 'monthly',
      features: { signals_per_day: 1, support: 'email' },
      is_popular: false,
      is_active: true
    },
    {
      id: 2,
      name: '专业版',
      price: 299.00,
      currency: 'USD',
      billing_period: 'monthly',
      features: { signals_per_day: 3, support: 'priority' },
      is_popular: true,
      is_active: true
    },
    {
      id: 3,
      name: '企业版',
      price: 999.00,
      currency: 'USD',
      billing_period: 'monthly',
      features: { signals_per_day: 'unlimited', support: '24/7' },
      is_popular: false,
      is_active: true
    }
  ],
  trading_signals: [
    {
      id: 1,
      symbol: 'BTC',
      signal_type: 'BUY',
      price: 45000.00,
      target_price: 48000.00,
      stop_loss: 43500.00,
      confidence_score: 85,
      analysis: '链上数据显示大额资金持续流入',
      status: 'active'
    }
  ],
  performance_data: [
    { id: 1, date: '2024-01-01', value: 10000, metric_type: 'net_value' },
    { id: 2, date: '2024-02-01', value: 10500, metric_type: 'net_value' },
    { id: 3, date: '2024-03-01', value: 11200, metric_type: 'net_value' },
    { id: 4, date: '2024-04-01', value: 10800, metric_type: 'net_value' },
    { id: 5, date: '2024-05-01', value: 12100, metric_type: 'net_value' },
    { id: 6, date: '2024-06-01', value: 13500, metric_type: 'net_value' },
    { id: 7, date: '2024-07-01', value: 13200, metric_type: 'net_value' },
    { id: 8, date: '2024-08-01', value: 14800, metric_type: 'net_value' },
    { id: 9, date: '2024-09-01', value: 15600, metric_type: 'net_value' },
    { id: 10, date: '2024-10-01', value: 16200, metric_type: 'net_value' },
    { id: 11, date: '2024-11-01', value: 17500, metric_type: 'net_value' },
    { id: 12, date: '2024-12-01', value: 18900, metric_type: 'net_value' },
    { id: 13, date: '2025-01-01', value: 19500, metric_type: 'net_value' },
    { id: 14, date: '2025-02-01', value: 21000, metric_type: 'net_value' },
    { id: 15, date: '2025-03-01', value: 22500, metric_type: 'net_value' },
    { id: 16, date: '2025-04-01', value: 23800, metric_type: 'net_value' },
    { id: 17, date: '2025-05-01', value: 25200, metric_type: 'net_value' },
    { id: 18, date: '2025-06-01', value: 26500, metric_type: 'net_value' },
    { id: 19, date: '2025-07-01', value: 28000, metric_type: 'net_value' },
    { id: 20, date: '2025-08-01', value: 29500, metric_type: 'net_value' },
    { id: 21, date: '2025-09-01', value: 31200, metric_type: 'net_value' },
    { id: 22, date: '2025-10-01', value: 33000, metric_type: 'net_value' }
  ],
  contact_messages: []
};

let userIdCounter = 2; // 从2开始，因为已经有一个预设用户
let subscriptionIdCounter = 2; // 从2开始，因为已经有一个预设订阅码
let messageIdCounter = 1;

const query = async (sql, params = []) => {
  // 简单的SQL解析
  const sqlUpper = sql.trim().toUpperCase();
  
  // SELECT查询
  if (sqlUpper.startsWith('SELECT')) {
    if (sql.includes('testimonials')) {
      return { rows: mockData.testimonials.filter(t => t.is_featured) };
    }
    if (sql.includes('news')) {
      return { rows: mockData.news };
    }
    if (sql.includes('pricing_plans')) {
      return { rows: mockData.pricing_plans };
    }
    if (sql.includes('trading_signals')) {
      return { rows: mockData.trading_signals };
    }
    if (sql.includes('performance_data')) {
      return { rows: mockData.performance_data };
    }
    if (sql.includes('users')) {
      const email = params[0];
      const user = mockData.users.find(u => u.email === email);
      return { rows: user ? [user] : [] };
    }
    if (sql.includes('subscriptions')) {
      // WebSocket认证查询: WHERE subcode = $1 AND status = $2
      if (params.length >= 2 && sql.includes('subcode') && sql.includes('status')) {
        const subcode = params[0];
        const status = params[1];
        const sub = mockData.subscriptions.find(s => s.subcode === subcode && s.status === status);
        return { rows: sub ? [sub] : [] };
      }
      // 如果有user_id参数，过滤订阅码
      if (params.length > 0 && sql.includes('user_id') && !sql.includes('subcode')) {
        const userId = params[0];
        const userSubs = mockData.subscriptions.filter(s => s.user_id === userId);
        return { rows: userSubs };
      }
      // 如果有user_id和subcode参数
      if (params.length > 1 && sql.includes('user_id') && sql.includes('subcode')) {
        const userId = params[0];
        const subcode = params[1];
        const sub = mockData.subscriptions.find(s => s.user_id === userId && s.subcode === subcode);
        return { rows: sub ? [sub] : [] };
      }
      // 检查plan_type
      if (params.length > 1 && sql.includes('plan_type')) {
        const userId = params[0];
        const planType = params[1];
        const userSubs = mockData.subscriptions.filter(s => s.user_id === userId && s.plan_type === planType);
        return { rows: userSubs };
      }
      return { rows: mockData.subscriptions };
    }
    return { rows: [] };
  }

  // INSERT查询
  if (sqlUpper.startsWith('INSERT')) {
    if (sql.includes('users')) {
      const newUser = {
        id: userIdCounter++,
        email: params[0],
        password: params[1],
        username: params[2],
        full_name: params[3],
        phone: params[4],
        is_active: true,  // 新注册用户默认激活
        created_at: new Date()
      };
      mockData.users.push(newUser);
      return { rows: [newUser] };
    }
    if (sql.includes('subscriptions')) {
      // 判断是newsletter订阅还是订阅码
      if (params.length >= 7) {
        // 订阅码 (user_id, subcode, plan_type, status, exchange, exchange_uid, start_date, end_date, vip_level, max_devices)
        const newSub = {
          id: subscriptionIdCounter++,
          user_id: params[0],
          subcode: params[1],
          plan_type: params[2],
          status: params[3],
          exchange: params[4],
          exchange_uid: params[5],
          start_date: params[6],
          end_date: params[7],
          vip_level: params[8] || 'VIP0',
          max_devices: params[9] || 1,
          created_at: new Date()
        };
        mockData.subscriptions.push(newSub);
        return { rows: [newSub] };
      } else {
        // Newsletter订阅
        const newSub = {
          id: subscriptionIdCounter++,
          email: params[0],
          is_active: true,
          subscribed_at: new Date()
        };
        mockData.subscriptions.push(newSub);
        return { rows: [newSub] };
      }
    }
    if (sql.includes('contact_messages')) {
      const newMsg = {
        id: messageIdCounter++,
        name: params[0],
        email: params[1],
        phone: params[2],
        subject: params[3],
        message: params[4],
        created_at: new Date()
      };
      mockData.contact_messages.push(newMsg);
      return { rows: [newMsg] };
    }
    return { rows: [{ id: 1 }] };
  }
  
  // UPDATE查询
  if (sqlUpper.startsWith('UPDATE')) {
    return { rows: [], rowCount: 1 };
  }
  
  return { rows: [] };
};

console.log('✅ 使用模拟数据库（内存模式）');

module.exports = {
  query,
  pool: { query }
};

