import React from 'react';
import { Center } from '@/company/center';

interface ShipmentCentersProps {
  selectedDepartureCenter: Center | null;
  selectedArrivalCenter: Center | null;
}

const ShipmentCenters: React.FC<ShipmentCentersProps> = ({
  selectedDepartureCenter,
  selectedArrivalCenter,
}) => {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-4 border-b pb-2">센터 정보</h2>
      <div className="grid grid-cols-2 gap-6">
        {/* 출발 센터 */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">출발 센터</label>
          {selectedDepartureCenter ? (
            <div className="w-full h-[72px] px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 flex items-center">
              <div className="flex justify-between items-center w-full">
                <div>
                  <p className="font-medium text-gray-900">{selectedDepartureCenter.name}</p>
                  <p className="text-sm text-gray-500">{selectedDepartureCenter.address || '-'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{selectedDepartureCenter.region || '-'}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-[72px] px-4 py-3 border border-dashed border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center">
              <p className="text-sm text-gray-500">계약을 먼저 선택해주세요</p>
            </div>
          )}
        </div>

        {/* 도착 센터 */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">도착 센터</label>
          {selectedArrivalCenter ? (
            <div className="w-full h-[72px] px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 flex items-center">
              <div className="flex justify-between items-center w-full">
                <div>
                  <p className="font-medium text-gray-900">{selectedArrivalCenter.name}</p>
                  <p className="text-sm text-gray-500">{selectedArrivalCenter.address || '-'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{selectedArrivalCenter.region || '-'}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-[72px] px-4 py-3 border border-dashed border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center">
              <p className="text-sm text-gray-500">계약을 먼저 선택해주세요</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShipmentCenters; 