import React from 'react';
import ProfileSearch from '@/profile/ProfileSearch';
import { Company, Profile } from '@/transactions/contract/types';

interface ShipmentPartiesProps {
  selectedSupplierPerson: Profile | null;
  selectedReceiverPerson: Profile | null;
  selectedSupplierCompany: Company | null;
  selectedReceiverCompany: Company | null;
  onSupplierPersonSelect: (profile: Profile) => void;
  onReceiverPersonSelect: (profile: Profile) => void;
  onSupplierPersonRemove: () => void;
  onReceiverPersonRemove: () => void;
}

const ShipmentParties: React.FC<ShipmentPartiesProps> = ({
  selectedSupplierPerson,
  selectedReceiverPerson,
  selectedSupplierCompany,
  selectedReceiverCompany,
  onSupplierPersonSelect,
  onReceiverPersonSelect,
  onSupplierPersonRemove,
  onReceiverPersonRemove,
}) => {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-4 border-b pb-2">계약 당사자 및 출하 담당자</h2>
      <div className="grid grid-cols-2 gap-6">
        {/* 공급 담당자 */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">공급 담당자</label>
          {selectedSupplierPerson ? (
            <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">{selectedSupplierPerson.name || selectedSupplierPerson.username}</p>
                  <p className="text-sm text-gray-500">{selectedSupplierPerson.username}</p>
                </div>
                <div className="text-right">
                  <button
                    type="button"
                    onClick={onSupplierPersonRemove}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    변경
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <ProfileSearch onSelect={onSupplierPersonSelect} />
          )}
        </div>

        {/* 수신 담당자 */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">수신 담당자</label>
          {selectedReceiverPerson ? (
            <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">{selectedReceiverPerson.name || selectedReceiverPerson.username}</p>
                  <p className="text-sm text-gray-500">{selectedReceiverPerson.username}</p>
                </div>
                <div className="text-right">
                  <button
                    type="button"
                    onClick={onReceiverPersonRemove}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    변경
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <ProfileSearch onSelect={onReceiverPersonSelect} />
          )}
        </div>

        {/* 공급 회사 (읽기 전용) */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">공급 회사</label>
          {selectedSupplierCompany ? (
            <div className="w-full h-[72px] px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 flex items-center">
              <div className="flex justify-between items-center w-full">
                <div>
                  <p className="font-medium text-gray-900 overflow-hidden text-ellipsis whitespace-nowrap max-w-[160px]">
                    {selectedSupplierCompany.name}
                  </p>
                  <p className="text-sm text-gray-500">{selectedSupplierCompany.business_number || '-'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{selectedSupplierCompany.address || '-'}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-[72px] px-4 py-3 border border-dashed border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center">
              <p className="text-sm text-gray-500">계약을 먼저 선택해주세요</p>
            </div>
          )}
        </div>

        {/* 수신 회사 (읽기 전용) */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">수신 회사</label>
          {selectedReceiverCompany ? (
            <div className="w-full h-[72px] px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 flex items-center">
              <div className="flex justify-between items-center w-full">
                <div>
                  <p className="font-medium text-gray-900 overflow-hidden text-ellipsis whitespace-nowrap max-w-[160px]">
                    {selectedReceiverCompany.name}
                  </p>
                  <p className="text-sm text-gray-500">{selectedReceiverCompany.business_number || '-'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{selectedReceiverCompany.address || '-'}</p>
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

export default ShipmentParties; 