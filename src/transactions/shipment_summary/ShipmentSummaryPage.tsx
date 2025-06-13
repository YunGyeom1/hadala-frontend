import React, { useState } from 'react';
import DailyShipmentSummary from './DailyShipmentSummary';
import { mockShipmentSummary } from './mock';

const ShipmentSummaryPage: React.FC = () => {
  // 날짜 선택을 위한 상태
  const [selectedDate, setSelectedDate] = useState<string>('2024-03-20');

  // 모든 날짜 수집
  const dates = Array.from(
    new Set(mockShipmentSummary.rows.map(row => row.shipment_date))
  ).sort();

  // 선택된 날짜의 데이터만 필터링
  const filteredData = {
    rows: mockShipmentSummary.rows.filter(row => row.shipment_date === selectedDate)
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">출하 현황 요약</h1>
        <select
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="mt-1 block w-48 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        >
          {dates.map(date => (
            <option key={date} value={date}>
              {new Date(date).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </option>
          ))}
        </select>
      </div>
      <DailyShipmentSummary date={selectedDate} data={filteredData} />
    </div>
  );
};

export default ShipmentSummaryPage; 