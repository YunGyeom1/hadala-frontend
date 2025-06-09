import React from 'react';
import { DailySettlement } from './daily_settlement';

interface DailySettlementViewProps {
  settlements: DailySettlement[];
}

export const DailySettlementView: React.FC<DailySettlementViewProps> = ({ settlements }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString('ko-KR');
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">일일 정산 내역</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">날짜</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">도매 입고(kg)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">도매 입고 금액</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">소매 출고(kg)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">소매 출고 금액</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">입고 차이(kg)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">출고 차이(kg)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">총 입고(kg)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">총 출고(kg)</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {settlements.map((settlement) => (
              <tr key={settlement.id}>
                <td className="px-6 py-4 whitespace-nowrap">{formatDate(settlement.date)}</td>
                <td className="px-6 py-4 whitespace-nowrap">{formatNumber(settlement.total_wholesale_in_kg)}</td>
                <td className="px-6 py-4 whitespace-nowrap">{formatPrice(settlement.total_wholesale_in_price)}</td>
                <td className="px-6 py-4 whitespace-nowrap">{formatNumber(settlement.total_retail_out_kg)}</td>
                <td className="px-6 py-4 whitespace-nowrap">{formatPrice(settlement.total_retail_out_price)}</td>
                <td className="px-6 py-4 whitespace-nowrap">{formatNumber(settlement.discrepancy_in_kg || 0)}</td>
                <td className="px-6 py-4 whitespace-nowrap">{formatNumber(settlement.discrepancy_out_kg || 0)}</td>
                <td className="px-6 py-4 whitespace-nowrap">{formatNumber(settlement.total_in_kg || 0)}</td>
                <td className="px-6 py-4 whitespace-nowrap">{formatNumber(settlement.total_out_kg || 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 