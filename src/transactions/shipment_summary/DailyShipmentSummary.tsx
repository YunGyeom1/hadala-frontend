import React from 'react';
import { SummaryResponse } from './types';
import { ProductQuality } from '../common/types';

const qualityOrder = [ProductQuality.A, ProductQuality.B, ProductQuality.C];

interface DailyShipmentSummaryProps {
  date: string;
  data: SummaryResponse;
}

const DailyShipmentSummary: React.FC<DailyShipmentSummaryProps> = ({ date, data }) => {
  // Collect all center names
  const centerNames = Array.from(
    new Set(data.daily_summaries[0]?.center_summaries.map(center => center.center_name) || [])
  ).sort();

  // 모든 작물 이름 수집
  const cropNames = Array.from(
    new Set(
      data.daily_summaries[0]?.center_summaries.flatMap(center => 
        center.items.map(item => item.product_name)
      ) || []
    )
  ).sort();

  const getItemQuantity = (centerName: string, productName: string, quality: ProductQuality): number => {
    const center = data.daily_summaries[0]?.center_summaries.find(c => c.center_name === centerName);
    if (!center) return 0;
    
    const item = center.items.find(i => i.product_name === productName && i.quality === quality);
    return item ? item.quantity : 0;
  };

  const getCenterTotal = (centerName: string, productName: string): number => {
    const center = data.daily_summaries[0]?.center_summaries.find(c => c.center_name === centerName);
    if (!center) return 0;
    
    return center.items
      .filter(item => item.product_name === productName)
      .reduce((sum, item) => sum + item.quantity, 0);
  };

  const getProductTotal = (productName: string): number => {
    return data.daily_summaries[0]?.center_summaries.flatMap(center => 
      center.items.filter(item => item.product_name === productName)
    ).reduce((sum, item) => sum + item.quantity, 0) || 0;
  };

  const getGrandTotal = (): number => {
    return data.daily_summaries[0]?.center_summaries.flatMap(center => 
      center.items
    ).reduce((sum, item) => sum + item.quantity, 0) || 0;
  };

  return (
    <div className="space-y-6">
      {/* 날짜 표시 */}
      <div className="flex items-center space-x-4">
        <h2 className="text-lg font-medium text-gray-900">
          {new Date(date).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })} {data.direction === 'outbound' ? 'Outbound' : 'Inbound'} Status
        </h2>
      </div>

      {/* 요약 테이블 */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 border-b">Crop</th>
              {centerNames.map(center => (
                <th key={center} className="px-4 py-2 border-b">
                  {center}
                </th>
              ))}
              <th className="px-4 py-2 border-b">Total</th>
            </tr>
          </thead>
          <tbody>
            {cropNames.map(crop => (
              <React.Fragment key={crop}>
                {qualityOrder.map(quality => {
                  const hasData = centerNames.some(center => 
                    getItemQuantity(center, crop, quality) > 0
                  );
                  
                  if (!hasData) return null;

                  return (
                    <tr key={`${crop}-${quality}`} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border-b">
                        {crop} ({quality})
                      </td>
                      {centerNames.map(center => {
                        const quantity = getItemQuantity(center, crop, quality);
                        return (
                          <td key={center} className="px-4 py-2 border-b text-right">
                            {quantity > 0 ? quantity.toLocaleString() : '-'}
                          </td>
                        );
                      })}
                      <td className="px-4 py-2 border-b text-right font-semibold">
                        {qualityOrder
                          .map(q => centerNames.reduce((sum, center) => 
                            sum + getItemQuantity(center, crop, q), 0
                          ))
                          .reduce((sum, qty) => sum + qty, 0)
                          .toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 border-b font-semibold">
                    {crop} Total
                  </td>
                  {centerNames.map(center => {
                    const centerTotal = getCenterTotal(center, crop);
                    return (
                      <td key={center} className="px-4 py-2 border-b text-right font-semibold">
                        {centerTotal.toLocaleString()}
                      </td>
                    );
                  })}
                  <td className="px-4 py-2 border-b text-right font-semibold">
                    {getProductTotal(crop).toLocaleString()}
                  </td>
                </tr>
              </React.Fragment>
            ))}
            {/* 전체 합계 행 */}
            <tr className="bg-blue-50">
              <td className="px-4 py-2 border-b font-bold">Grand Total</td>
              {centerNames.map(center => {
                const centerGrandTotal = cropNames.reduce((sum, crop) => 
                  sum + getCenterTotal(center, crop), 0
                );
                return (
                  <td key={center} className="px-4 py-2 border-b text-right font-bold">
                    {centerGrandTotal.toLocaleString()}
                  </td>
                );
              })}
              <td className="px-4 py-2 border-b text-right font-bold">
                {getGrandTotal().toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DailyShipmentSummary; 