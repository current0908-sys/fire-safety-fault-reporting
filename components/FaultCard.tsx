'use client';

import { Fault, FaultStatus, FaultPriority } from '@/lib/db';
import { format } from 'date-fns';

interface FaultCardProps {
  fault: Fault;
  onClick: () => void;
}

const statusLabels: Record<FaultStatus, string> = {
  pending: '待處理',
  in_progress: '處理中',
  resolved: '已解決',
  closed: '已關閉',
};

const priorityLabels: Record<FaultPriority, string> = {
  low: '低',
  medium: '中',
  high: '高',
  urgent: '緊急',
};

export default function FaultCard({ fault, onClick }: FaultCardProps) {
  return (
    <div
      className="card cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-lg">#{fault.id}</h3>
          <p className="text-sm text-gray-500 mt-1">
            {format(new Date(fault.created_at), 'yyyy/MM/dd HH:mm')}
          </p>
        </div>
        <div className="flex flex-col gap-2 items-end">
          <span className={`badge badge-${fault.status}`}>
            {statusLabels[fault.status]}
          </span>
          <span className={`badge badge-${fault.priority}`}>
            {priorityLabels[fault.priority]}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <div>
          <span className="text-sm text-gray-500">位置：</span>
          <span className="text-sm font-medium">{fault.location}</span>
        </div>
        <div>
          <span className="text-sm text-gray-500">設備：</span>
          <span className="text-sm font-medium">{fault.equipment_type}</span>
        </div>
        <div>
          <span className="text-sm text-gray-500">報告人：</span>
          <span className="text-sm">{fault.reporter_name}</span>
        </div>
        <div className="pt-2">
          <p className="text-sm text-gray-700 line-clamp-2">
            {fault.fault_description}
          </p>
        </div>
      </div>
    </div>
  );
}

