import React from 'react';
import { Center } from '@/center/types';
import SearchList from '@/shared/components/SearchList';

interface CenterSearchListProps {
  centers: Center[];
  onSelect: (center: Center) => void;
  onCancel: () => void;
}

const CenterSearchList: React.FC<CenterSearchListProps> = ({
  centers,
  onSelect,
  onCancel,
}) => {
  return (
    <SearchList
      items={centers}
      onSelect={onSelect}
      onCancel={onCancel}
      searchFields={(center) => [
        center.name,
        center.address || '',
        center.phone || '',
        center.type || ''
      ]}
      renderItem={(center) => (
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium">{center.name}</p>
            <p className="text-sm text-gray-500">{center.type || '-'}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">{center.address || '-'}</p>
            <p className="text-sm text-gray-500">{center.phone || '-'}</p>
          </div>
        </div>
      )}
      placeholder="센터명 또는 주소로 검색..."
    />
  );
};

export default CenterSearchList; 