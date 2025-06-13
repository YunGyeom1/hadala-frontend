import React, { useState } from 'react';
import { ContractResponse } from './types';
import { ContractStatus } from '../common/types';
import ContractDetail from './ContractDetail';

interface ContractListProps {
  contracts: ContractResponse[];
}

const getStatusText = (status: ContractStatus): string => {
  switch (status) {
    case ContractStatus.DRAFT:
      return '초안';
    case ContractStatus.PENDING:
      return '검토중';
    case ContractStatus.APPROVED:
      return '승인됨';
    case ContractStatus.REJECTED:
      return '거절됨';
    case ContractStatus.CANCELLED:
      return '취소됨';
    case ContractStatus.COMPLETED:
      return '완료됨';
    default:
      return '알 수 없음';
  }
};

const ContractList: React.FC<ContractListProps> = ({ contracts }) => {
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);

  const selectedContract = contracts.find(contract => contract.id === selectedContractId);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {contracts.map((contract) => (
          <div
            key={contract.id}
            className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedContractId(contract.id === selectedContractId ? null : contract.id)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{contract.title}</h3>
                <p className="text-gray-600">
                  {contract.supplier_company_name} → {contract.receiver_company_name}
                </p>
                <p className="text-sm text-gray-500">
                  계약일: {contract.contract_datetime?.toLocaleDateString()}
                </p>
              </div>
              <span className={`px-2 py-1 rounded text-sm ${
                contract.contract_status === ContractStatus.APPROVED ? 'bg-green-100 text-green-800' :
                contract.contract_status === ContractStatus.PENDING ? 'bg-yellow-100 text-yellow-800' :
                contract.contract_status === ContractStatus.REJECTED ? 'bg-red-100 text-red-800' :
                contract.contract_status === ContractStatus.CANCELLED ? 'bg-gray-100 text-gray-800' :
                contract.contract_status === ContractStatus.COMPLETED ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {getStatusText(contract.contract_status)}
              </span>
            </div>
            {selectedContractId === contract.id && selectedContract && (
              <div className="mt-4">
                <ContractDetail contract={selectedContract} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContractList; 