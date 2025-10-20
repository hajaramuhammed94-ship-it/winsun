# 🚀 Winsun 快速访问指南

## 📱 立即访问

### 🎯 主要网站

#### 1. 原始静态页面（完整版）⭐ 推荐
**URL**: https://winsun-original-1wm8y3x2b-cvsgetyes-projects.vercel.app

**功能**：
- ✅ 原始网站完整克隆
- ✅ 所有图片资源（31张图片 + 3.6MB GIF动画）
- ✅ 所有 CSS 和 JS 文件
- ✅ 完整页面布局和动画效果
- ✅ **新增**: 支持多种 API 配置（Winsun 官方 / 自己的后端 / 自定义 API）

**测试账户**：
```
邮箱: 12345@qq.com
密码: 123456
```

**重要页面**：
- **登录 (新版)**: https://winsun-original-1wm8y3x2b-cvsgetyes-projects.vercel.app/client/login-new.html ⭐
  - 支持切换使用不同的 API
  - 当前默认使用 Winsun 官方 API
  - 可在 `config.js` 中配置
- **登录 (原始)**: https://winsun-original-1wm8y3x2b-cvsgetyes-projects.vercel.app/client/login.html
  - 使用 Winsun 官方 API
- **注册**: https://winsun-original-1wm8y3x2b-cvsgetyes-projects.vercel.app/client/register.html
- **仪表板**: https://winsun-original-1wm8y3x2b-cvsgetyes-projects.vercel.app/client/dashboard.html

---

#### 2. 后端 API
**URL**: https://winsun-backend-9ueb8wgwv-cvsgetyes-projects.vercel.app

**认证端点**：
```bash
# 用户登录
curl -X POST https://winsun-backend-9ueb8wgwv-cvsgetyes-projects.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# 用户注册
curl -X POST https://winsun-backend-9ueb8wgwv-cvsgetyes-projects.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"newuser@example.com","password":"password123","username":"newuser"}'

# 获取用户信息
curl -X GET https://winsun-backend-9ueb8wgwv-cvsgetyes-projects.vercel.app/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**其他端点**：
```bash
# 健康检查
curl https://winsun-backend-9ueb8wgwv-cvsgetyes-projects.vercel.app/health

# 获取交易信号
curl https://winsun-backend-9ueb8wgwv-cvsgetyes-projects.vercel.app/api/signals
```

---

## ⚙️ API 配置指南

### 快速切换 API

编辑 `frontend-static/client/config.js` 文件：

```javascript
USE_API: 'DEPLOYED',  // 可选: 'ORIGINAL', 'DEPLOYED', 'CUSTOM'
```

### 可用选项

| 选项 | 说明 | 适用场景 |
|------|------|---------|
| `ORIGINAL` | Winsun 官方 API | 测试原始功能 |
| `DEPLOYED` | 你部署的后端 API | 使用自己的用户系统 ⭐ 当前默认 |
| `CUSTOM` | 自定义 API | 连接其他后端服务 |

### 详细配置

查看完整的 API 配置指南：
- **文档**: [CUSTOM_API_GUIDE.md](CUSTOM_API_GUIDE.md)
- **配置文件**: `frontend-static/client/config.js`

---

## 🎛️ Vercel Dashboard

**访问**: https://vercel.com/cvsgetyes-projects

**账户信息**：
- 邮箱: iwayjws74857@outlook.com
- 用户名: iwayjws74857-2713

**项目列表**：
1. [winsun-frontend](https://vercel.com/cvsgetyes-projects/winsun-frontend)
2. [winsun-backend](https://vercel.com/cvsgetyes-projects/winsun-backend)
3. [winsun-original](https://vercel.com/cvsgetyes-projects/winsun-original)

---

## 🔄 重新部署

### 方法 1: 使用 CLI（推荐）

```bash
# 进入项目目录
cd /home/jzy/桌面/量化/winsun-clone

# 部署前端
cd frontend
vercel --prod

# 部署后端
cd ../backend
vercel --prod

# 部署原始页面
cd ../frontend-static
vercel --prod
```

### 方法 2: 使用 Dashboard

1. 访问 https://vercel.com/cvsgetyes-projects
2. 选择项目
3. 点击 "Redeploy"

---

## 📊 项目状态检查

```bash
# 检查 Vercel 登录状态
vercel whoami

# 查看项目列表
vercel list

# 查看部署日志
vercel logs winsun-frontend
vercel logs winsun-backend
vercel logs winsun-original
```

---

## 🛠️ 本地开发

### 启动所有服务

```bash
# 终端 1: 启动后端
cd /home/jzy/桌面/量化/winsun-clone/backend
npm run dev

# 终端 2: 启动前端
cd /home/jzy/桌面/量化/winsun-clone/frontend
npm run dev
```

**本地访问**：
- 前端: http://localhost:3000
- 后端: http://localhost:5000

---

## 📝 常用命令

### Vercel CLI

```bash
# 登录
vercel login

# 部署到预览环境
vercel

# 部署到生产环境
vercel --prod

# 查看部署详情
vercel inspect <deployment-url>

# 查看日志
vercel logs <deployment-url>

# 删除部署
vercel remove <deployment-url>
```

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

---

## 🔗 重要链接

| 名称 | URL |
|------|-----|
| **主前端** | https://winsun-frontend-8i7way45f-cvsgetyes-projects.vercel.app |
| **原始页面（完整版）** | https://winsun-original-qikzq2slq-cvsgetyes-projects.vercel.app |
| **后端 API** | https://winsun-backend-9ueb8wgwv-cvsgetyes-projects.vercel.app |
| **Vercel Dashboard** | https://vercel.com/cvsgetyes-projects |
| **原始网站** | https://www.winsun8.com/ |

---

## 📞 支持

如有问题，请查看：
- [部署成功文档](./DEPLOYMENT_SUCCESS.md)
- [完整 README](./README.md)
- [技术分析](./TECHNICAL_ANALYSIS.md)
- [Vercel 文档](https://vercel.com/docs)

---

**最后更新**: 2025-10-16  
**部署状态**: ✅ 全部成功

