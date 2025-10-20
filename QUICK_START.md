# 🚀 Winsun 快速启动指南

这是一个5分钟快速启动指南，帮助您立即运行Winsun项目。

---

## ⚡ 超快速启动（3步）

如果您已经安装了Node.js和PostgreSQL：

```bash
# 1. 安装依赖
./install.sh

# 2. 创建数据库并初始化
createdb winsun_db
cd backend && npm run db:migrate && cd ..

# 3. 启动项目
./start.sh
```

然后访问 http://localhost:8080 🎉

---

## 📋 详细步骤

### 前置要求检查

确保您已安装：
- ✅ Node.js (>= 14.x)
- ✅ PostgreSQL (>= 12.x)
- ✅ npm 或 yarn

**检查命令：**
```bash
node -v    # 应显示 v14.x 或更高
npm -v     # 应显示版本号
psql --version  # 应显示 PostgreSQL 版本
```

---

### 步骤 1: 克隆/下载项目

如果您还没有项目文件：
```bash
cd /home/jzy/桌面/量化/winsun-clone
```

---

### 步骤 2: 安装依赖

运行自动安装脚本：
```bash
./install.sh
```

或手动安装：
```bash
# 安装后端依赖
cd backend
npm install

# 安装前端依赖
cd ../frontend
npm install

cd ..
```

---

### 步骤 3: 配置数据库

#### 3.1 创建数据库

**方法1 - 使用命令行：**
```bash
createdb winsun_db
```

**方法2 - 使用psql：**
```bash
psql -U postgres
CREATE DATABASE winsun_db;
\q
```

#### 3.2 配置数据库连接

编辑 `backend/.env` 文件：
```bash
nano backend/.env
```

修改以下配置（如果需要）：
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=winsun_db
DB_USER=postgres
DB_PASSWORD=your_password  # 改成您的PostgreSQL密码
```

#### 3.3 初始化数据库

```bash
cd backend
npm run db:migrate
cd ..
```

您应该看到：
```
✅ 数据库表创建成功！
✅ 种子数据填充成功！
🎉 数据库迁移完成！
```

---

### 步骤 4: 启动服务

#### 方法1 - 使用启动脚本（推荐）

```bash
./start.sh
```

#### 方法2 - 手动启动

**终端1 - 启动后端：**
```bash
cd backend
npm run dev
```

**终端2 - 启动前端：**
```bash
cd frontend
npm start
```

---

### 步骤 5: 访问网站

打开浏览器访问：

- **中文首页**: http://localhost:8080/
- **英文首页**: http://localhost:8080/en
- **登录页面**: http://localhost:8080/client/login.html
- **注册页面**: http://localhost:8080/client/register.html
- **API健康检查**: http://localhost:5000/api/health

---

## 🧪 测试功能

### 1. 测试API

运行API测试脚本：
```bash
./test-api.sh
```

### 2. 测试用户注册

1. 访问 http://localhost:8080/client/register.html
2. 填写注册表单：
   - 邮箱: test@example.com
   - 密码: 123456
3. 点击注册
4. 应该看到"注册成功"提示

### 3. 测试用户登录

1. 访问 http://localhost:8080/client/login.html
2. 使用刚才注册的账号登录
3. 应该看到"登录成功"提示并跳转

### 4. 测试Newsletter订阅

1. 在首页底部找到Newsletter订阅表单
2. 输入邮箱地址
3. 点击"subscribe"
4. 应该看到"订阅成功"提示

---

## 🛑 停止服务

```bash
./stop.sh
```

或手动停止：
```bash
# 查找进程
ps aux | grep node

# 停止进程
kill <PID>
```

---

## 🔍 故障排除

### 问题1: 端口被占用

**错误信息**: `Error: listen EADDRINUSE: address already in use :::5000`

**解决方案**:
```bash
# 查找占用端口的进程
lsof -i :5000
lsof -i :8080

# 停止进程
kill -9 <PID>
```

或修改端口：
```bash
# 修改后端端口
nano backend/.env
# 将 PORT=5000 改为 PORT=5001

# 修改前端端口
nano frontend/server.js
# 将 PORT = 8080 改为 8081
```

---

### 问题2: 数据库连接失败

**错误信息**: `Error: connect ECONNREFUSED 127.0.0.1:5432`

**解决方案**:

1. 确保PostgreSQL正在运行：
```bash
# Ubuntu/Debian
sudo systemctl status postgresql
sudo systemctl start postgresql

# macOS
brew services start postgresql

# Windows
# 在服务管理器中启动PostgreSQL服务
```

2. 检查数据库配置：
```bash
psql -U postgres -d winsun_db
# 如果能连接，说明数据库配置正确
```

3. 检查 `backend/.env` 中的数据库配置

---

### 问题3: 依赖安装失败

**解决方案**:

1. 清除npm缓存：
```bash
npm cache clean --force
```

2. 删除node_modules重新安装：
```bash
cd backend
rm -rf node_modules package-lock.json
npm install

cd ../frontend
rm -rf node_modules package-lock.json
npm install
```

3. 使用淘宝镜像（中国用户）：
```bash
npm config set registry https://registry.npmmirror.com
```

---

### 问题4: 页面样式错乱

**解决方案**:

1. 检查静态资源是否完整：
```bash
ls -lh frontend/public/static/css/
ls -lh frontend/public/static/js/
```

2. 清除浏览器缓存：
   - Chrome: Ctrl+Shift+Delete
   - Firefox: Ctrl+Shift+Delete

3. 检查浏览器控制台是否有404错误

---

## 📊 查看日志

如果使用 `./start.sh` 启动，日志文件位于：

```bash
# 查看后端日志
tail -f logs/backend.log

# 查看前端日志
tail -f logs/frontend.log

# 同时查看两个日志
tail -f logs/*.log
```

---

## 🎯 下一步

项目启动成功后，您可以：

1. **浏览功能**
   - 查看首页各个区块
   - 测试用户注册/登录
   - 订阅Newsletter
   - 查看定价方案

2. **开发新功能**
   - 查看 `TECHNICAL_ANALYSIS.md` 了解技术架构
   - 查看 `PROJECT_STATUS.md` 了解项目状态
   - 阅读 `README.md` 了解API文档

3. **自定义配置**
   - 修改样式文件
   - 添加新的API端点
   - 扩展数据库表

---

## 📞 获取帮助

如果遇到问题：

1. 查看 `README.md` 完整文档
2. 运行 `./test-api.sh` 测试API
3. 查看日志文件 `logs/`
4. 检查数据库连接
5. 提交GitHub Issue

---

## ✅ 成功标志

如果您看到以下内容，说明启动成功：

**后端启动成功：**
```
╔═══════════════════════════════════════╗
║   🚀 Winsun API Server Started       ║
║   📡 Port: 5000                      ║
║   🌍 Environment: development        ║
╚═══════════════════════════════════════╝
✅ 数据库连接成功
```

**前端启动成功：**
```
╔═══════════════════════════════════════╗
║   🌐 Winsun Frontend Server          ║
║   📡 Port: 8080                      ║
║   🔗 URL: http://localhost:8080     ║
╚═══════════════════════════════════════╝
```

**浏览器访问成功：**
- 页面正常显示
- 样式完整
- 动画流畅
- 无控制台错误

---

**祝您使用愉快！** 🎉

如有问题，请参考完整文档或提交Issue。

