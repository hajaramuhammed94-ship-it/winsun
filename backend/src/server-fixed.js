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

// CORS 配置函数
const corsOptions = {
  origin: function (origin, callback) {
    // 允许的源列表
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:8080',
      'http://localhost:9000',
      'https://winsun-original.vercel.app',
      process.env.FRONTEND_URL
    ].filter(Boolean); // 过滤掉 undefined

    // 允许没有 origin 的请求（例如移动应用、Postman）
    if (!origin) {
      return callback(null, true);
    }

    // 检查是否在允许列表中
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // 允许 Vercel 预览部署（匹配模式）
    if (origin.match(/^https:\/\/winsun-original-[a-z0-9-]+\.vercel\.app$/)) {
      return callback(null, true);
    }

    if (origin.match(/^https:\/\/winsun-backend-[a-z0-9-]+\.vercel\.app$/)) {
      return callback(null, true);
    }

    // 开发环境允许所有 localhost
    if (process.env.NODE_ENV !== 'production' && origin.includes('localhost')) {
      return callback(null, true);
    }

    // 其他情况拒绝
    console.warn(`⚠️  CORS blocked origin: ${origin}`);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// 创建Socket.IO实例（使用相同的 CORS 配置）
const io = socketIO(server, {
  cors: {
    origin: function (origin, callback) {
      const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:8080',
        'http://localhost:9000',
        'https://winsun-original.vercel.app',
        process.env.FRONTEND_URL
      ].filter(Boolean);

      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      if (origin.match(/^https:\/\/winsun-original-[a-z0-9-]+\.vercel\.app$/)) {
        return callback(null, true);
      }

      if (origin.match(/^https:\/\/winsun-backend-[a-z0-9-]+\.vercel\.app$/)) {
        return callback(null, true);
      }

      if (process.env.NODE_ENV !== 'production' && origin.includes('localhost')) {
        return callback(null, true);
      }

      console.warn(`⚠️  WebSocket CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// 中间件
app.use(cors(corsOptions));
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
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    cors: {
      configured: true,
      allowedOrigins: [
        'http://localhost:3000',
        'http://localhost:8080',
        'https://winsun-original.vercel.app',
        'https://winsun-original-*.vercel.app (pattern)',
        process.env.FRONTEND_URL
      ].filter(Boolean)
    }
  });
});

// 根路径
app.get('/', (req, res) => {
  res.json({
    name: 'Winsun API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth/*',
      signals: '/api/signals/*',
      market: '/api/market/*',
      backtest: '/api/backtest/*',
      signalHistory: '/api/signal-history/*'
    }
  });
});

// 404处理
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// 启动服务器（使用http server而不是app.listen）
server.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════╗
║   🚀 Winsun API Server Started       ║
║   📡 HTTP Port: ${PORT}                 ║
║   🔌 WebSocket: Enabled              ║
║   🌍 Environment: ${process.env.NODE_ENV || 'development'}        ║
║   🔒 CORS: Configured                ║
║   ⏰ Time: ${new Date().toLocaleString()}  ║
╚═══════════════════════════════════════╝

📋 Allowed Origins:
   - http://localhost:3000
   - http://localhost:8080
   - http://localhost:9000
   - https://winsun-original.vercel.app
   - https://winsun-original-*.vercel.app
   ${process.env.FRONTEND_URL ? `   - ${process.env.FRONTEND_URL}` : ''}

🔗 API Endpoints:
   - GET  /api/health
   - POST /api/auth/login
   - POST /api/auth/register
   - GET  /api/signals/latest
   - GET  /api/market/price
   - POST /api/backtest/run
   - GET  /api/signal-history/dashboard

🌐 WebSocket:
   - Enabled on same port
   - CORS configured
  `);
});

module.exports = { app, server, io };

