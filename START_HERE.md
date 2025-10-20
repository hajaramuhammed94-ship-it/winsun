# 🚀 如何启动Winsun前端

## ⚠️ 重要提示

您当前有**两个frontend目录**：

1. **`frontend/`** - ✅ **新的Vite + React项目（使用这个！）**
2. `frontend-new/` - ❌ 旧的Create React App项目（不要使用）

---

## 🎯 正确的启动方式

### 步骤1：停止当前运行的服务

如果您在终端看到 `Port: 8080`，请按 `Ctrl+C` 停止它。

### 步骤2：进入正确的目录

```bash
cd /home/jzy/桌面/量化/winsun-clone/frontend
```

### 步骤3：等待依赖安装完成

npm install正在后台运行，请等待它完成（大约1-2分钟）。

您可以检查是否完成：

```bash
ls node_modules | wc -l
```

如果显示的数字大于100，说明安装完成。

### 步骤4：启动Vite开发服务器

```bash
npm run dev
```

### 步骤5：访问前端

打开浏览器访问：**http://localhost:3000**

---

## 📝 测试账号

- **邮箱**: `12345@qq.com`
- **密码**: `123456`

---

## 🐛 如果遇到问题

### 问题1：`npm run dev` 报错

```bash
# 重新安装依赖
cd /home/jzy/桌面/量化/winsun-clone/frontend
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npm run dev
```

### 问题2：端口3000被占用

```bash
# 使用其他端口
npm run dev -- --port 3001
```

然后访问 http://localhost:3001

### 问题3：Vite找不到

```bash
# 手动安装Vite
npm install vite --save-dev
npm run dev
```

---

## ✅ 成功标志

当您看到类似以下输出时，说明启动成功：

```
  VITE v5.0.0  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.x.x:3000/
  ➜  press h + enter to show help
```

---

## 🎉 下一步

1. 访问 http://localhost:3000
2. 使用测试账号登录
3. 查看仪表板和实时信号

---

## 📊 当前服务状态

- ✅ **后端API**: http://localhost:5000 (正在运行)
- ✅ **旧前端**: http://localhost:8080 (HTML静态页面)
- ⏳ **新前端**: http://localhost:3000 (等待启动)

---

## 💡 快速命令

```bash
# 一键启动（在新终端运行）
cd /home/jzy/桌面/量化/winsun-clone/frontend && npm run dev
```

---

**祝您使用愉快！** 🎉

