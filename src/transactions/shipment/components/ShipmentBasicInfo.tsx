import React from 'react';
import { ContractResponse } from '@/transactions/contract/types';
import { ContractSearch } from '@/transactions/contract';

interface ShipmentBasicInfoProps {
  title: string;
  shipment_datetime: string;
  contractId: string;
  selectedContract: ContractResponse | null;
  isEditMode: boolean;
  createNewContract: boolean;
  onTitleChange: (value: string) => void;
  onShipmentDateChange: (value: string) => void;
  onContractSelect: (contract: ContractResponse) => void;
  onContractRemove: () => void;
  onCreateNewContractChange: (value: boolean) => void;
}

const ShipmentBasicInfo: React.FC<ShipmentBasicInfoProps> = ({
  title,
  shipment_datetime,
  contractId,
  selectedContract,
  isEditMode,
  createNewContract,
  onTitleChange,
  onShipmentDateChange,
  onContractSelect,
  onContractRemove,
  onCreateNewContractChange,
}) => {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-4 border-b pb-2">기본 정보</h2>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label htmlFor="contract_selection" className="block text-xs font-semibold text-gray-600 mb-1">
            계약 연결 방식
          </label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="existing_contract"
                name="contract_type"
                checked={!createNewContract}
                onChange={() => onCreateNewContractChange(false)}
                disabled={isEditMode}
                className="radio radio-primary"
              />
              <label htmlFor="existing_contract" className="text-sm">기존 계약 연결</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="new_contract"
                name="contract_type"
                checked={createNewContract}
                onChange={() => onCreateNewContractChange(true)}
                disabled={isEditMode}
                className="radio radio-primary"
              />
              <label htmlFor="new_contract" className="text-sm">새 계약 생성</label>
            </div>
          </div>
        </div>

        {!createNewContract ? (
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              연결된 계약
            </label>
            {selectedContract ? (
              <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{selectedContract.title}</p>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                      <span>공급: {selectedContract.supplier_company?.name || '-'}</span>
                      <span>수신: {selectedContract.receiver_company?.name || '-'}</span>
                    </div>
                    <div className="flex items-center space-x-4 mt-1 text-xs text-gray-400">
                      <span>계약일: {selectedContract.contract_datetime ? new Date(selectedContract.contract_datetime).toLocaleDateString() : '-'}</span>
                      <span>상태: {selectedContract.contract_status || '-'}</span>
                      <span>결제: {selectedContract.payment_status || '-'}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 font-medium">{selectedContract.total_price?.toLocaleString()}원</p>
                    <button
                      type="button"
                      onClick={onContractRemove}
                      className="text-xs text-red-500 hover:text-red-700 mt-1"
                    >
                      변경
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <ContractSearch
                onSelect={onContractSelect}
                placeholder="계약을 검색하세요..."
                disabled={isEditMode}
              />
            )}
          </div>
        ) : (
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              새 계약 정보
            </label>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                출하와 함께 새로운 계약이 생성됩니다.
              </p>
              <p className="text-xs text-blue-600 mt-1">
                • 계약일/배송일: 출하일과 동일<br/>
                • 결제기한: 출하월 말일<br/>
                • 계약상태: 자동 설정<br/>
                • 결제상태: 미결제
              </p>
            </div>
          </div>
        )}

        <div>
          <label htmlFor="title" className="block text-xs font-semibold text-gray-600 mb-1">
            출하명
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="input input-bordered w-full"
            placeholder="예: 2024년 5월 정기 출하"
          />
        </div>
        
        <div>
          <label htmlFor="shipment_datetime" className="block text-xs font-semibold text-gray-600 mb-1">
            출하일
          </label>
          <input
            type="date"
            id="shipment_datetime"
            name="shipment_datetime"
            value={shipment_datetime}
            onChange={(e) => onShipmentDateChange(e.target.value)}
            className="input input-bordered w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default ShipmentBasicInfo; 