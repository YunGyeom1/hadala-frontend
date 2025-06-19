import React from 'react';
import { Center } from './types';

interface CenterListProps {
  centers: Center[];
  onAdd?: () => void;
}

const CenterList: React.FC<CenterListProps> = ({ centers, onAdd }) => {
  return (
    <div className="bg-white rounded-lg shadow h-[600px]">
      <div className="p-6 h-full flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-base font-medium">센터 목록</h4>
          {onAdd && (
            <button
              onClick={onAdd}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              센터 추가
            </button>
          )}
        </div>
        <div className="flex-1 overflow-y-auto">
          {centers.length > 0 ? (
            <div className="space-y-4">
              {centers.map((center) => (
                <div
                  key={center.id}
                  className="flex justify-between items-center p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{center.name}</p>
                    <p className="text-sm text-gray-500">{center.address || '-'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{center.phone || '-'}</p>
                    <p className="text-sm text-gray-500">
                      {center.operating_start && center.operating_end
                        ? `${center.operating_start} - ${center.operating_end}`
                        : '-'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-4">
              등록된 센터가 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CenterList; 