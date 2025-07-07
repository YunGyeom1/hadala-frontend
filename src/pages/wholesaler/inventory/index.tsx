import React, { useState } from 'react';
import { format } from 'date-fns';
import DailyInventorySummary from '@/transactions/inventory/DailyInventorySummary';
import { mockInventorySnapshot } from '@/transactions/inventory/mock';

const InventoryPage = () => {
  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(), 'yyyy-MM-dd')
  );

  // Find snapshot for selected date
  const selectedSnapshot = mockInventorySnapshot.rows.find(
    snapshot => snapshot.snapshot_date === selectedDate
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Inventory Status</h1>
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
          No inventory data available for the selected date.
        </div>
      )}
    </div>
  );
};

export default InventoryPage;

