import React from 'react';
import { DailyInventorySnapshot } from './types';
import { ProductQuality } from '../common/types';

const qualityOrder = [ProductQuality.A, ProductQuality.B, ProductQuality.C];

interface DailyInventorySummaryProps {
  date: string;
  data: DailyInventorySnapshot;
}

const DailyInventorySummary: React.FC<DailyInventorySummaryProps> = ({ date, data }) => {
  // 모든 작물 이름 수집
  const cropNames = Array.from(
    new Set(data.centers.flatMap(center => 
      center.items.map(item => item.product_name)
    ))
  ).sort();

  return (
    <div className="space-y-6">
      {/* 날짜 표시 */}
      <div className="flex items-center space-x-4">
        <h2 className="text-lg font-medium text-gray-900">
          {new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })} Inventory Status
        </h2>
      </div>

      {/* 요약 테이블 */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 border-b">Crop</th>
              {data.centers.map(center => (
                <th key={center.center_id} className="px-4 py-2 border-b">
                  {center.center_name}
                </th>
              ))}
              <th className="px-4 py-2 border-b">Total</th>
            </tr>
          </thead>
          <tbody>
            {cropNames.map(crop => (
              <React.Fragment key={crop}>
                {qualityOrder.map(quality => {
                  const rowData = data.centers.map(center => {
                    const item = center.items.find(
                      item => item.product_name === crop && item.quality === quality
                    );
                    return {
                      center_id: center.center_id,
                      quantity: item?.quantity || 0,
                      unit_price: item?.unit_price || 0,
                      total_price: item?.total_price || 0
                    };
                  });

                  if (rowData.every(data => data.quantity === 0)) return null;

                  const total = rowData.reduce((sum, data) => sum + data.quantity, 0);

                  return (
                    <tr key={`${crop}-${quality}`} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border-b">
                        {crop} ({quality})
                      </td>
                      {rowData.map(data => (
                        <td key={data.center_id} className="px-4 py-2 border-b text-right">
                          {data.quantity > 0 ? data.quantity.toLocaleString() : '-'}
                        </td>
                      ))}
                      <td className="px-4 py-2 border-b text-right font-semibold">
                        {total.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 border-b font-semibold">
                    {crop} Total
                  </td>
                  {data.centers.map(center => {
                    const centerTotal = center.items
                      .filter(item => item.product_name === crop)
                      .reduce((sum, item) => sum + item.quantity, 0);
                    return (
                      <td key={center.center_id} className="px-4 py-2 border-b text-right font-semibold">
                        {centerTotal.toLocaleString()}
                      </td>
                    );
                  })}
                  <td className="px-4 py-2 border-b text-right font-semibold">
                    {data.centers
                      .flatMap(center => center.items)
                      .filter(item => item.product_name === crop)
                      .reduce((sum, item) => sum + item.quantity, 0)
                      .toLocaleString()}
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DailyInventorySummary; 