import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface Signal {
  symbol: string;
  signal: string;
  confidence: number;
  price: number;
  stopLoss: number;
  takeProfit: number;
  riskLevel: string;
  reasons: string[];
}

const LiveSignals: React.FC = () => {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [connected, setConnected] = useState(false);
  const [subcode] = useState('VIP2-ADMIN-GRANTED-001'); // 测试订阅码

  useEffect(() => {
    // 连接WebSocket
    const newSocket = io('http://localhost:5000');
    
    newSocket.on('connect', () => {
      console.log('WebSocket connected');
      setConnected(true);
      
      // 发送认证
      newSocket.emit('authenticate', { subcode });
    });

    newSocket.on('auth-success', (data) => {
      console.log('Authentication successful:', data);
      
      // 订阅交易对
      newSocket.emit('subscribe', {
        symbols: ['BTC/USDT', 'ETH/USDT', 'BNB/USDT']
      });
    });

    newSocket.on('auth-error', (data) => {
      console.error('Authentication failed:', data);
    });

    newSocket.on('trading-signals', (data) => {
      console.log('Received signals:', data);
      setSignals(data.signals);
    });

    newSocket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      setConnected(false);
    });

    return () => {
      newSocket.close();
    };
  }, [subcode]);

  return (
    <div className="space-y-6">
      {/* 连接状态 */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">实时连接状态</h3>
            <p className="text-sm text-gray-600 mt-1">
              订阅码: {subcode}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            <span className={`text-sm font-medium ${connected ? 'text-green-600' : 'text-red-600'}`}>
              {connected ? '已连接' : '未连接'}
            </span>
          </div>
        </div>
      </div>

      {/* 实时信号卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {signals.length === 0 ? (
          <div className="col-span-full bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">📡</div>
            <p className="text-gray-600">等待实时信号...</p>
            <p className="text-sm text-gray-500 mt-2">信号将每5秒自动更新</p>
          </div>
        ) : (
          signals.map((signal, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* 信号头部 */}
              <div className={`p-4 ${
                signal.signal === 'BUY' ? 'bg-green-500' :
                signal.signal === 'SELL' ? 'bg-red-500' :
                'bg-gray-500'
              }`}>
                <div className="flex items-center justify-between text-white">
                  <h3 className="text-xl font-bold">{signal.symbol}</h3>
                  <span className="text-2xl font-bold">{signal.signal}</span>
                </div>
              </div>

              {/* 信号详情 */}
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">置信度</span>
                  <span className="text-lg font-bold text-blue-600">{signal.confidence}%</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">当前价格</span>
                  <span className="text-lg font-semibold">${signal.price.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">止损</span>
                  <span className="text-sm font-medium text-red-600">${signal.stopLoss.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">止盈</span>
                  <span className="text-sm font-medium text-green-600">${signal.takeProfit.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">风险等级</span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    signal.riskLevel === 'LOW' ? 'bg-green-100 text-green-800' :
                    signal.riskLevel === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {signal.riskLevel}
                  </span>
                </div>

                {/* 信号原因 */}
                {signal.reasons && signal.reasons.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs font-medium text-gray-600 mb-2">信号原因:</p>
                    <ul className="space-y-1">
                      {signal.reasons.map((reason, idx) => (
                        <li key={idx} className="text-xs text-gray-700 flex items-start">
                          <span className="mr-2">•</span>
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* 时间戳 */}
              <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  {new Date().toLocaleString('zh-CN')}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LiveSignals;

