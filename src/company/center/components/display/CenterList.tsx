import React, { useEffect } from 'react';
import { useCenters } from '../../hooks/useCenters';
import { CenterCard } from './CenterCard';
import CenterCreateModal from '../modals/CenterCreateModal';
import CenterDetailModal from '../modals/CenterDetailModal';

interface CenterListProps {
  companyId?: string;
}

const CenterList: React.FC<CenterListProps> = ({ companyId }) => {
  const {
    centers,
    loading,
    error,
    fetchCenters,
    clearError
  } = useCenters(companyId);

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedCenter, setSelectedCenter] = React.useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = React.useState(false);

  useEffect(() => {
    fetchCenters();
  }, [fetchCenters]);

  const handleCenterCreated = () => {
    fetchCenters();
  };

  const handleCenterClick = (center: any) => {
    setSelectedCenter(center);
    setIsDetailModalOpen(true);
  };

  const handleCenterUpdated = () => {
    fetchCenters();
  };

  if (loading) {
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
            onClick={() => {
              clearError();
              fetchCenters();
            }}
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
            <CenterCard
              key={center.id}
              center={center}
              onClick={handleCenterClick}
            />
          ))}
        </div>
      )}

      <CenterCreateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleCenterCreated}
        companyId={companyId || ''}
      />

      <CenterDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        center={selectedCenter}
        onSuccess={handleCenterUpdated}
      />
    </div>
  );
};

export default CenterList; 