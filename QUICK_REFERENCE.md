# ⚡ 快速参考卡片

## 🚀 立即启动

```bash
# 后端
cd /home/jzy/桌面/量化/winsun-clone/backend && node src/server.js

# 前端（新终端）
cd /home/jzy/桌面/量化/winsun-clone/frontend
npm install --legacy-peer-deps  # 首次运行
npm run dev
```

---

## 🌐 访问地址

- **前端**: http://localhost:3000
- **后端API**: http://localhost:5000
- **旧前端**: http://localhost:8080

---

## 📝 测试账号

- **邮箱**: `12345@qq.com`
- **密码**: `123456`
- **订阅码**: `VIP2-ADMIN-GRANTED-001`

---

## 📊 项目进度

```
✅ 后端开发          100%
✅ WebSocket推送     100%
✅ 信号历史系统      100%
⏳ 前端开发          90%  (需要启动)
❌ 信号历史页面      30%
❌ 统计分析页面      30%
```

---

## 🎯 下一步任务

1. ⏰ **立即**: 启动前端 (10分钟)
2. ⏰ **今天**: 完成SignalHistory页面 (2小时)
3. ⏰ **今天**: 完成Statistics页面 (3小时)
4. ⏰ **明天**: 集成TradingView图表 (4小时)

---

## 🐛 常见问题

### 端口被占用
```bash
lsof -ti:5000 | xargs kill -9  # 后端
lsof -ti:3000 | xargs kill -9  # 前端
```

### 前端依赖问题
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### API 401错误
重新登录获取新token

---

## 📁 关键文件

**后端**:
- `backend/src/server.js` - 主入口
- `backend/src/services/signal.service.js` - 信号算法
- `backend/src/websocket/signal.socket.js` - WebSocket

**前端**:
- `frontend/src/App.tsx` - 主应用
- `frontend/src/pages/Dashboard.tsx` - 仪表板
- `frontend/src/pages/LiveSignals.tsx` - 实时信号

---

## 📖 完整文档

详细信息请查看: `NEXT_SESSION_GUIDE.md`

