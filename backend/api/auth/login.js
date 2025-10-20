const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 模拟数据库
const mockUsers = [
  {
    id: 1,
    email: '12345@qq.com',
    password: '$2a$10$o76nYbuEbGXLVIrdfDcsBOmqAbeGs.N/l5rTpDJX0yWEO/YPGHI9.', // 密码: 123456
    username: 'vip2user',
    is_active: true,
    created_at: new Date()
  }
];

module.exports = async (req, res) => {
  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // 处理 OPTIONS 预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '方法不允许' });
  }

  try {
    const { email, password } = req.body;

    // 验证输入
    if (!email || !password) {
      return res.status(400).json({ error: '请输入邮箱和密码' });
    }

    // 查找用户
    const user = mockUsers.find(u => u.email === email);

    if (!user) {
      return res.status(401).json({ error: '邮箱或密码错误' });
    }

    // 检查账户是否激活
    if (!user.is_active) {
      return res.status(403).json({ error: '账户已被禁用' });
    }

    // 验证密码
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: '邮箱或密码错误' });
    }

    // 生成JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'winsun-secret-key-2025',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: '登录成功',
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        is_verified: true
      }
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
};

