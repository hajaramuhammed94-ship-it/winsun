#!/bin/bash

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║         🚀 Vite前端自动化设置脚本                        ║${NC}"
echo -e "${BLUE}║         自动创建并配置React + Vite + Tailwind CSS        ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""

# 进入项目根目录
cd "$(dirname "$0")"
PROJECT_ROOT=$(pwd)

echo -e "${YELLOW}📍 项目根目录: $PROJECT_ROOT${NC}"
echo ""

# 步骤1: 清理旧目录
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}🗑️  步骤1: 清理旧的frontend-vite目录${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if [ -d "frontend-vite" ]; then
    echo -e "${YELLOW}删除现有的frontend-vite目录...${NC}"
    rm -rf frontend-vite
    echo -e "${GREEN}✅ 已删除${NC}"
else
    echo -e "${GREEN}✅ 目录不存在，跳过${NC}"
fi
echo ""

# 步骤2: 创建Vite项目
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}📦 步骤2: 创建Vite项目${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# 创建目录
mkdir -p frontend-vite
cd frontend-vite

# 复制已准备好的配置文件
echo -e "${BLUE}复制配置文件...${NC}"

# 创建package.json
cat > package.json << 'EOF'
{
  "name": "winsun-frontend",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "axios": "^1.6.0",
    "socket.io-client": "^4.6.0",
    "recharts": "^2.10.0",
    "@headlessui/react": "^1.7.0",
    "@heroicons/react": "^2.1.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.2.0",
    "typescript": "^5.2.0",
    "vite": "^5.0.0",
    "tailwindcss": "^3.3.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}
EOF

echo -e "${GREEN}✅ package.json 已创建${NC}"

# 创建vite.config.ts
cat > vite.config.ts << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
EOF

echo -e "${GREEN}✅ vite.config.ts 已创建${NC}"

# 创建tsconfig.json
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
EOF

echo -e "${GREEN}✅ tsconfig.json 已创建${NC}"

# 创建tsconfig.node.json
cat > tsconfig.node.json << 'EOF'
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
EOF

echo -e "${GREEN}✅ tsconfig.node.json 已创建${NC}"

# 创建tailwind.config.js
cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
    },
  },
  plugins: [],
}
EOF

echo -e "${GREEN}✅ tailwind.config.js 已创建${NC}"

# 创建postcss.config.js
cat > postcss.config.js << 'EOF'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF

echo -e "${GREEN}✅ postcss.config.js 已创建${NC}"

# 创建index.html
cat > index.html << 'EOF'
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Winsun - 加密货币交易信号平台</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
EOF

echo -e "${GREEN}✅ index.html 已创建${NC}"
echo ""

# 步骤3: 安装依赖
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}📥 步骤3: 安装依赖 (这可能需要1-2分钟)${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

npm install --legacy-peer-deps

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ 依赖安装成功${NC}"
else
    echo -e "${RED}❌ 依赖安装失败${NC}"
    exit 1
fi
echo ""

# 步骤4: 复制源代码
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}📝 步骤4: 复制源代码${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# 创建src目录
mkdir -p src

# 复制组件
if [ -d "../frontend-new/src/contexts" ]; then
    cp -r ../frontend-new/src/contexts ./src/
    echo -e "${GREEN}✅ contexts 已复制${NC}"
fi

if [ -d "../frontend-new/src/components" ]; then
    cp -r ../frontend-new/src/components ./src/
    echo -e "${GREEN}✅ components 已复制${NC}"
fi

if [ -d "../frontend-new/src/pages" ]; then
    cp -r ../frontend-new/src/pages ./src/
    echo -e "${GREEN}✅ pages 已复制${NC}"
fi

if [ -f "../frontend-new/src/App.tsx" ]; then
    cp ../frontend-new/src/App.tsx ./src/
    echo -e "${GREEN}✅ App.tsx 已复制${NC}"
fi

# 创建main.tsx
cat > src/main.tsx << 'EOF'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
EOF

echo -e "${GREEN}✅ main.tsx 已创建${NC}"

# 创建index.css
cat > src/index.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}
EOF

echo -e "${GREEN}✅ index.css 已创建${NC}"
echo ""

# 完成
echo -e "${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║         ✅ Vite前端设置完成！                            ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${BLUE}📊 项目结构:${NC}"
echo -e "  frontend-vite/"
echo -e "  ├── src/"
echo -e "  │   ├── components/    ${GREEN}✓${NC}"
echo -e "  │   ├── contexts/      ${GREEN}✓${NC}"
echo -e "  │   ├── pages/         ${GREEN}✓${NC}"
echo -e "  │   ├── App.tsx        ${GREEN}✓${NC}"
echo -e "  │   ├── main.tsx       ${GREEN}✓${NC}"
echo -e "  │   └── index.css      ${GREEN}✓${NC}"
echo -e "  ├── index.html         ${GREEN}✓${NC}"
echo -e "  ├── vite.config.ts     ${GREEN}✓${NC}"
echo -e "  ├── tailwind.config.js ${GREEN}✓${NC}"
echo -e "  └── package.json       ${GREEN}✓${NC}"
echo ""

echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}🚀 启动开发服务器${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}运行以下命令启动:${NC}"
echo -e "  ${GREEN}cd frontend-vite${NC}"
echo -e "  ${GREEN}npm run dev${NC}"
echo ""
echo -e "${BLUE}或者直接运行:${NC}"
echo -e "  ${GREEN}cd $PROJECT_ROOT/frontend-vite && npm run dev${NC}"
echo ""
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}📝 测试账号${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "  邮箱: ${GREEN}12345@qq.com${NC}"
echo -e "  密码: ${GREEN}123456${NC}"
echo -e "  订阅码: ${GREEN}VIP2-ADMIN-GRANTED-001${NC}"
echo ""
echo -e "${BLUE}🎉 前端将运行在: ${GREEN}http://localhost:3000${NC}"
echo -e "${BLUE}🔌 后端API运行在: ${GREEN}http://localhost:5000${NC}"
echo ""

