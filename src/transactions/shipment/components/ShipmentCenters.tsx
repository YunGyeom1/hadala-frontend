import React from 'react';
import CenterSearch from '@/company/center/components/search/CenterSearch';
import { Center } from '@/company/center/types';

interface ShipmentCentersProps {
  selectedDepartureCenter: Center | null;
  selectedArrivalCenter: Center | null;
  supplierCompanyId?: string;
  receiverCompanyId?: string;
  onDepartureCenterSelect: (center: Center) => void;
  onArrivalCenterSelect: (center: Center) => void;
  onDepartureCenterRemove: () => void;
  onArrivalCenterRemove: () => void;
}

const ShipmentCenters: React.FC<ShipmentCentersProps> = ({
  selectedDepartureCenter,
  selectedArrivalCenter,
  supplierCompanyId,
  receiverCompanyId,
  onDepartureCenterSelect,
  onArrivalCenterSelect,
  onDepartureCenterRemove,
  onArrivalCenterRemove,
}) => {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-4 border-b pb-2">Center Information</h2>
      <div className="grid grid-cols-2 gap-6">
        {/* Departure Center */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Departure Center</label>
          {selectedDepartureCenter ? (
            <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">{selectedDepartureCenter.name}</p>
                  <p className="text-sm text-gray-500">{selectedDepartureCenter.address || '-'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{selectedDepartureCenter.region || '-'}</p>
                  <button
                    type="button"
                    onClick={onDepartureCenterRemove}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    Change
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <CenterSearch
              companyId={supplierCompanyId}
              onSelect={onDepartureCenterSelect}
              placeholder={supplierCompanyId ? "Search supplier company centers..." : "Search by center name..."}
            />
          )}
        </div>

        {/* Arrival Center */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Arrival Center</label>
          {selectedArrivalCenter ? (
            <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">{selectedArrivalCenter.name}</p>
                  <p className="text-sm text-gray-500">{selectedArrivalCenter.address || '-'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{selectedArrivalCenter.region || '-'}</p>
                  <button
                    type="button"
                    onClick={onArrivalCenterRemove}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    Change
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <CenterSearch
              companyId={receiverCompanyId}
              onSelect={onArrivalCenterSelect}
              placeholder={receiverCompanyId ? "Search receiver company centers..." : "Search by center name..."}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ShipmentCenters; 