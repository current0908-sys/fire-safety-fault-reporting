'use client';

import { useState } from 'react';
import { Fault, FaultStatus } from '@/lib/db';
import FaultCard from './FaultCard';
import FaultDetail from './FaultDetail';

interface FaultListProps {
  faults: Fault[];
  onUpdate: () => void;
}

export default function FaultList({ faults, onUpdate }: FaultListProps) {
  const [selectedFault, setSelectedFault] = useState<Fault | null>(null);

  if (faults.length === 0) {
    return (
      <div className="card text-center py-12 text-gray-500">
        目前沒有故障報告
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {faults.map((fault) => (
          <FaultCard
            key={fault.id}
            fault={fault}
            onClick={() => setSelectedFault(fault)}
          />
        ))}
      </div>

      {selectedFault && (
        <FaultDetail
          fault={selectedFault}
          onClose={() => setSelectedFault(null)}
          onUpdate={onUpdate}
        />
      )}
    </>
  );
}

