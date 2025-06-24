import React, { useState } from 'react';
import ProfileSearch from '@/profile/ProfileSearch';
import { CompanySearch } from '@/company/company';
import { Profile, Company } from '../types';

interface ContractPartiesProps {
  selectedSupplier: Profile | null;
  selectedReceiver: Profile | null;
  selectedSupplierCompany: Company | null;
  selectedReceiverCompany: Company | null;
  onSupplierSelect: (profile: Profile) => void;
  onReceiverSelect: (profile: Profile) => void;
  onSupplierCompanySelect: (company: Company) => void;
  onReceiverCompanySelect: (company: Company) => void;
  onSupplierRemove: () => void;
  onReceiverRemove: () => void;
  onSupplierCompanyRemove: () => void;
  onReceiverCompanyRemove: () => void;
}

const ContractParties: React.FC<ContractPartiesProps> = ({
  selectedSupplier,
  selectedReceiver,
  selectedSupplierCompany,
  selectedReceiverCompany,
  onSupplierSelect,
  onReceiverSelect,
  onSupplierCompanySelect,
  onReceiverCompanySelect,
  onSupplierRemove,
  onReceiverRemove,
  onSupplierCompanyRemove,
  onReceiverCompanyRemove,
}) => {
  const onSearch = (query: string) => {
    console.log('Search query:', query);
  };

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-4 border-b pb-2">계약 당사자</h2>
      <div className="grid grid-cols-2 gap-6">
        {/* 공급자(유저) */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">공급자(유저)</label>
          {selectedSupplier ? (
            <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">{selectedSupplier.name || selectedSupplier.username}</p>
                  <p className="text-sm text-gray-500">{selectedSupplier.username}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap max-w-[120px]">
                    {selectedSupplier?.company_name || '-'}
                  </p>
                  <button
                    type="button"
                    onClick={onSupplierRemove}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    변경
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <ProfileSearch onSelect={onSupplierSelect} />
          )}
        </div>

        {/* 수신자(유저) */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">수신자(유저)</label>
          {selectedReceiver ? (
            <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">{selectedReceiver.name || selectedReceiver.username}</p>
                  <p className="text-sm text-gray-500">{selectedReceiver.username}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap max-w-[120px]">
                    {selectedReceiver?.company_name || '-'}
                  </p>
                  <button
                    type="button"
                    onClick={onReceiverRemove}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    변경
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <ProfileSearch onSelect={onReceiverSelect} />
          )}
        </div>

        {/* 공급 회사 */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">공급 회사</label>
          {selectedSupplierCompany ? (
            <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900 overflow-hidden text-ellipsis whitespace-nowrap max-w-[160px]">
                    {selectedSupplierCompany.name}
                  </p>
                  <p className="text-sm text-gray-500">{selectedSupplierCompany.business_number || '-'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{selectedSupplierCompany.address || '-'}</p>
                  <button
                    type="button"
                    onClick={onSupplierCompanyRemove}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    변경
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <CompanySearch onSelect={onSupplierCompanySelect} onSearch={onSearch} />
          )}
        </div>

        {/* 수신 회사 */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">수신 회사</label>
          {selectedReceiverCompany ? (
            <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900 overflow-hidden text-ellipsis whitespace-nowrap max-w-[160px]">
                    {selectedReceiverCompany.name}
                  </p>
                  <p className="text-sm text-gray-500">{selectedReceiverCompany.business_number || '-'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{selectedReceiverCompany.address || '-'}</p>
                  <button
                    type="button"
                    onClick={onReceiverCompanyRemove}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    변경
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <CompanySearch onSelect={onReceiverCompanySelect} onSearch={onSearch} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ContractParties; 