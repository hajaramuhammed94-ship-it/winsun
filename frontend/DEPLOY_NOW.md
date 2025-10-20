# 🚀 立即部署到Vercel - 操作指南

## 📋 您的账户信息

- **邮箱**: iwayjws74857@outlook.com
- **密码**: iwayjws74857-2713
- **Vercel项目**: https://vercel.com/cvsgetyes-projects

---

## ⚡ 快速部署（在新终端执行）

### 步骤1: 打开新终端

按 `Ctrl+Alt+T` 打开新终端

### 步骤2: 进入项目目录

```bash
cd /home/jzy/桌面/量化/winsun-clone/frontend
```

### 步骤3: 登录Vercel

```bash
npx vercel login
```

**操作**:
1. 看到 `Ok to proceed? (y)` → 输入 `y` 并回车
2. 等待安装完成（约1-2分钟）
3. 看到登录选项 → 选择 **Email**
4. 输入邮箱: `iwayjws74857@outlook.com`
5. 检查邮箱，点击验证链接
6. 返回终端，看到 `Success!` 表示登录成功

### 步骤4: 部署到Vercel

```bash
npx vercel --prod
```

**部署过程中的选择**:

```
? Set up and deploy "~/桌面/量化/winsun-clone/frontend"? 
→ 输入: Y

? Which scope do you want to deploy to?
→ 选择: cvsgetyes-projects

? Link to existing project?
→ 输入: N

? What's your project's name?
→ 输入: winsun-frontend

? In which directory is your code located?
→ 输入: ./

? Want to modify these settings?
→ 输入: N
```

### 步骤5: 等待部署完成

部署成功后会显示：

```
✅ Production: https://winsun-frontend.vercel.app [copied to clipboard]
```

---

## 🎯 部署后的URL

您的前端将部署到类似这样的地址：

- **生产环境**: https://winsun-frontend.vercel.app
- **或者**: https://winsun-frontend-xxx.vercel.app

---

## ⚠️ 重要：部署后需要做的事

### 1. 后端还未部署

前端已部署，但后端还在本地（localhost:5000）。

**前端无法连接到本地后端**，所以您需要：

#### 选项A: 部署后端到Railway（推荐）

```bash
# 在新终端
cd /home/jzy/桌面/量化/winsun-clone/backend

# 安装Railway CLI
npm install -g @railway/cli

# 登录Railway
railway login

# 初始化项目
railway init

# 部署
railway up

# 获取部署URL
railway domain
```

#### 选项B: 部署后端到Render

1. 访问 https://render.com
2. 注册/登录账户
3. 点击 "New +" → "Web Service"
4. 连接GitHub仓库（需要先push代码到GitHub）
5. 选择 `backend` 目录
6. 设置：
   - **Build Command**: `npm install`
   - **Start Command**: `node src/server.js`
   - **Environment**: Node
7. 点击 "Create Web Service"

### 2. 更新前端API代理

后端部署后，获取后端URL（例如：`https://winsun-backend.railway.app`）

然后更新 `frontend/vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://winsun-backend.railway.app/api/:path*"
    }
  ]
}
```

重新部署前端：

```bash
npx vercel --prod
```

### 3. 更新后端CORS

编辑 `backend/src/server.js`，添加Vercel域名：

```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://winsun-frontend.vercel.app',
    'https://winsun-frontend-*.vercel.app'
  ],
  credentials: true
}));
```

重新部署后端。

---

## 🐛 常见问题

### Q: 邮箱验证链接在哪里？

检查 `iwayjws74857@outlook.com` 的收件箱和垃圾邮件文件夹。

### Q: 部署后前端打不开？

1. 检查构建是否成功
2. 查看Vercel Dashboard的部署日志
3. 确认 `dist` 目录已生成

### Q: API请求失败？

这是正常的！因为后端还在本地。需要先部署后端。

### Q: 如何查看部署日志？

访问: https://vercel.com/cvsgetyes-projects/winsun-frontend

---

## 📊 部署检查清单

- [ ] Vercel CLI已安装
- [ ] 已登录Vercel账户（邮箱验证）
- [ ] 前端已部署到Vercel
- [ ] 获得前端URL
- [ ] 后端已部署（Railway/Render）
- [ ] 获得后端URL
- [ ] 更新vercel.json中的API代理
- [ ] 更新后端CORS设置
- [ ] 重新部署前端
- [ ] 测试登录功能

---

## 🎉 成功标志

当您看到以下内容时，说明部署成功：

```
✅ Production: https://winsun-frontend.vercel.app
```

访问这个URL，您应该能看到登录页面（但登录会失败，因为后端还未部署）。

---

## 📞 需要帮助？

如果遇到问题，请告诉我：

1. 在哪一步遇到问题
2. 错误信息是什么
3. 截图（如果可能）

---

**祝您部署顺利！** 🚀

