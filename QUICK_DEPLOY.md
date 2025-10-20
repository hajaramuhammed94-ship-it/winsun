# ⚡ 10分钟快速部署指南

## 🎯 目标

将Winsun项目完整部署到公网，让前后端都能正常工作。

---

## ✅ 已完成

**前端**: https://winsun-frontend-52l2glgez-cvsgetyes-projects.vercel.app ✅

---

## 🚀 现在开始部署后端

### 方法1: 使用Render.com (推荐 - 最简单)

#### 第1步: 准备GitHub仓库 (5分钟)

```bash
cd /home/jzy/桌面/量化/winsun-clone

# 初始化Git
git init
git add .
git commit -m "Initial commit - Winsun project"

# 在GitHub创建仓库后运行（替换YOUR_USERNAME）
git remote add origin https://github.com/YOUR_USERNAME/winsun-clone.git
git branch -M main
git push -u origin main
```

**GitHub创建仓库**:
1. 访问 https://github.com/new
2. 仓库名: `winsun-clone`
3. 设置为Private
4. 点击"Create repository"

---

#### 第2步: 在Render部署后端 (3分钟)

1. **访问** https://render.com/
2. **登录** 使用GitHub账户
3. **创建服务**:
   - 点击 "New +" → "Web Service"
   - 选择 `winsun-clone` 仓库
   - 点击 "Connect"

4. **配置服务**:
   ```
   Name: winsun-backend
   Region: Singapore
   Root Directory: backend
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   Instance Type: Free
   ```

5. **添加环境变量** (点击"Advanced"):
   ```
   PORT=5000
   NODE_ENV=production
   JWT_SECRET=winsun-super-secret-key-2024
   FRONTEND_URL=https://winsun-frontend-52l2glgez-cvsgetyes-projects.vercel.app
   ```

6. **部署**:
   - 点击 "Create Web Service"
   - 等待3-5分钟
   - 记录您的后端URL，例如: `https://winsun-backend.onrender.com`

---

#### 第3步: 更新前端配置 (2分钟)

编辑 `frontend/vercel.json`，将后端URL更新：

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

重新部署前端：

```bash
cd /home/jzy/桌面/量化/winsun-clone/frontend
npx vercel --prod
```

---

#### 第4步: 测试 (1分钟)

1. **访问前端**: https://winsun-frontend-52l2glgez-cvsgetyes-projects.vercel.app
2. **登录**:
   - 邮箱: `12345@qq.com`
   - 密码: `123456`
3. **检查**:
   - Dashboard是否显示数据
   - Live Signals是否接收消息

---

## 🎉 完成！

如果一切正常，您的应用已经完全部署到公网了！

---

## 📋 部署检查清单

- [ ] GitHub仓库已创建
- [ ] 代码已推送到GitHub
- [ ] Render账户已注册
- [ ] 后端Web Service已创建
- [ ] 环境变量已配置（包括FRONTEND_URL）
- [ ] 后端部署成功
- [ ] 记录后端URL
- [ ] 更新frontend/vercel.json
- [ ] 重新部署前端
- [ ] 测试登录功能
- [ ] 测试Dashboard
- [ ] 测试WebSocket

---

## ⚠️ 重要提示

### Render Free Tier限制

- ✅ 完全免费
- ⚠️ 15分钟无活动后会休眠
- ⚠️ 首次访问需要30秒唤醒

### 解决休眠问题

使用 UptimeRobot (https://uptimerobot.com/) 每5分钟ping一次：

```
https://winsun-backend.onrender.com/api/health
```

---

## 🔧 故障排除

### 问题1: 前端无法连接后端

**检查**:
1. `frontend/vercel.json` 中的后端URL是否正确
2. Render后端是否部署成功
3. 浏览器控制台是否有CORS错误

**解决**:
- 确保 `FRONTEND_URL` 环境变量设置正确
- 重新部署后端

### 问题2: WebSocket连接失败

**检查**:
1. 后端是否支持WebSocket
2. 是否使用wss://协议

**解决**:
- Render自动支持WebSocket
- 确保前端使用正确的WebSocket URL

### 问题3: 后端一直休眠

**解决**:
- 使用UptimeRobot保持活跃
- 或升级到Render付费套餐

---

## 📞 需要帮助？

查看详细文档:
- `BACKEND_DEPLOYMENT_GUIDE.md` - 完整后端部署指南
- `DEPLOYMENT_SUMMARY.md` - 部署总结
- `VERCEL_DEPLOYMENT_GUIDE.md` - Vercel部署指南

---

**祝您部署顺利！** 🎉

