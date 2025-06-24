import React from 'react';
import { ContractResponse } from '@/transactions/contract/types';

interface ShipmentBasicInfoProps {
  title: string;
  shipment_datetime: string;
  contractId: string;
  allContracts: ContractResponse[];
  isEditMode: boolean;
  onTitleChange: (value: string) => void;
  onShipmentDateChange: (value: string) => void;
  onContractChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const ShipmentBasicInfo: React.FC<ShipmentBasicInfoProps> = ({
  title,
  shipment_datetime,
  contractId,
  allContracts,
  isEditMode,
  onTitleChange,
  onShipmentDateChange,
  onContractChange,
}) => {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-4 border-b pb-2">기본 정보</h2>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label htmlFor="contract_id" className="block text-xs font-semibold text-gray-600 mb-1">
            연결된 계약
          </label>
          <select
            id="contract_id"
            name="contract_id"
            value={contractId}
            onChange={onContractChange}
            className="select select-bordered w-full"
            disabled={isEditMode}
          >
            <option value="">계약을 선택하세요</option>
            {allContracts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

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