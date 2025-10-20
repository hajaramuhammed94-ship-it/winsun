# 🔌 使用自定义 API 指南

本指南将帮助你配置 Winsun 前端使用你自己的用户 API。

---

## 📋 目录

1. [快速开始](#快速开始)
2. [API 配置选项](#api-配置选项)
3. [使用已部署的后端 API](#使用已部署的后端-api)
4. [使用自定义 API](#使用自定义-api)
5. [API 响应格式](#api-响应格式)
6. [完整示例](#完整示例)
7. [故障排查](#故障排查)

---

## 🚀 快速开始

### 步骤 1: 选择登录页面

我们创建了两个登录页面：

| 页面 | 说明 | URL |
|------|------|-----|
| **login.html** | 原始页面，使用 Winsun 官方 API | `/client/login.html` |
| **login-new.html** | 新页面，支持多种 API 配置 | `/client/login-new.html` |

**推荐使用**: `login-new.html`

### 步骤 2: 编辑配置文件

打开 `client/config.js` 文件，找到这一行：

```javascript
USE_API: 'CUSTOM', // 可选值: 'ORIGINAL', 'DEPLOYED', 'CUSTOM'
```

修改为你想使用的 API：
- `'ORIGINAL'` - 使用 Winsun 官方 API
- `'DEPLOYED'` - 使用你部署的后端 API
- `'CUSTOM'` - 使用你自己的 API

### 步骤 3: 配置 API 端点

根据你选择的 API 类型，配置相应的端点。

---

## ⚙️ API 配置选项

### 选项 1: 使用原始 Winsun API

```javascript
USE_API: 'ORIGINAL'
```

**特点**:
- ✅ 无需修改配置
- ✅ 使用 GET 请求
- ✅ 密码使用 MD5 加密
- ⚠️ 依赖 Winsun 官方服务器

**API 端点**:
```
https://api.winsun8.com/api/account/login/m={email}&priv={password_hash}
```

---

### 选项 2: 使用已部署的后端 API

```javascript
USE_API: 'DEPLOYED'
```

**特点**:
- ✅ 使用你自己部署的后端
- ✅ 使用 POST 请求
- ✅ 支持 JWT 认证
- ✅ 密码在后端使用 bcrypt 加密

**API 端点**:
```
https://winsun-backend-9ueb8wgwv-cvsgetyes-projects.vercel.app/api/auth/login
```

**请求格式**:
```json
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**响应格式**:
```json
{
  "success": true,
  "message": "登录成功",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "user",
    "full_name": "User Name"
  }
}
```

---

### 选项 3: 使用自定义 API

```javascript
USE_API: 'CUSTOM'
```

**步骤**:

#### 1. 配置 API 基础 URL

在 `config.js` 中找到 `CUSTOM` 配置：

```javascript
CUSTOM: {
    // 👇 修改这里为你的 API 地址
    baseUrl: 'https://your-api.example.com',
    
    endpoints: {
        login: '/api/auth/login',
        register: '/api/auth/register',
        profile: '/api/auth/profile'
    },
    
    // ...
}
```

#### 2. 配置请求方法

```javascript
// 👇 修改这里为你的 API 请求方法
method: 'POST',  // 或 'GET'
```

#### 3. 配置密码加密方式

```javascript
// 👇 修改这里为你的密码加密方式
passwordEncryption: 'BCRYPT',  // 可选: 'NONE', 'MD5', 'BCRYPT', 'SHA256'
```

| 加密方式 | 说明 |
|---------|------|
| `'NONE'` | 明文传输（不推荐） |
| `'MD5'` | 前端使用 MD5 加密 |
| `'BCRYPT'` | 后端加密（推荐） |
| `'SHA256'` | 前端使用 SHA256 加密 |

#### 4. 配置响应格式

```javascript
// 👇 修改这里为你的 API 响应格式
responseFormat: 'JWT',  // 可选: 'ORIGINAL', 'JWT', 'CUSTOM'
```

---

## 📊 API 响应格式

### 格式 1: ORIGINAL (Winsun 原始格式)

```json
{
  "status": "ok",
  "rsp": "登录成功"
}
```

或错误时：
```json
{
  "status": "error",
  "rsp": "邮箱或密码错误"
}
```

### 格式 2: JWT (标准 JWT 格式)

成功时：
```json
{
  "success": true,
  "message": "登录成功",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "user"
  }
}
```

失败时：
```json
{
  "success": false,
  "error": "邮箱或密码错误"
}
```

### 格式 3: CUSTOM (自定义格式)

如果你的 API 使用不同的字段名，配置字段映射：

```javascript
customResponseMapping: {
    // 成功标识字段
    successField: 'ok',        // 你的 API 中表示成功的字段名
    successValue: 1,           // 成功时的值
    
    // Token 字段
    tokenField: 'access_token', // 你的 API 中 token 的字段名
    
    // 用户信息字段
    userField: 'data',         // 你的 API 中用户信息的字段名
    
    // 错误信息字段
    errorField: 'msg',         // 你的 API 中错误信息的字段名
}
```

**示例**: 如果你的 API 返回：
```json
{
  "ok": 1,
  "msg": "登录成功",
  "access_token": "abc123...",
  "data": {
    "user_id": 1,
    "email": "user@example.com"
  }
}
```

配置为：
```javascript
customResponseMapping: {
    successField: 'ok',
    successValue: 1,
    tokenField: 'access_token',
    userField: 'data',
    errorField: 'msg'
}
```

---

## 💡 完整示例

### 示例 1: 使用 Laravel API

```javascript
USE_API: 'CUSTOM',

APIS: {
    CUSTOM: {
        baseUrl: 'https://api.myapp.com',
        endpoints: {
            login: '/api/v1/login',
            register: '/api/v1/register',
            profile: '/api/v1/user'
        },
        method: 'POST',
        passwordEncryption: 'NONE',  // Laravel 后端加密
        responseFormat: 'CUSTOM',
        customResponseMapping: {
            successField: 'success',
            successValue: true,
            tokenField: 'access_token',
            userField: 'user',
            errorField: 'message'
        }
    }
}
```

### 示例 2: 使用 Django REST API

```javascript
USE_API: 'CUSTOM',

APIS: {
    CUSTOM: {
        baseUrl: 'https://api.myapp.com',
        endpoints: {
            login: '/api/auth/login/',
            register: '/api/auth/register/',
            profile: '/api/auth/user/'
        },
        method: 'POST',
        passwordEncryption: 'NONE',
        responseFormat: 'CUSTOM',
        customResponseMapping: {
            successField: 'status',
            successValue: 'success',
            tokenField: 'token',
            userField: 'user',
            errorField: 'error'
        }
    }
}
```

### 示例 3: 使用 Express + JWT API

```javascript
USE_API: 'CUSTOM',

APIS: {
    CUSTOM: {
        baseUrl: 'https://api.myapp.com',
        endpoints: {
            login: '/auth/login',
            register: '/auth/register',
            profile: '/auth/me'
        },
        method: 'POST',
        passwordEncryption: 'BCRYPT',
        responseFormat: 'JWT'  // 使用标准 JWT 格式
    }
}
```

---

## 🔧 故障排查

### 问题 1: CORS 错误

**错误信息**:
```
Access to XMLHttpRequest at 'https://api.example.com' from origin 'https://winsun-original.vercel.app' has been blocked by CORS policy
```

**解决方案**:
在你的后端 API 添加 CORS 头：

```javascript
// Express.js 示例
const cors = require('cors');
app.use(cors({
    origin: 'https://winsun-original-qggcbglpw-cvsgetyes-projects.vercel.app',
    credentials: true
}));
```

### 问题 2: 登录失败，无错误提示

**检查步骤**:
1. 打开浏览器开发者工具 (F12)
2. 切换到 Console 标签
3. 查看是否有错误信息
4. 切换到 Network 标签
5. 查看登录请求的响应

**启用调试模式**:
在 `config.js` 中设置：
```javascript
DEBUG: true
```

### 问题 3: Token 未保存

**检查 Token 存储**:
```javascript
// 在浏览器控制台执行
console.log(localStorage.getItem('winsun_auth_token'));
console.log(localStorage.getItem('winsun_user_info'));
```

**修改存储位置**:
```javascript
TOKEN_STORAGE: 'localStorage',  // 或 'sessionStorage'
```

### 问题 4: 密码加密不匹配

**症状**: 登录总是失败，提示密码错误

**解决方案**:
确保前端加密方式与后端匹配：

| 后端加密方式 | 前端配置 |
|------------|---------|
| bcrypt | `passwordEncryption: 'BCRYPT'` 或 `'NONE'` |
| MD5 | `passwordEncryption: 'MD5'` |
| SHA256 | `passwordEncryption: 'SHA256'` |
| 明文 | `passwordEncryption: 'NONE'` |

---

## 📝 测试你的配置

### 1. 测试登录 API

在浏览器控制台执行：

```javascript
// 测试登录
$.ajax({
    url: 'https://your-api.example.com/api/auth/login',
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
    }),
    success: function(data) {
        console.log('成功:', data);
    },
    error: function(xhr, status, error) {
        console.error('失败:', error);
        console.log('响应:', xhr.responseJSON);
    }
});
```

### 2. 测试配置

访问新登录页面：
```
https://winsun-original-qggcbglpw-cvsgetyes-projects.vercel.app/client/login-new.html
```

打开浏览器控制台，应该看到：
```
==================================================
Winsun 登录系统
当前使用 API: CUSTOM
API 地址: https://your-api.example.com
==================================================
```

---

## 🎯 下一步

1. ✅ 配置你的 API 端点
2. ✅ 测试登录功能
3. ✅ 配置注册页面（类似登录页面）
4. ✅ 部署到 Vercel

---

## 📚 相关文档

- **后端 API 文档**: `winsun-clone/backend/README.md`
- **部署指南**: `DEPLOYMENT_SUCCESS.md`
- **快速访问**: `QUICK_ACCESS.md`

---

**需要帮助？** 查看控制台日志或联系技术支持。

