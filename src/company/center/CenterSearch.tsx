import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { centerService } from './services/centerService';
import { Center } from './types';
import SearchList from '@/shared/SearchList';

interface CenterSearchProps {
  onSelect: (center: Center) => void;
  onCancel: () => void;
}

const CenterSearch: React.FC<CenterSearchProps> = ({ 
  onSelect, 
  onCancel
}) => {
  // 센터 목록 조회
  const { data: centers = [], isLoading } = useQuery({
    queryKey: ['centers'],
    queryFn: () => centerService.getCenters(),
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow h-[600px]">
        <div className="p-6 h-full flex items-center justify-center">
          <div className="text-gray-500">로딩 중...</div>
        </div>
      </div>
    );
  }

  return (
    <SearchList
      items={centers}
      onSelect={onSelect}
      onCancel={onCancel}
      searchFields={(center) => [
        center.name,
        center.address || '',
        center.phone || ''
      ]}
      renderItem={(center) => (
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium">{center.name}</p>
            <p className="text-sm text-gray-500">{center.address || '-'}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">{center.phone || '-'}</p>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                center.is_operational
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {center.is_operational ? '운영중' : '운영중지'}
            </span>
          </div>
        </div>
      )}
      placeholder="센터명 또는 주소로 검색..."
    />
  );
};

export default CenterSearch; 