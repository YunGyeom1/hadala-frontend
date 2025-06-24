import React, { useState } from 'react';
import DailyInventorySummary from '@/transactions/inventory/DailyInventorySummary';
import { mockInventorySnapshot } from '@/transactions/inventory/mock';

const InventorySummaryPage = () => {
  const [selectedDate, setSelectedDate] = useState<string>('2024-06-15');

  // 선택된 날짜의 스냅샷 찾기
  const selectedSnapshot = mockInventorySnapshot.rows.find(
    snapshot => snapshot.snapshot_date === selectedDate
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">재고 요약</h1>
        <div className="flex items-center space-x-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border rounded-md"
          />
        </div>
      </div>

      {selectedSnapshot ? (
        <DailyInventorySummary
          date={selectedSnapshot.snapshot_date}
          data={selectedSnapshot}
        />
      ) : (
        <div className="text-center py-8 text-gray-500">
          해당 날짜의 재고 데이터가 없습니다.
        </div>
      )}
    </div>
  );
};

export default InventorySummaryPage; 