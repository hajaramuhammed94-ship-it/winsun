# 🔐 GitHub Personal Access Token 配置指南

## 📋 为什么需要 Token？

GitHub 从 2021 年 8 月 13 日起，**不再支持使用密码推送代码**。

必须使用以下方式之一：
- ✅ **Personal Access Token** (推荐，简单)
- ✅ SSH 密钥 (更安全，但配置复杂)

---

## ⚡ 方法 1: 创建 Personal Access Token (推荐)

### 步骤 1: 创建 Token

我已经为您打开了创建页面: https://github.com/settings/tokens/new

**在页面上填写**:

| 字段 | 值 |
|------|-----|
| **Note** (备注) | `Winsun Project - Vercel Deployment` |
| **Expiration** (过期时间) | `90 days` 或 `No expiration` (不过期) |
| **Select scopes** (权限) | ✅ 勾选 `repo` (完整仓库访问权限) |

**详细权限说明**:
```
✅ repo                    # 必选 - 仓库完整访问权限
  ✅ repo:status          # 访问提交状态
  ✅ repo_deployment      # 访问部署状态
  ✅ public_repo          # 访问公开仓库
  ✅ repo:invite          # 访问仓库邀请
  ✅ security_events      # 读写安全事件
```

其他权限可以不勾选（除非有特殊需求）。

---

### 步骤 2: 生成并复制 Token

1. 滚动到页面底部
2. 点击绿色按钮 **"Generate token"**
3. **立即复制 Token！** (只显示一次，离开页面后无法再看到)

Token 格式类似:
```
ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

⚠️ **重要**: 
- Token 只显示一次！
- 立即复制并保存到安全的地方
- 不要分享给任何人

---

### 步骤 3: 配置 Git 使用 Token

#### 方法 A: 使用 Git Credential Helper (推荐)

```bash
# 配置 Git 记住凭证
git config --global credential.helper store

# 第一次推送时会要求输入
# Username: hajaramuhammed94
# Password: <粘贴你的 Token>

# 之后会自动记住，不需要再输入
```

#### 方法 B: 在 URL 中包含 Token

```bash
# 设置 remote URL (包含 Token)
git remote set-url origin https://ghp_YOUR_TOKEN@github.com/hajaramuhammed94/winsun.git

# 替换 ghp_YOUR_TOKEN 为你的实际 Token
```

---

### 步骤 4: 测试推送

```bash
cd /home/jzy/桌面/量化/winsun-clone

# 测试推送
git push -u origin main

# 如果使用方法 A，会提示输入:
# Username: hajaramuhammed94
# Password: <粘贴你的 Token>

# 成功后会显示:
# Enumerating objects: xxx, done.
# Writing objects: 100% (xxx/xxx), done.
# To https://github.com/hajaramuhammed94/winsun.git
#  * [new branch]      main -> main
```

---

## 🔑 方法 2: 使用 SSH 密钥 (更安全)

### 步骤 1: 生成 SSH 密钥

```bash
# 生成 SSH 密钥对
ssh-keygen -t ed25519 -C "iwayjws74857@outlook.com"

# 提示时直接按回车（使用默认路径）
# Enter file in which to save the key (/home/jzy/.ssh/id_ed25519): [回车]
# Enter passphrase (empty for no passphrase): [回车或输入密码]
```

---

### 步骤 2: 复制公钥

```bash
# 显示公钥
cat ~/.ssh/id_ed25519.pub

# 输出类似:
# ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIxxx... iwayjws74857@outlook.com

# 复制整行内容
```

---

### 步骤 3: 添加到 GitHub

1. 访问: https://github.com/settings/ssh/new
2. **Title**: `Winsun Development Machine`
3. **Key**: 粘贴刚才复制的公钥
4. 点击 **"Add SSH key"**

---

### 步骤 4: 测试 SSH 连接

```bash
# 测试连接
ssh -T git@github.com

# 成功会显示:
# Hi hajaramuhammed94! You've successfully authenticated, but GitHub does not provide shell access.
```

---

### 步骤 5: 更改 Git Remote URL

```bash
# 将 HTTPS URL 改为 SSH URL
git remote set-url origin git@github.com:hajaramuhammed94/winsun.git

# 验证
git remote -v

# 应该显示:
# origin  git@github.com:hajaramuhammed94/winsun.git (fetch)
# origin  git@github.com:hajaramuhammed94/winsun.git (push)
```

---

## 📊 对比：Token vs SSH

| 特性 | Personal Access Token | SSH 密钥 |
|------|----------------------|----------|
| **设置难度** | ⭐ 简单 | ⭐⭐ 中等 |
| **安全性** | ⭐⭐⭐ 好 | ⭐⭐⭐⭐ 很好 |
| **过期时间** | 可设置过期 | 永不过期 |
| **多机器使用** | 可共用 Token | 每台机器独立密钥 |
| **推荐场景** | 个人开发、临时使用 | 长期开发、多项目 |

**建议**:
- 🎯 **快速开始**: 使用 Personal Access Token
- 🔒 **长期使用**: 配置 SSH 密钥

---

## 🚀 完整的自动化脚本

我为您创建一个自动配置脚本：

```bash
#!/bin/bash

echo "🔐 GitHub 认证配置向导"
echo ""

echo "请选择认证方式:"
echo "1) Personal Access Token (推荐，简单)"
echo "2) SSH 密钥 (更安全)"
read -p "请输入选择 (1 或 2): " choice

if [ "$choice" = "1" ]; then
    echo ""
    echo "📋 Personal Access Token 配置"
    echo ""
    echo "1. 访问: https://github.com/settings/tokens/new"
    echo "2. Note: Winsun Project"
    echo "3. Expiration: 90 days"
    echo "4. 勾选: repo (完整权限)"
    echo "5. 点击 Generate token"
    echo "6. 复制生成的 Token"
    echo ""
    
    read -p "请粘贴您的 Token: " token
    
    if [ -z "$token" ]; then
        echo "❌ Token 不能为空"
        exit 1
    fi
    
    echo ""
    echo "配置 Git credential helper..."
    git config --global credential.helper store
    
    echo ""
    echo "设置 remote URL..."
    git remote set-url origin "https://$token@github.com/hajaramuhammed94/winsun.git"
    
    echo ""
    echo "✅ Token 配置完成！"
    echo ""
    echo "现在可以推送代码了:"
    echo "  git push -u origin main"
    
elif [ "$choice" = "2" ]; then
    echo ""
    echo "🔑 SSH 密钥配置"
    echo ""
    
    if [ -f ~/.ssh/id_ed25519 ]; then
        echo "⚠️  SSH 密钥已存在"
        echo ""
        echo "公钥内容:"
        cat ~/.ssh/id_ed25519.pub
    else
        echo "生成 SSH 密钥..."
        ssh-keygen -t ed25519 -C "iwayjws74857@outlook.com" -f ~/.ssh/id_ed25519 -N ""
        
        echo ""
        echo "✅ SSH 密钥生成成功！"
        echo ""
        echo "公钥内容:"
        cat ~/.ssh/id_ed25519.pub
    fi
    
    echo ""
    echo "📋 下一步:"
    echo "1. 复制上面的公钥"
    echo "2. 访问: https://github.com/settings/ssh/new"
    echo "3. Title: Winsun Development"
    echo "4. Key: 粘贴公钥"
    echo "5. 点击 Add SSH key"
    echo ""
    
    read -p "完成后按回车继续..." 
    
    echo ""
    echo "测试 SSH 连接..."
    ssh -T git@github.com
    
    echo ""
    echo "设置 remote URL..."
    git remote set-url origin git@github.com:hajaramuhammed94/winsun.git
    
    echo ""
    echo "✅ SSH 配置完成！"
    echo ""
    echo "现在可以推送代码了:"
    echo "  git push -u origin main"
else
    echo "❌ 无效的选择"
    exit 1
fi
```

保存为 `setup-github-auth.sh` 并运行:

```bash
chmod +x setup-github-auth.sh
./setup-github-auth.sh
```

---

## 🔧 常见问题

### Q1: Token 过期了怎么办？

**解决方案**:
1. 访问: https://github.com/settings/tokens
2. 找到过期的 Token，点击 "Regenerate token"
3. 复制新的 Token
4. 更新 Git 配置:
   ```bash
   git remote set-url origin https://NEW_TOKEN@github.com/hajaramuhammed94/winsun.git
   ```

---

### Q2: 忘记保存 Token 了怎么办？

**解决方案**:
Token 只显示一次，如果忘记保存：
1. 删除旧 Token
2. 创建新的 Token
3. 重新配置

---

### Q3: 推送时提示 "Authentication failed"？

**检查清单**:
1. ✅ Token 是否正确
2. ✅ Token 是否过期
3. ✅ Token 权限是否包含 `repo`
4. ✅ Remote URL 是否正确

**查看当前配置**:
```bash
git remote -v
git config --list | grep credential
```

---

### Q4: 多个项目如何管理 Token？

**方案 1**: 使用同一个 Token
```bash
# 所有项目使用同一个 Token
git config --global credential.helper store
# 第一次输入后，所有项目都会记住
```

**方案 2**: 每个项目独立 Token
```bash
# 在项目目录下
git config credential.helper store
# 只对当前项目有效
```

---

## 📋 快速参考

### Token 方式推送

```bash
# 1. 创建 Token: https://github.com/settings/tokens/new
# 2. 配置 Git
git config --global credential.helper store

# 3. 推送（第一次会要求输入）
git push -u origin main
# Username: hajaramuhammed94
# Password: <粘贴 Token>

# 4. 之后自动记住
```

### SSH 方式推送

```bash
# 1. 生成密钥
ssh-keygen -t ed25519 -C "iwayjws74857@outlook.com"

# 2. 添加到 GitHub
cat ~/.ssh/id_ed25519.pub
# 复制并添加到: https://github.com/settings/ssh/new

# 3. 更改 URL
git remote set-url origin git@github.com:hajaramuhammed94/winsun.git

# 4. 推送
git push -u origin main
```

---

## 🎯 推荐流程

### 对于您的情况，我推荐：

1. **现在**: 使用 Personal Access Token (快速开始)
2. **稍后**: 配置 SSH 密钥 (长期使用)

### 立即行动

1. ✅ 在打开的页面创建 Token
2. ✅ 复制 Token
3. ✅ 运行 `./setup-git.sh`
4. ✅ 推送时粘贴 Token

---

**需要帮助吗？** 告诉我您选择哪种方式，我可以提供更详细的指导！

