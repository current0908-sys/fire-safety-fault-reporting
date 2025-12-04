'use client';

import { useState } from 'react';
import { Fault, FaultStatus } from '@/lib/db';
import { format } from 'date-fns';

interface FaultDetailProps {
  fault: Fault;
  onClose: () => void;
  onUpdate: () => void;
}

const statusLabels: Record<FaultStatus, string> = {
  pending: '待處理',
  in_progress: '處理中',
  resolved: '已解決',
  closed: '已關閉',
};

const priorityLabels: Record<string, string> = {
  low: '低',
  medium: '中',
  high: '高',
  urgent: '緊急',
};

export default function FaultDetail({ fault, onClose, onUpdate }: FaultDetailProps) {
  const [status, setStatus] = useState<FaultStatus>(fault.status);
  const [assignedTo, setAssignedTo] = useState(fault.assigned_to || '');
  const [resolutionNotes, setResolutionNotes] = useState(fault.resolution_notes || '');
  const [updating, setUpdating] = useState(false);

  const handleStatusUpdate = async () => {
    setUpdating(true);
    try {
      const response = await fetch(`/api/faults/${fault.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          assigned_to: assignedTo || null,
          resolution_notes: resolutionNotes || null,
        }),
      });

      const result = await response.json();
      if (result.success) {
        onUpdate();
        onClose();
      } else {
        alert(result.error || '更新失敗');
      }
    } catch (error) {
      console.error('Error updating fault:', error);
      alert('更新失敗，請稍後再試');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">故障詳情 #{fault.id}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="px-6 py-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">狀態</label>
              <div className="mt-1">
                <span className={`badge badge-${fault.status}`}>
                  {statusLabels[fault.status]}
                </span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">優先級</label>
              <div className="mt-1">
                <span className={`badge badge-${fault.priority}`}>
                  {priorityLabels[fault.priority]}
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">報告人</label>
            <p className="mt-1">{fault.reporter_name}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">聯絡電話</label>
            <p className="mt-1">{fault.reporter_phone}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">故障位置</label>
            <p className="mt-1">{fault.location}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">設備類型</label>
            <p className="mt-1">{fault.equipment_type}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">故障描述</label>
            <p className="mt-1 whitespace-pre-wrap">{fault.fault_description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">建立時間</label>
              <p className="mt-1 text-sm">
                {format(new Date(fault.created_at), 'yyyy/MM/dd HH:mm:ss')}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">更新時間</label>
              <p className="mt-1 text-sm">
                {format(new Date(fault.updated_at), 'yyyy/MM/dd HH:mm:ss')}
              </p>
            </div>
          </div>

          <div className="border-t pt-4 mt-4">
            <h3 className="font-semibold mb-3">更新狀態</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">狀態</label>
                <select
                  className="select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as FaultStatus)}
                >
                  <option value="pending">待處理</option>
                  <option value="in_progress">處理中</option>
                  <option value="resolved">已解決</option>
                  <option value="closed">已關閉</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">指派給</label>
                <input
                  type="text"
                  className="input"
                  placeholder="輸入處理人員姓名"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">處理備註</label>
                <textarea
                  className="textarea"
                  placeholder="輸入處理備註或解決方案..."
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                />
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  className="btn btn-outline"
                  onClick={onClose}
                  disabled={updating}
                >
                  取消
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleStatusUpdate}
                  disabled={updating}
                >
                  {updating ? '更新中...' : '更新狀態'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

