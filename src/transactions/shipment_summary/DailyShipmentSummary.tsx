import React from 'react';
import { ShipmentSummary } from './types';
import { ProductQuality } from '../common/types';

const qualityOrder = [ProductQuality.A, ProductQuality.B, ProductQuality.C];

interface DailyShipmentSummaryProps {
  date: string;
  data: ShipmentSummary;
}

const DailyShipmentSummary: React.FC<DailyShipmentSummaryProps> = ({ date, data }) => {
  // 모든 센터 이름 수집
  const centerNames = Array.from(
    new Set(data.rows.map(row => row.center_name))
  ).sort();

  // 모든 작물 이름 수집
  const cropNames = Array.from(
    new Set(data.rows.map(row => row.product_name))
  ).sort();

  return (
    <div className="space-y-6">
      {/* 날짜 표시 */}
      <div className="flex items-center space-x-4">
        <h2 className="text-lg font-medium text-gray-900">
          {new Date(date).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })} 출하 현황
        </h2>
      </div>

      {/* 요약 테이블 */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 border-b">작물</th>
              {centerNames.map(center => (
                <th key={center} className="px-4 py-2 border-b">
                  {center}
                </th>
              ))}
              <th className="px-4 py-2 border-b">합계</th>
            </tr>
          </thead>
          <tbody>
            {cropNames.map(crop => (
              <React.Fragment key={crop}>
                {qualityOrder.map(quality => {
                  const rowData = data.rows.filter(
                    row => row.product_name === crop && row.quality === quality
                  );
                  
                  if (rowData.length === 0) return null;

                  const total = rowData.reduce((sum, row) => sum + row.quantity, 0);

                  return (
                    <tr key={`${crop}-${quality}`} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border-b">
                        {crop} ({quality})
                      </td>
                      {centerNames.map(center => {
                        const centerData = rowData.find(row => row.center_name === center);
                        return (
                          <td key={center} className="px-4 py-2 border-b text-right">
                            {centerData ? centerData.quantity.toLocaleString() : '-'}
                          </td>
                        );
                      })}
                      <td className="px-4 py-2 border-b text-right font-semibold">
                        {total.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 border-b font-semibold">
                    {crop} 합계
                  </td>
                  {centerNames.map(center => {
                    const centerTotal = data.rows
                      .filter(row => row.product_name === crop && row.center_name === center)
                      .reduce((sum, row) => sum + row.quantity, 0);
                    return (
                      <td key={center} className="px-4 py-2 border-b text-right font-semibold">
                        {centerTotal.toLocaleString()}
                      </td>
                    );
                  })}
                  <td className="px-4 py-2 border-b text-right font-semibold">
                    {data.rows
                      .filter(row => row.product_name === crop)
                      .reduce((sum, row) => sum + row.quantity, 0)
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

export default DailyShipmentSummary; 