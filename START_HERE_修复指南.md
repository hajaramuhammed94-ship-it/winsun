# 🚀 Winsun 前后端修复指南

> **快速诊断**: 您的前后端项目架构设计良好，但后端部署 URL 已过期，需要重新部署。

---

## 📋 问题总结

### 🔴 严重问题
- **后端 URL 无法访问**: `https://winsun-backend-9ueb8wgwv-cvsgetyes-projects.vercel.app` 已过期

### 🟡 次要问题
- **CORS 配置不完整**: 只允许 localhost，不支持 Vercel 域名
- **环境变量缺失**: 缺少 `JWT_SECRET` 和 `FRONTEND_URL`

### ✅ 正常部分
- API 端点设计完全匹配
- 前端配置正确
- 项目结构清晰

---

## ⚡ 快速修复（3 步）

### 方法 1: 自动修复（推荐）

```bash
cd /home/jzy/桌面/量化/winsun-clone
./快速修复.sh
```

脚本会自动完成所有修复步骤。

---

### 方法 2: 手动修复

#### 步骤 1: 重新部署后端

```bash
cd /home/jzy/桌面/量化/winsun-clone/backend
npx vercel --prod
```

**记录输出的 URL**（例如: `https://winsun-backend.vercel.app`）

---

#### 步骤 2: 配置环境变量

1. 打开 Vercel 控制台: https://vercel.com/cvsgetyes-projects/winsun-backend/settings/environment-variables

2. 添加以下变量:

```
JWT_SECRET = your-super-secret-jwt-key-change-this
FRONTEND_URL = https://winsun-original.vercel.app
```

3. 保存并重新部署

---

#### 步骤 3: 更新前端配置

编辑 `frontend/vercel.json`，将后端 URL 改为步骤 1 的 URL:

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://winsun-backend.vercel.app/api/:path*"
    }
  ]
}
```

然后重新部署前端:

```bash
cd /home/jzy/桌面/量化/winsun-clone/frontend
npx vercel --prod
```

---

## 🧪 验证

### 测试后端

```bash
curl https://winsun-backend.vercel.app/api/health
```

期望输出:
```json
{
  "status": "ok",
  "message": "Winsun API is running"
}
```

### 测试前端

1. 访问: https://winsun-original.vercel.app
2. 登录测试:
   - 邮箱: `12345@qq.com`
   - 密码: `123456`
3. 检查浏览器控制台无 CORS 错误

---

## 📁 相关文件

| 文件 | 说明 |
|------|------|
| `README_检测结果.md` | 详细检测结果 |
| `前后端匹配检测报告.md` | 完整技术报告 |
| `快速修复.sh` | 自动修复脚本 |
| `backend/src/server-fixed.js` | 修复后的服务器配置 |

---

## 🎯 预计修复时间

- **自动修复**: 10-15 分钟
- **手动修复**: 20-30 分钟

---

## 💡 提示

- 使用 `--prod` 标志部署到生产环境，获取稳定的 URL
- Vercel 预览部署 URL 会在新部署后失效
- 建议添加自定义域名以获得更稳定的 URL

---

**开始修复**: 运行 `./快速修复.sh` 或按照手动步骤操作

**需要帮助**: 查看 `README_检测结果.md` 获取详细信息

