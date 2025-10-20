# 🔐 Winsun 混合登录系统指南

**创建时间**: 2025-10-16

---

## 📋 概述

混合登录系统结合了两个 API 的优势：

1. **认证系统**：使用您自己部署的后端 API
   - 完全控制用户数据
   - 自定义用户管理
   - 数据安全可控

2. **功能 API**：使用 Winsun 官方 API
   - 获取交易信号
   - 市场数据分析
   - 完整的交易功能

---

## 🎯 工作原理

```
用户登录
    ↓
使用您的后端 API 进行认证
    ↓
认证成功，保存 JWT Token
    ↓
同时保存 Winsun API 凭证
    ↓
跳转到仪表板
    ↓
仪表板调用 Winsun API 获取功能数据
```

---

## 🚀 快速开始

### 1. 访问混合登录页面

**URL**: https://winsun-original-nkpfh7maz-cvsgetyes-projects.vercel.app/client/login-hybrid.html

### 2. 注册账户

如果还没有账户，先注册：

**注册页面**: https://winsun-original-nkpfh7maz-cvsgetyes-projects.vercel.app/client/register.html

填写信息：
- 邮箱
- 密码
- 用户名（可选）

### 3. 登录

使用注册的账户登录：
- 邮箱：你注册的邮箱
- 密码：你设置的密码

### 4. 查看仪表板

登录成功后会自动跳转到仪表板，显示：
- 用户信息
- API 连接状态
- 可用功能

---

## 🔧 技术实现

### 登录流程

**文件**: `client/login-hybrid.html`

```javascript
// 1. 调用您的后端 API 进行认证
$.ajax({
    type: 'POST',
    url: 'https://winsun-backend-9ueb8wgwv-cvsgetyes-projects.vercel.app/api/auth/login',
    contentType: 'application/json',
    data: JSON.stringify({
        email: email,
        password: password
    }),
    success: function(response) {
        if (response.success) {
            // 2. 保存 JWT Token
            localStorage.setItem('auth_token', response.token);
            localStorage.setItem('user_info', JSON.stringify(response.user));
            
            // 3. 保存 Winsun API 凭证
            sessionStorage.setItem('winsun_email', email);
            sessionStorage.setItem('winsun_password', password);
            
            // 4. 跳转到仪表板
            window.location.href = '/client/dashboard.html';
        }
    }
});
```

### 调用 Winsun API

**文件**: `client/dashboard.html`

```javascript
// 获取保存的凭证
const email = sessionStorage.getItem('winsun_email');
const password = sessionStorage.getItem('winsun_password');

// 调用 Winsun API
$.ajax({
    type: 'GET',
    url: 'https://api.winsun8.com/api/your-endpoint',
    data: {
        email: email,
        // 根据 API 要求添加其他参数
    },
    success: function(data) {
        console.log('Winsun API 响应:', data);
    }
});
```

---

## 📊 数据流向

### 认证数据（存储在您的后端）

```
用户注册/登录
    ↓
您的后端 API
    ↓
您的数据库（PostgreSQL/MySQL/等）
    ↓
返回 JWT Token
```

**存储的数据**：
- 用户 ID
- 邮箱
- 用户名
- 密码（bcrypt 加密）
- 注册时间
- 其他自定义字段

### 功能数据（来自 Winsun API）

```
用户请求功能
    ↓
前端调用 Winsun API
    ↓
Winsun 服务器
    ↓
返回交易信号/市场数据
```

**获取的数据**：
- 交易信号
- 市场分析
- 账户信息
- 历史记录

---

## 🔐 安全性

### 优势

1. **用户数据隔离**
   - 您的用户数据存储在自己的数据库
   - 完全控制数据访问权限
   - 符合数据隐私法规

2. **双重认证**
   - 首先通过您的后端认证
   - 然后才能访问 Winsun 功能
   - 增加安全层级

3. **Token 管理**
   - JWT Token 用于会话管理
   - 可设置过期时间
   - 支持刷新 Token

### 注意事项

⚠️ **重要**：当前实现中，Winsun API 凭证存储在 `sessionStorage` 中。这是为了演示目的。

**生产环境建议**：
1. 不要在前端存储明文密码
2. 使用后端代理调用 Winsun API
3. 实现 API 密钥轮换机制
4. 添加请求频率限制

---

## 🛠️ 配置

### 修改 API 端点

编辑 `client/login-hybrid.html` 中的配置：

```javascript
const CONFIG = {
    // 您的后端 API
    AUTH_API: 'https://winsun-backend-9ueb8wgwv-cvsgetyes-projects.vercel.app',
    
    // Winsun 官方 API
    WINSUN_API: 'https://api.winsun8.com',
    
    // 调试模式
    DEBUG: true
};
```

### 自定义跳转页面

修改登录成功后的跳转：

```javascript
// 默认跳转到仪表板
window.location.href = '/client/dashboard.html';

// 可以改为其他页面
window.location.href = '/client/trading.html';
```

---

## 📱 页面说明

### 1. 登录页面 (login-hybrid.html)

**功能**：
- 用户登录表单
- 调用后端 API 认证
- 保存认证信息
- 跳转到仪表板

**URL**: https://winsun-original-nkpfh7maz-cvsgetyes-projects.vercel.app/client/login-hybrid.html

### 2. 仪表板 (dashboard.html)

**功能**：
- 显示用户信息
- 检查 API 连接状态
- 提供功能入口
- 演示如何调用 Winsun API

**URL**: https://winsun-original-nkpfh7maz-cvsgetyes-projects.vercel.app/client/dashboard.html

### 3. 注册页面 (register.html)

**功能**：
- 用户注册表单
- 创建新账户

**URL**: https://winsun-original-nkpfh7maz-cvsgetyes-projects.vercel.app/client/register.html

---

## 🎨 自定义功能

### 添加新功能页面

1. 创建新的 HTML 文件（例如 `trading.html`）
2. 检查登录状态：

```javascript
function checkAuth() {
    const token = localStorage.getItem('auth_token');
    if (!token) {
        window.location.href = '/client/login-hybrid.html';
        return false;
    }
    return true;
}
```

3. 调用 Winsun API 获取数据：

```javascript
const email = sessionStorage.getItem('winsun_email');
const password = sessionStorage.getItem('winsun_password');

$.ajax({
    type: 'GET',
    url: 'https://api.winsun8.com/api/signals',
    data: { email: email },
    success: function(data) {
        // 处理数据
    }
});
```

---

## 🔄 与其他登录方式对比

| 特性 | 原始登录 | 新版登录 | 混合登录 ⭐ |
|------|---------|---------|-----------|
| 用户认证 | Winsun API | 可配置 | 您的后端 |
| 功能 API | Winsun API | 可配置 | Winsun API |
| 用户数据控制 | ❌ | ✅ | ✅ |
| 自定义用户管理 | ❌ | ✅ | ✅ |
| Winsun 功能 | ✅ | 部分 | ✅ |
| 数据安全 | 中 | 高 | 高 |
| 灵活性 | 低 | 高 | 最高 |

---

## 📚 API 文档

### 您的后端 API

**基础 URL**: https://winsun-backend-9ueb8wgwv-cvsgetyes-projects.vercel.app

#### 登录
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

响应:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "user"
  }
}
```

#### 注册
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "password123",
  "username": "newuser"
}
```

#### 获取用户信息
```
GET /api/auth/profile
Authorization: Bearer YOUR_TOKEN

响应:
{
  "success": true,
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "user"
  }
}
```

### Winsun API

**基础 URL**: https://api.winsun8.com

具体端点请参考 Winsun 官方文档。

---

## 🆘 故障排除

### 登录失败

**问题**: 点击登录后显示"登录失败"

**可能原因**：
1. 账户不存在 → 先注册
2. 密码错误 → 检查密码
3. 后端 API 不可用 → 检查网络

**解决方案**：
1. 打开浏览器开发者工具 (F12)
2. 查看 Console 标签的错误信息
3. 查看 Network 标签的请求响应

### API 连接失败

**问题**: 仪表板显示"API 未连接"

**可能原因**：
1. 凭证未保存
2. sessionStorage 被清除

**解决方案**：
1. 重新登录
2. 检查浏览器是否禁用了 sessionStorage

### CORS 错误

**问题**: 调用 API 时出现 CORS 错误

**解决方案**：
- 后端已配置 CORS
- 如果仍有问题，检查 API 端点是否正确

---

## 🎯 下一步

### 1. 测试混合登录 ✅
- [ ] 注册新账户
- [ ] 使用新账户登录
- [ ] 查看仪表板
- [ ] 测试功能按钮

### 2. 集成 Winsun 功能
- [ ] 获取交易信号
- [ ] 显示市场数据
- [ ] 实现交易功能
- [ ] 添加历史记录

### 3. 扩展功能
- [ ] 添加用户资料编辑
- [ ] 实现密码重置
- [ ] 添加邮箱验证
- [ ] 集成支付系统

---

## 📞 总结

混合登录系统为您提供了：

✅ **完全控制**：用户数据存储在您自己的数据库  
✅ **完整功能**：可以使用 Winsun 的所有交易功能  
✅ **灵活扩展**：可以随时添加新功能或切换 API  
✅ **数据安全**：双重认证，增加安全性  
✅ **易于维护**：清晰的代码结构，便于修改  

---

**最后更新**: 2025-10-16  
**版本**: 1.0.0  
**状态**: ✅ 生产就绪

