'use client';

import { useState, useEffect } from 'react';
import FaultList from '@/components/FaultList';
import FaultForm from '@/components/FaultForm';
import Statistics from '@/components/Statistics';
import { Fault, FaultStatus, FaultPriority } from '@/lib/db';

export default function Home() {
  const [faults, setFaults] = useState<Fault[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<FaultStatus | ''>('');
  const [filterPriority, setFilterPriority] = useState<FaultPriority | ''>('');

  const fetchFaults = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterStatus) params.append('status', filterStatus);
      if (filterPriority) params.append('priority', filterPriority);

      const response = await fetch(`/api/faults?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        setFaults(result.data);
      }
    } catch (error) {
      console.error('Error fetching faults:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaults();
  }, [filterStatus, filterPriority]);

  const handleFormSubmit = () => {
    setShowForm(false);
    fetchFaults();
  };

  return (
    <div className="min-h-screen">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container py-4">
          <h1 className="text-2xl font-bold text-gray-900">
            機電消防故障回報系統
          </h1>
        </div>
      </header>

      <main className="container py-8">
        <Statistics />

        <div className="mt-6 flex justify-between items-center">
          <div className="flex gap-4">
            <select
              className="select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as FaultStatus | '')}
              style={{ width: 'auto', minWidth: '150px' }}
            >
              <option value="">全部狀態</option>
              <option value="pending">待處理</option>
              <option value="in_progress">處理中</option>
              <option value="resolved">已解決</option>
              <option value="closed">已關閉</option>
            </select>

            <select
              className="select"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as FaultPriority | '')}
              style={{ width: 'auto', minWidth: '150px' }}
            >
              <option value="">全部優先級</option>
              <option value="low">低</option>
              <option value="medium">中</option>
              <option value="high">高</option>
              <option value="urgent">緊急</option>
            </select>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? '取消' : '+ 新增故障報告'}
          </button>
        </div>

        {showForm && (
          <div className="mt-6">
            <FaultForm onSubmit={handleFormSubmit} onCancel={() => setShowForm(false)} />
          </div>
        )}

        <div className="mt-6">
          {loading ? (
            <div className="text-center py-12 text-gray-500">載入中...</div>
          ) : (
            <FaultList faults={faults} onUpdate={fetchFaults} />
          )}
        </div>
      </main>
    </div>
  );
}





