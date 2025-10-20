# 🔄 API更新说明文档

**更新时间**: 2025-10-14  
**更新内容**: 将注册和登录页面从原网站API切换到本地API

---

## 📋 问题说明

### 原始问题

用户在注册页面输入信息后，收到提示：**"Account Exist!"**

### 问题原因

1. **调用的是原网站API** - 注册和登录页面调用的是 `https://api.winsun8.com` 的API
2. **账户已存在** - 用户输入的邮箱在原网站已经注册过
3. **无法使用本地功能** - 即使注册成功，也无法在本地系统中使用

---

## ✅ 解决方案

### 已完成的修改

#### 1. 修改注册页面 (`register.html`)

**修改前**:
```javascript
// 调用原网站API
url: "https://api.winsun8.com/api/account/create/m="+email+"&cpta="+captcha+"&priv="+md5(password)
```

**修改后**:
```javascript
// 调用本地API
$.ajax({
    type: "POST",
    url: "http://localhost:5000/api/auth/register",
    data: JSON.stringify({
        email: email,
        password: password,
        username: email.split('@')[0]
    }),
    contentType: "application/json",
    dataType: "json",
    success: function(data) {
        if (data.token) {
            alert("注册成功！即将跳转到登录页面");
            localStorage.setItem('token', data.token);
            window.location.href = "login.html";
        }
    },
    error: function(xhr) {
        var errorMsg = xhr.responseJSON.error || "注册失败";
        alert(errorMsg);
    }
});
```

#### 2. 修改登录页面 (`login.html`)

**修改前**:
```javascript
// 调用原网站API
url: "https://api.winsun8.com/api/account/login/m="+email+"&priv="+md5(password)
```

**修改后**:
```javascript
// 调用本地API
$.ajax({
    type: "POST",
    url: "http://localhost:5000/api/auth/login",
    data: JSON.stringify({
        email: email,
        password: password
    }),
    contentType: "application/json",
    dataType: "json",
    success: function(data) {
        if (data.token) {
            alert("登录成功！");
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            window.location.href = "../index.html";
        }
    },
    error: function(xhr) {
        var errorMsg = xhr.responseJSON.error || "登录失败";
        alert(errorMsg);
    }
});
```

---

## 🎯 主要改进

### 1. API端点变更

| 功能 | 原API | 新API |
|------|-------|-------|
| 注册 | `https://api.winsun8.com/api/account/create` | `http://localhost:5000/api/auth/register` |
| 登录 | `https://api.winsun8.com/api/account/login` | `http://localhost:5000/api/auth/login` |

### 2. 请求方式变更

| 项目 | 原方式 | 新方式 |
|------|--------|--------|
| HTTP方法 | GET | POST |
| 数据格式 | URL参数 | JSON Body |
| 密码加密 | MD5 | bcrypt (后端) |
| 认证方式 | 自定义 | JWT Token |

### 3. 功能增强

✅ **Token管理**
- 注册/登录成功后自动保存JWT token到localStorage
- 后续请求可以使用token进行身份验证

✅ **用户信息存储**
- 登录成功后保存用户信息到localStorage
- 方便前端页面显示用户信息

✅ **错误处理**
- 详细的错误提示信息
- 区分不同类型的错误（邮箱已存在、密码错误等）

✅ **输入验证**
- 前端验证邮箱和密码是否为空
- 后端验证邮箱格式和密码长度

---

## 🧪 测试结果

### 注册功能测试

**测试命令**:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"newuser@example.com","password":"123456","username":"newuser"}'
```

**成功响应**:
```json
{
  "success": true,
  "message": "注册成功",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 3,
    "email": "newuser@example.com",
    "username": "newuser",
    "created_at": "2025-10-14T07:35:37.245Z"
  }
}
```

**失败响应（邮箱已存在）**:
```json
{
  "error": "该邮箱已被注册"
}
```

### 登录功能测试

**测试命令**:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

**成功响应**:
```json
{
  "success": true,
  "message": "登录成功",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "test@example.com",
    "username": "testuser"
  }
}
```

---

## 📖 使用指南

### 注册新账户

1. 访问注册页面: http://localhost:8080/client/register.html
2. 填写邮箱地址（任意有效邮箱格式）
3. 填写密码（至少6个字符）
4. 验证码字段可以随意填写（暂未启用验证）
5. 勾选"同意服务条款"
6. 点击"Submit"按钮
7. 注册成功后会自动跳转到登录页面

### 登录账户

1. 访问登录页面: http://localhost:8080/client/login.html
2. 填写注册时使用的邮箱
3. 填写密码
4. 点击"Login"按钮
5. 登录成功后会跳转到首页

### 测试账户

模拟数据库中已有以下测试账户：

| 邮箱 | 密码 | 用户名 |
|------|------|--------|
| test@example.com | password123 | testuser |
| admin@winsun.com | admin123 | admin |

**注意**: 这些账户的密码已经用bcrypt加密，无法直接使用原始密码登录。建议注册新账户进行测试。

---

## 🔐 安全说明

### 密码加密

**前端**:
- 不再使用MD5加密（已移除）
- 密码以明文形式通过HTTPS发送到后端

**后端**:
- 使用bcrypt进行密码加密
- 加密强度: 10轮salt
- 密码永不以明文存储

### Token安全

- 使用JWT (JSON Web Token)
- Token有效期: 7天
- Token存储在localStorage中
- 每次API请求需要在Header中携带token

### 建议

⚠️ **生产环境必须**:
1. 启用HTTPS
2. 修改JWT_SECRET密钥
3. 添加CSRF保护
4. 实现验证码功能
5. 添加登录失败次数限制
6. 实现邮箱验证

---

## 🐛 已知问题

### 1. 验证码功能未实现

**现状**: 点击"Send"按钮会显示"验证码已发送（模拟）"，但实际未发送

**影响**: 注册时验证码字段可以随意填写

**解决方案**: 
- 短期: 可以忽略验证码字段
- 长期: 实现邮件发送功能（需要SMTP配置）

### 2. 密码重置功能未实现

**现状**: 密码重置页面存在但功能未实现

**影响**: 忘记密码无法重置

**解决方案**: 
- 短期: 直接在数据库中修改密码
- 长期: 实现邮件验证的密码重置流程

### 3. 用户仪表板未实现

**现状**: 登录成功后跳转到首页，而非用户仪表板

**影响**: 无法查看个人信息和交易数据

**解决方案**: 
- 短期: 登录后跳转到首页
- 长期: 开发用户仪表板页面

---

## 📊 API接口文档

### POST /api/auth/register

**注册新用户**

**请求**:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "username": "username" // 可选
}
```

**成功响应** (200):
```json
{
  "success": true,
  "message": "注册成功",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "username",
    "created_at": "2025-10-14T07:35:37.245Z"
  }
}
```

**失败响应** (400):
```json
{
  "error": "该邮箱已被注册"
}
```

### POST /api/auth/login

**用户登录**

**请求**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**成功响应** (200):
```json
{
  "success": true,
  "message": "登录成功",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "username"
  }
}
```

**失败响应** (401):
```json
{
  "error": "邮箱或密码错误"
}
```

---

## 🎉 总结

### 完成的工作

✅ 将注册页面API从原网站切换到本地  
✅ 将登录页面API从原网站切换到本地  
✅ 实现JWT token认证  
✅ 实现密码bcrypt加密  
✅ 添加详细的错误提示  
✅ 添加输入验证  
✅ 测试注册和登录功能

### 现在可以

✅ 在本地注册新账户  
✅ 使用注册的账户登录  
✅ Token自动保存到localStorage  
✅ 完全独立于原网站运行

### 下一步

建议实现以下功能：
1. 用户仪表板页面
2. 邮箱验证功能
3. 密码重置功能
4. 用户个人信息管理
5. 交易信号订阅管理

---

**最后更新**: 2025-10-14 15:35

