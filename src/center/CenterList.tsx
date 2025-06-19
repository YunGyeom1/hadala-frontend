import React, { useState } from 'react';
import { Center } from '@/center/types';
import { mockCenters } from '@/center/mockData';
import CenterSearchList from '@/center/CenterSearchList';

interface CenterListProps {
  companyId: string;
}

const CenterList: React.FC<CenterListProps> = ({ companyId }) => {
  const [isSearching, setIsSearching] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  // TODO: API 연동 시 실제 API 호출로 변경
  const [centers, setCenters] = useState<Center[]>(
    mockCenters.filter(center => center.company_id === companyId)
  );

  const handleAddCenter = (center: Center) => {
    // TODO: API 연동 시 실제 API 호출로 변경
    console.log('Add center:', center);
    setIsSearching(false);
  };

  const handleDeleteCenter = (centerId: string) => {
    // TODO: API 연동 시 실제 API 호출로 변경
    setCenters(centers.filter(center => center.id !== centerId));
  };

  return (
    <div className="bg-white rounded-lg shadow h-[600px]">
      <div className="p-6 h-full flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-base font-medium">농작물 집하장 목록</h4>
          <div className="flex gap-2">
            {!isSearching && (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  isEditing
                    ? 'bg-gray-600 text-white hover:bg-gray-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {isEditing ? '편집 완료' : '집하장 편집'}
              </button>
            )}
            {!isSearching && !isEditing && (
              <button
                onClick={() => setIsSearching(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                집하장 추가
              </button>
            )}
          </div>
        </div>

        {isSearching ? (
          <CenterSearchList
            centers={mockCenters}
            onSelect={handleAddCenter}
            onCancel={() => setIsSearching(false)}
          />
        ) : (
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
                      <p className="text-sm text-gray-500">{center.type}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-500">{center.address || '-'}</p>
                        <p className="text-sm text-gray-500">{center.phone || '-'}</p>
                      </div>
                      {isEditing && (
                        <button
                          onClick={() => handleDeleteCenter(center.id)}
                          className="p-2 text-red-600 hover:text-red-800"
                          title="삭제"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-4">
                등록된 집하장이 없습니다.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CenterList; 