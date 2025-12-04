'use client';

import { useState, useEffect } from 'react';

interface StatisticsData {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
}

export default function Statistics() {
  const [stats, setStats] = useState<StatisticsData>({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/statistics');
        const result = await response.json();
        if (result.success) {
          setStats(result.data);
        }
      } catch (error) {
        console.error('Error fetching statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000); // 每30秒更新一次
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="text-center py-4">載入統計中...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="card bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="text-sm text-gray-600 mb-1">總計</div>
        <div className="text-3xl font-bold text-blue-700">{stats.total}</div>
      </div>

      <div className="card bg-gradient-to-br from-yellow-50 to-yellow-100">
        <div className="text-sm text-gray-600 mb-1">待處理</div>
        <div className="text-3xl font-bold text-yellow-700">{stats.pending}</div>
      </div>

      <div className="card bg-gradient-to-br from-indigo-50 to-indigo-100">
        <div className="text-sm text-gray-600 mb-1">處理中</div>
        <div className="text-3xl font-bold text-indigo-700">{stats.inProgress}</div>
      </div>

      <div className="card bg-gradient-to-br from-green-50 to-green-100">
        <div className="text-sm text-gray-600 mb-1">已解決</div>
        <div className="text-3xl font-bold text-green-700">{stats.resolved}</div>
      </div>
    </div>
  );
}









