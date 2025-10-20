const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');

// 加载环境变量
dotenv.config();

// 测试数据库连接
console.log('🔧 初始化数据库连接...');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// 创建Socket.IO实例
const io = socketIO(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
  }
});

// CORS 中间件 - 允许所有来源
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
}));

// 添加额外的 CORS 头
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');

  // 处理 OPTIONS 预检请求
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件
app.use('/uploads', express.static('uploads'));

// 路由
app.use('/api/auth', require('./routes/auth'));
app.use('/api/newsletter', require('./routes/newsletter'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/news', require('./routes/news'));
app.use('/api/pricing', require('./routes/pricing'));
app.use('/api/signals', require('./routes/signals'));
app.use('/api/performance', require('./routes/performance'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/market', require('./routes/market')); // 新增：市场数据API
app.use('/api/backtest', require('./routes/backtest')); // 新增：回测API
app.use('/api/signal-history', require('./routes/signalHistory')); // 新增：信号历史API

// WebSocket连接处理
require('./websocket/signal.socket')(io);

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Winsun API is running',
    timestamp: new Date().toISOString()
  });
});

// 404处理
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

// Vercel serverless 函数导出
// 在 Vercel 上不需要 listen，直接导出 app
if (process.env.NODE_ENV !== 'production') {
  // 仅在本地开发时启动服务器
  server.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════╗
║   🚀 Winsun API Server Started       ║
║   📡 HTTP Port: ${PORT}                 ║
║   🔌 WebSocket: Enabled              ║
║   🌍 Environment: ${process.env.NODE_ENV || 'development'}        ║
║   ⏰ Time: ${new Date().toLocaleString()}  ║
╚═══════════════════════════════════════╝
    `);
  });
}

// 导出 app 供 Vercel 使用
module.exports = app;

