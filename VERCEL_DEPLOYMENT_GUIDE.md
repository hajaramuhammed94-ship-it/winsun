# 🚀 Vercel部署指南

## 📋 部署信息

- **Vercel账户**: iwayjws74857@outlook.com
- **项目URL**: https://vercel.com/cvsgetyes-projects
- **密码**: iwayjws74857-2713

---

## 🎯 部署步骤

### 步骤1: 安装Vercel CLI

```bash
npm install -g vercel
```

### 步骤2: 登录Vercel

```bash
vercel login
```

选择 **Email** 登录方式，输入: `iwayjws74857@outlook.com`

然后检查邮箱，点击验证链接。

### 步骤3: 部署前端

```bash
cd /home/jzy/桌面/量化/winsun-clone/frontend
vercel
```

**部署过程中的选择**:

1. **Set up and deploy?** → `Y` (Yes)
2. **Which scope?** → 选择 `cvsgetyes-projects`
3. **Link to existing project?** → `N` (No，首次部署)
4. **What's your project's name?** → `winsun-frontend` (或您喜欢的名字)
5. **In which directory is your code located?** → `./` (当前目录)
6. **Want to override the settings?** → `N` (No，使用默认设置)

### 步骤4: 生产环境部署

```bash
vercel --prod
```

---

## ⚙️ 环境变量配置

部署后需要在Vercel Dashboard配置环境变量：

1. 访问: https://vercel.com/cvsgetyes-projects/winsun-frontend/settings/environment-variables

2. 添加以下环境变量:

```
VITE_API_URL=https://your-backend-url.com
```

**注意**: 您需要先部署后端到一个公网可访问的地址（如Railway、Render、Heroku等）

---

## 🔧 后端部署选项

### 选项1: Railway (推荐)

```bash
# 安装Railway CLI
npm install -g @railway/cli

# 登录
railway login

# 部署后端
cd /home/jzy/桌面/量化/winsun-clone/backend
railway init
railway up
```

### 选项2: Render

1. 访问 https://render.com
2. 连接GitHub仓库
3. 选择 `backend` 目录
4. 设置启动命令: `node src/server.js`

### 选项3: Heroku

```bash
# 安装Heroku CLI
curl https://cli-assets.heroku.com/install.sh | sh

# 登录
heroku login

# 创建应用
cd /home/jzy/桌面/量化/winsun-clone/backend
heroku create winsun-backend

# 部署
git push heroku main
```

---

## 📝 部署后配置

### 1. 更新API代理

编辑 `frontend/vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://your-backend-url.com/api/:path*"
    }
  ]
}
```

将 `your-backend-url.com` 替换为实际的后端URL。

### 2. 更新CORS设置

编辑 `backend/src/server.js`，添加Vercel域名到CORS白名单:

```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://winsun-frontend.vercel.app',
    'https://your-custom-domain.com'
  ],
  credentials: true
}));
```

### 3. 配置WebSocket

如果后端部署到Railway/Render，需要确保WebSocket支持:

```javascript
// backend/src/server.js
const io = require('socket.io')(server, {
  cors: {
    origin: [
      'http://localhost:3000',
      'https://winsun-frontend.vercel.app'
    ],
    credentials: true
  },
  transports: ['websocket', 'polling']
});
```

---

## 🌐 访问部署的应用

部署成功后，您会得到一个URL，类似:

```
https://winsun-frontend.vercel.app
```

或者您可以绑定自定义域名。

---

## 🐛 常见问题

### Q1: 部署后API请求失败

**原因**: 后端未部署或CORS配置错误

**解决**:
1. 确保后端已部署并可访问
2. 检查CORS设置
3. 更新 `vercel.json` 中的API代理地址

### Q2: WebSocket连接失败

**原因**: Vercel不支持长连接WebSocket

**解决**:
1. 使用Socket.io的polling模式作为fallback
2. 或者使用Vercel的Serverless Functions + Pusher/Ably

### Q3: 构建失败

**原因**: 依赖版本不兼容

**解决**:
```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
vercel --prod
```

---

## 📊 部署检查清单

- [ ] Vercel CLI已安装
- [ ] 已登录Vercel账户
- [ ] 前端构建成功 (`npm run build`)
- [ ] 后端已部署到公网
- [ ] 环境变量已配置
- [ ] CORS设置已更新
- [ ] API代理已配置
- [ ] WebSocket连接正常
- [ ] 测试登录功能
- [ ] 测试实时信号

---

## 🚀 快速部署命令

```bash
# 1. 进入前端目录
cd /home/jzy/桌面/量化/winsun-clone/frontend

# 2. 构建测试
npm run build

# 3. 部署到Vercel
vercel --prod
```

---

## 📖 相关文档

- Vercel文档: https://vercel.com/docs
- Vite部署指南: https://vitejs.dev/guide/static-deploy.html
- Socket.io部署: https://socket.io/docs/v4/deployment/

---

**祝您部署顺利！** 🎉

