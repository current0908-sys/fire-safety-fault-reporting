'use client';

import { useState } from 'react';
import { FaultPriority } from '@/lib/db';

interface FaultFormProps {
  onSubmit: () => void;
  onCancel: () => void;
}

export default function FaultForm({ onSubmit, onCancel }: FaultFormProps) {
  const [formData, setFormData] = useState({
    reporter_name: '',
    reporter_phone: '',
    location: '',
    equipment_type: '',
    fault_description: '',
    priority: 'medium' as FaultPriority,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const response = await fetch('/api/faults', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setFormData({
          reporter_name: '',
          reporter_phone: '',
          location: '',
          equipment_type: '',
          fault_description: '',
          priority: 'medium',
        });
        onSubmit();
      } else {
        setError(result.error || '提交失敗');
      }
    } catch (error) {
      setError('提交失敗，請稍後再試');
      console.error('Error submitting form:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">新增故障報告</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              報告人姓名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="input"
              value={formData.reporter_name}
              onChange={(e) => setFormData({ ...formData, reporter_name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              聯絡電話 <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              className="input"
              value={formData.reporter_phone}
              onChange={(e) => setFormData({ ...formData, reporter_phone: e.target.value })}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            故障位置 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="input"
            placeholder="例如：1樓大廳、B1停車場等"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            設備類型 <span className="text-red-500">*</span>
          </label>
          <select
            className="select"
            value={formData.equipment_type}
            onChange={(e) => setFormData({ ...formData, equipment_type: e.target.value })}
            required
          >
            <option value="">請選擇設備類型</option>
            <option value="消防栓">消防栓</option>
            <option value="滅火器">滅火器</option>
            <option value="煙霧偵測器">煙霧偵測器</option>
            <option value="灑水系統">灑水系統</option>
            <option value="緊急照明">緊急照明</option>
            <option value="逃生指示燈">逃生指示燈</option>
            <option value="電梯">電梯</option>
            <option value="空調系統">空調系統</option>
            <option value="發電機">發電機</option>
            <option value="其他">其他</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            優先級 <span className="text-red-500">*</span>
          </label>
          <select
            className="select"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value as FaultPriority })}
            required
          >
            <option value="low">低</option>
            <option value="medium">中</option>
            <option value="high">高</option>
            <option value="urgent">緊急</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            故障描述 <span className="text-red-500">*</span>
          </label>
          <textarea
            className="textarea"
            placeholder="請詳細描述故障情況..."
            value={formData.fault_description}
            onChange={(e) => setFormData({ ...formData, fault_description: e.target.value })}
            required
          />
        </div>

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            className="btn btn-outline"
            onClick={onCancel}
            disabled={submitting}
          >
            取消
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting ? '提交中...' : '提交報告'}
          </button>
        </div>
      </form>
    </div>
  );
}









