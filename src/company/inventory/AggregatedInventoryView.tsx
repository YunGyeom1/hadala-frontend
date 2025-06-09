import React, { useState, useMemo } from 'react';
import { CompanyCropInventory } from './inventory';
import { InventoryFilter } from './InventoryFilter';

interface AggregatedInventoryViewProps {
  inventories: CompanyCropInventory[];
}

export const AggregatedInventoryView: React.FC<AggregatedInventoryViewProps> = ({ inventories }) => {
  const [filters, setFilters] = useState({
    date: '',
    cropName: '',
    qualityGrade: '',
    centerId: '',
  });

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

  // 센터 목록 추출
  const centers = useMemo(() => {
    const uniqueCenters = new Map<string, string>();
    inventories.forEach(inventory => {
      uniqueCenters.set(inventory.center_id, `센터 ${inventory.center_id}`);
    });
    return Array.from(uniqueCenters.entries()).map(([id, name]) => ({ id, name }));
  }, [inventories]);

  // 필터링된 재고 데이터
  const filteredInventories = useMemo(() => {
    return inventories.filter(inventory => {
      if (filters.date && inventory.date !== filters.date) return false;
      if (filters.centerId && inventory.center_id !== filters.centerId) return false;
      return true;
    });
  }, [inventories, filters]);

  // 모든 재고를 작물별, 등급별로 그룹화
  const aggregatedItems = useMemo(() => {
    const items = filteredInventories.reduce((acc, inventory) => {
      inventory.items.forEach(item => {
        if (filters.cropName && item.crop_name !== filters.cropName) return;
        if (filters.qualityGrade && item.quality_grade !== filters.qualityGrade) return;

        const key = `${item.crop_name}-${item.quality_grade}`;
        if (!acc[key]) {
          acc[key] = {
            crop_name: item.crop_name,
            quality_grade: item.quality_grade,
            quantity: 0,
            centers: new Set<string>(),
            centerDetails: new Map<string, number>()
          };
        }
        acc[key].quantity += item.quantity;
        acc[key].centers.add(inventory.center_id);
        acc[key].centerDetails.set(inventory.center_id, (acc[key].centerDetails.get(inventory.center_id) || 0) + item.quantity);
      });
      return acc;
    }, {} as Record<string, {
      crop_name: string;
      quality_grade: string;
      quantity: number;
      centers: Set<string>;
      centerDetails: Map<string, number>;
    }>);

    return Object.values(items).sort((a, b) => {
      if (a.crop_name !== b.crop_name) return a.crop_name.localeCompare(b.crop_name);
      return a.quality_grade.localeCompare(b.quality_grade);
    });
  }, [filteredInventories, filters]);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">전체 재고 현황</h2>
        <p className="text-gray-600">날짜: {formatDate(inventories[0].date)}</p>
      </div>

      <InventoryFilter onFilterChange={setFilters} centers={centers} />

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작물명</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">등급</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">총 수량(kg)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">보관 센터 수</th>
              {centers.map(center => (
                <th key={center.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {center.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {aggregatedItems.map((item, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.crop_name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.quality_grade}등급</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{formatNumber(item.quantity)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.centers.size}개</td>
                {centers.map(center => (
                  <td key={center.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatNumber(item.centerDetails.get(center.id) || 0)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 text-sm text-gray-500">
        <p>생성일: {formatDate(inventories[0].created_at)}</p>
        <p>수정일: {formatDate(inventories[0].updated_at)}</p>
      </div>
    </div>
  );
}; 