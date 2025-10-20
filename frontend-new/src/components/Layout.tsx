import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navigation = [
    { name: '仪表板', href: '/', icon: '📊' },
    { name: '实时信号', href: '/live-signals', icon: '📡' },
    { name: '信号历史', href: '/signal-history', icon: '📜' },
    { name: '统计分析', href: '/statistics', icon: '📈' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 侧边栏 */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-900 text-white transition-all duration-300`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          {sidebarOpen && <h1 className="text-xl font-bold">Winsun</h1>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-800"
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        <nav className="mt-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center px-4 py-3 text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? 'bg-gray-800 text-white border-l-4 border-blue-500'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              {sidebarOpen && <span className="ml-3">{item.name}</span>}
            </Link>
          ))}
        </nav>

        {/* 用户信息 */}
        <div className="absolute bottom-0 w-full border-t border-gray-800">
          <div className="p-4">
            {sidebarOpen ? (
              <div>
                <p className="text-sm font-medium">{user?.username || user?.email}</p>
                <button
                  onClick={logout}
                  className="mt-2 w-full px-4 py-2 text-sm bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  退出登录
                </button>
              </div>
            ) : (
              <button
                onClick={logout}
                className="w-full p-2 text-2xl hover:bg-gray-800 rounded-lg"
                title="退出登录"
              >
                🚪
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 顶部导航栏 */}
        <header className="bg-white shadow-sm">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">
                {navigation.find(item => isActive(item.href))?.name || '仪表板'}
              </h2>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">实时连接</span>
                </div>
                <div className="text-sm text-gray-600">
                  {new Date().toLocaleString('zh-CN')}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* 页面内容 */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;

