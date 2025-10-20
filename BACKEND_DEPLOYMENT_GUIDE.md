# 🚀 后端部署完整指南

## 📋 当前状态

✅ **前端已部署**: https://winsun-frontend-52l2glgez-cvsgetyes-projects.vercel.app  
⏳ **后端待部署**: 需要部署到公网才能让前端正常工作

---

## 🎯 推荐方案：Render.com (最简单)

Render.com 是最简单的Node.js后端部署平台，完全免费，支持GitHub自动部署。

### 优势
- ✅ 完全免费（Free Tier）
- ✅ 支持GitHub自动部署
- ✅ 自动HTTPS
- ✅ 自动重启
- ✅ 简单的Web界面配置

---

## 📝 部署步骤

### 步骤1: 准备GitHub仓库

#### 1.1 初始化Git（如果还没有）

```bash
cd /home/jzy/桌面/量化/winsun-clone
git init
git add .
git commit -m "Initial commit - Winsun backend and frontend"
```

#### 1.2 创建GitHub仓库

1. 访问 https://github.com/new
2. 仓库名称: `winsun-clone`
3. 设置为 **Private** (私有)
4. 点击 "Create repository"

#### 1.3 推送代码到GitHub

```bash
# 替换YOUR_USERNAME为您的GitHub用户名
git remote add origin https://github.com/YOUR_USERNAME/winsun-clone.git
git branch -M main
git push -u origin main
```

---

### 步骤2: 在Render.com部署后端

#### 2.1 注册Render账户

1. 访问 https://render.com/
2. 点击 "Get Started for Free"
3. 使用GitHub账户登录（推荐）

#### 2.2 创建新的Web Service

1. 点击 "New +" → "Web Service"
2. 连接您的GitHub仓库 `winsun-clone`
3. 点击 "Connect"

#### 2.3 配置Web Service

填写以下信息：

| 配置项 | 值 |
|--------|-----|
| **Name** | `winsun-backend` |
| **Region** | Singapore (最接近中国) |
| **Root Directory** | `backend` |
| **Runtime** | Node |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | Free |

#### 2.4 添加环境变量

点击 "Advanced" → "Add Environment Variable"，添加以下变量：

```
PORT=5000
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

#### 2.5 部署

1. 点击 "Create Web Service"
2. 等待部署完成（约3-5分钟）
3. 部署成功后，您会看到类似这样的URL:
   ```
   https://winsun-backend.onrender.com
   ```

---

### 步骤3: 更新前端配置

#### 3.1 更新vercel.json

编辑 `frontend/vercel.json`，将后端URL更新为Render部署的URL：

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://winsun-backend.onrender.com/api/:path*"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

#### 3.2 重新部署前端

```bash
cd /home/jzy/桌面/量化/winsun-clone/frontend
npx vercel --prod
```

---

### 步骤4: 更新后端CORS配置

#### 4.1 编辑backend/src/server.js

找到CORS配置部分，添加Vercel域名：

```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://winsun-frontend-52l2glgez-cvsgetyes-projects.vercel.app',
    'https://winsun-frontend-*.vercel.app'
  ],
  credentials: true
}));
```

#### 4.2 提交并推送更改

```bash
cd /home/jzy/桌面/量化/winsun-clone
git add backend/src/server.js
git commit -m "Update CORS for Vercel frontend"
git push
```

Render会自动检测到更改并重新部署！

---

## 🔍 验证部署

### 测试后端API

```bash
# 测试健康检查
curl https://winsun-backend.onrender.com/api/health

# 应该返回:
# {"status":"ok","timestamp":"..."}
```

### 测试前端

1. 访问: https://winsun-frontend-52l2glgez-cvsgetyes-projects.vercel.app
2. 尝试登录:
   - 邮箱: `12345@qq.com`
   - 密码: `123456`
3. 检查Dashboard是否加载数据
4. 检查Live Signals是否接收WebSocket消息

---

## ⚠️ 重要提示

### Render Free Tier限制

- ✅ 完全免费
- ⚠️ 15分钟无活动后会休眠
- ⚠️ 首次访问可能需要30秒唤醒
- ⚠️ 每月750小时免费运行时间

### 解决休眠问题

可以使用UptimeRobot等服务每5分钟ping一次您的后端，保持其活跃状态。

---

## 🎯 替代方案

### 方案2: Railway.app

如果Render不满意，可以使用Railway：

1. 访问 https://railway.app/
2. 使用GitHub登录
3. 点击 "New Project" → "Deploy from GitHub repo"
4. 选择 `winsun-clone` 仓库
5. 设置Root Directory为 `backend`
6. 添加环境变量
7. 部署

### 方案3: Heroku

Heroku也是不错的选择，但需要信用卡验证（即使使用免费套餐）。

---

## 📊 部署检查清单

- [ ] GitHub仓库已创建并推送代码
- [ ] Render账户已注册
- [ ] 后端Web Service已创建
- [ ] 环境变量已配置
- [ ] 后端部署成功
- [ ] 获取后端URL
- [ ] 更新frontend/vercel.json中的API代理
- [ ] 重新部署前端
- [ ] 更新backend/src/server.js中的CORS配置
- [ ] 推送CORS更改到GitHub
- [ ] 测试后端API
- [ ] 测试前端登录
- [ ] 测试Dashboard数据加载
- [ ] 测试WebSocket连接

---

## 🆘 常见问题

### Q: 后端部署失败怎么办？

A: 检查Render的部署日志，常见问题：
- Node.js版本不兼容
- 依赖安装失败
- 启动命令错误

### Q: 前端无法连接后端？

A: 检查：
1. 后端URL是否正确
2. CORS配置是否包含前端域名
3. 浏览器控制台是否有错误

### Q: WebSocket连接失败？

A: Render支持WebSocket，但需要确保：
1. 使用wss://协议（HTTPS环境）
2. CORS配置正确

---

## 📞 需要帮助？

如果遇到问题，请提供：
1. Render部署日志
2. 浏览器控制台错误
3. 网络请求详情

---

**祝您部署顺利！** 🎉

