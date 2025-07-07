import React from 'react';
import ProfileSearch from '@/profile/ProfileSearch';
import CompanySearch from '@/company/company/components/search/CompanySearch';
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
  onSupplierCompanySelect: (company: Company) => void;
  onReceiverCompanySelect: (company: Company) => void;
  onSupplierCompanyRemove: () => void;
  onReceiverCompanyRemove: () => void;
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
  onSupplierCompanySelect,
  onReceiverCompanySelect,
  onSupplierCompanyRemove,
  onReceiverCompanyRemove,
}) => {
  const onSearch = (query: string) => {
    console.log('Search query:', query);
  };

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-4 border-b pb-2">Contract Parties and Shipment Personnel</h2>
      <div className="grid grid-cols-2 gap-6">
        {/* Supplier (User) */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Supplier (User)</label>
          {selectedSupplierPerson ? (
            <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">{selectedSupplierPerson.name || selectedSupplierPerson.username}</p>
                  <p className="text-sm text-gray-500">{selectedSupplierPerson.username}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap max-w-[120px]">
                    {selectedSupplierPerson?.company_name || '-'}
                  </p>
                  <button
                    type="button"
                    onClick={onSupplierPersonRemove}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    Change
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <ProfileSearch onSelect={onSupplierPersonSelect} />
          )}
        </div>

        {/* Receiver (User) */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Receiver (User)</label>
          {selectedReceiverPerson ? (
            <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">{selectedReceiverPerson.name || selectedReceiverPerson.username}</p>
                  <p className="text-sm text-gray-500">{selectedReceiverPerson.username}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap max-w-[120px]">
                    {selectedReceiverPerson?.company_name || '-'}
                  </p>
                  <button
                    type="button"
                    onClick={onReceiverPersonRemove}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    Change
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <ProfileSearch onSelect={onReceiverPersonSelect} />
          )}
        </div>

        {/* Supplier Company */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Supplier Company</label>
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
                    Change
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <CompanySearch onSelect={onSupplierCompanySelect} onSearch={onSearch} />
          )}
        </div>

        {/* Receiver Company */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Receiver Company</label>
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
                    Change
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

export default ShipmentParties; 