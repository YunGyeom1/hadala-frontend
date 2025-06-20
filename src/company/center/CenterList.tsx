import React, { useState, useEffect } from 'react';
import { centerService } from './services/centerService';
import { Center } from './types';
import CenterCreateModal from './CenterCreateModal';

interface CenterListProps {
  companyId?: string;
}

const CenterList: React.FC<CenterListProps> = ({ companyId }) => {
  const [centers, setCenters] = useState<Center[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadCenters = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await centerService.getCenters(companyId);
      setCenters(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '센터 목록을 불러오는데 실패했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCenters();
  }, [companyId]);

  const handleCenterCreated = () => {
    loadCenters();
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button
            onClick={loadCenters}
            className="mt-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">센터 관리</h3>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          센터 추가
        </button>
      </div>

      {centers.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>등록된 센터가 없습니다.</p>
          <p className="text-sm mt-1">센터 추가 버튼을 클릭하여 새 센터를 등록하세요.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {centers.map((center) => (
            <div key={center.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-900">{center.name}</h4>
                  {center.address && (
                    <p className="text-sm text-gray-600 mt-1">{center.address}</p>
                  )}
                  {center.phone && (
                    <p className="text-sm text-gray-600">{center.phone}</p>
                  )}
                  {center.region && (
                    <p className="text-sm text-gray-600">{center.region}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {center.is_operational !== undefined && (
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      center.is_operational 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {center.is_operational ? '운영중' : '운영중지'}
                    </span>
                  )}
                </div>
              </div>
              {center.operating_start && center.operating_end && (
                <div className="mt-2 text-sm text-gray-600">
                  운영시간: {center.operating_start} ~ {center.operating_end}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <CenterCreateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleCenterCreated}
        companyId={companyId || ''}
      />
    </div>
  );
};

export default CenterList; 