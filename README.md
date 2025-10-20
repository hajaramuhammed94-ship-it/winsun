# 🚀 Winsun - Cryptocurrency Trading Signal Platform

A full-stack cryptocurrency trading signal platform with real-time market data, AI-powered trading signals, and comprehensive backtesting capabilities.

[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black)](https://winsun-original.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Quick Start](#-quick-start)
- [Deployment](#-deployment)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)

## ✨ Features

### 🎯 Core Features
- **Real-time Trading Signals** - AI-powered cryptocurrency trading signals
- **Live Market Data** - Real-time price updates via WebSocket
- **Backtesting Engine** - Test strategies against historical data
- **User Authentication** - Secure JWT-based authentication
- **Interactive Dashboard** - Beautiful, responsive UI with charts
- **Multi-Exchange Support** - Binance, Gate.io, OKX integration

### 📊 Trading Features
- Multiple trading strategies (MA Cross, RSI, MACD, Bollinger Bands)
- Risk management and position sizing
- Performance analytics and metrics
- Signal history and tracking
- Portfolio management

### 🔔 Notifications
- Real-time signal alerts
- Email notifications
- WebSocket push notifications

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Charts**: Recharts / Chart.js
- **WebSocket**: Socket.IO Client

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **WebSocket**: Socket.IO
- **Authentication**: JWT + bcryptjs
- **Database**: PostgreSQL (production) / SQLite (development)
- **Trading APIs**: CCXT (Cryptocurrency Exchange Trading Library)
- **Real-time Data**: WebSocket connections to exchanges

### DevOps
- **Deployment**: Vercel (Frontend + Backend)
- **Version Control**: Git + GitHub
- **CI/CD**: Vercel Auto-deployment
- **Monitoring**: Vercel Analytics

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client                              │
│                  (React + TypeScript)                       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTPS / WebSocket
                     │
┌────────────────────▼────────────────────────────────────────┐
│                    API Gateway                              │
│                  (Vercel Rewrites)                          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │
┌────────────────────▼────────────────────────────────────────┐
│                  Backend Server                             │
│              (Express.js + Socket.IO)                       │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │     Auth     │  │   Signals    │  │   Market     │    │
│  │   Service    │  │   Service    │  │   Service    │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │  Backtest    │  │  WebSocket   │  │   Database   │    │
│  │   Engine     │  │   Handler    │  │   Layer      │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ API Calls
                     │
┌────────────────────▼────────────────────────────────────────┐
│              Exchange APIs (CCXT)                           │
│     Binance  │  Gate.io  │  OKX  │  Other Exchanges        │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git
- GitHub account
- Vercel account (for deployment)

### Local Development

1. **Clone the repository**

```bash
git clone https://github.com/hajaramuhammed94/winsun.git
cd winsun
```

2. **Setup Frontend**

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Frontend will run on `http://localhost:3000`

3. **Setup Backend**

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Backend will run on `http://localhost:5000`

4. **Environment Variables**

**Frontend** (`.env.local`):
```env
VITE_API_URL=http://localhost:5000
```

**Backend** (`.env`):
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=http://localhost:3000
DATABASE_URL=sqlite://./database.sqlite
```

## 📦 Deployment

### Automatic Deployment (Recommended)

This project is configured for automatic deployment on Vercel with Git integration.

1. **Create GitHub Repository**
   - Repository name: `winsun`
   - Visibility: Private (recommended)

2. **Run Setup Script**

```bash
cd winsun-clone
./setup-git.sh
```

3. **Connect Vercel to GitHub**

   **Frontend**:
   - Go to: https://vercel.com/cvsgetyes-projects/winsun-original/settings/git
   - Connect to GitHub repository
   - Root Directory: `frontend`
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

   **Backend**:
   - Go to: https://vercel.com/cvsgetyes-projects/winsun-backend/settings/git
   - Connect to GitHub repository
   - Root Directory: `backend`
   - Add environment variables:
     ```
     JWT_SECRET=your-secret-key
     FRONTEND_URL=https://winsun-original.vercel.app
     NODE_ENV=production
     ```

4. **Deploy**

```bash
git add .
git commit -m "Update feature"
git push origin main
```

Vercel will automatically deploy your changes! 🎉

### Manual Deployment

```bash
# Frontend
cd frontend
npx vercel --prod

# Backend
cd backend
npx vercel --prod
```

## 📁 Project Structure

```
winsun/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── hooks/           # Custom hooks
│   │   ├── utils/           # Utility functions
│   │   └── App.tsx          # Main app component
│   ├── public/              # Static assets
│   ├── package.json
│   ├── vite.config.ts       # Vite configuration
│   └── vercel.json          # Vercel deployment config
│
├── backend/                  # Node.js backend application
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── controllers/     # Route controllers
│   │   ├── services/        # Business logic
│   │   ├── models/          # Database models
│   │   ├── middleware/      # Express middleware
│   │   ├── websocket/       # WebSocket handlers
│   │   ├── utils/           # Utility functions
│   │   └── server.js        # Main server file
│   ├── package.json
│   └── vercel.json          # Vercel deployment config
│
├── frontend-static/          # Static HTML version (alternative)
│   ├── client/
│   └── index.html
│
├── docs/                     # Documentation
│   ├── API.md
│   ├── DEPLOYMENT.md
│   └── ARCHITECTURE.md
│
├── .gitignore
├── README.md
└── setup-git.sh             # Git setup automation script
```

## 📚 API Documentation

### Authentication

```bash
# Register
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "username": "username"
}

# Login
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

# Get Profile
GET /api/auth/me
Authorization: Bearer <token>
```

### Trading Signals

```bash
# Get Latest Signals
GET /api/signals/latest
Authorization: Bearer <token>

# Get Signal History
GET /api/signal-history/dashboard
Authorization: Bearer <token>
```

### Market Data

```bash
# Get Market Price
GET /api/market/price?symbol=BTCUSDT

# Get Market Overview
GET /api/market/overview
```

### Backtesting

```bash
# Run Backtest
POST /api/backtest/run
Authorization: Bearer <token>
Content-Type: application/json

{
  "strategy": "MA_CROSS",
  "symbol": "BTCUSDT",
  "timeframe": "1h",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31"
}
```

For complete API documentation, see [API.md](./docs/API.md)

## 🧪 Testing

```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
npm test

# E2E tests
npm run test:e2e
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [CCXT](https://github.com/ccxt/ccxt) - Cryptocurrency trading library
- [Vercel](https://vercel.com) - Deployment platform
- [React](https://reactjs.org) - Frontend framework
- [Express.js](https://expressjs.com) - Backend framework

## 📞 Contact

- GitHub: [@hajaramuhammed94](https://github.com/hajaramuhammed94)
- Email: iwayjws74857@outlook.com

## 🔗 Links

- **Live Demo**: https://winsun-original.vercel.app
- **API Endpoint**: https://winsun-backend.vercel.app
- **Documentation**: [docs/](./docs/)

---

**Built with ❤️ by the Winsun Team**

