const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 模拟数据库（内存存储）
let mockUsers = [
  {
    id: 1,
    email: '12345@qq.com',
    password: '$2a$10$o76nYbuEbGXLVIrdfDcsBOmqAbeGs.N/l5rTpDJX0yWEO/YPGHI9.',
    username: 'vip2user',
    is_active: true,
    created_at: new Date()
  }
];

let userIdCounter = 2;

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
    const { email, password, username } = req.body;

    // 验证输入
    if (!email || !password) {
      return res.status(400).json({ error: '请输入邮箱和密码' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: '密码至少6个字符' });
    }

    // 检查用户是否已存在
    const userExists = mockUsers.find(u => u.email === email);
    if (userExists) {
      return res.status(400).json({ error: '该邮箱已被注册' });
    }

    // 加密密码
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 创建用户
    const newUser = {
      id: userIdCounter++,
      email,
      password: hashedPassword,
      username: username || null,
      is_active: true,
      created_at: new Date()
    };

    mockUsers.push(newUser);

    // 生成JWT
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.JWT_SECRET || 'winsun-secret-key-2025',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: '注册成功',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        created_at: newUser.created_at
      }
    });
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
};

