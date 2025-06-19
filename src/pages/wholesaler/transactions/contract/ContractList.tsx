import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockContracts } from '@/transactions/contract/mock';
import { ContractResponse } from '@/transactions/contract/types';
import { ContractStatus } from '@/transactions/common/types';
import { format } from 'date-fns';
import { FiChevronDown, FiChevronRight } from 'react-icons/fi';
import ContractDetail from '@/transactions/contract/ContractDetail';

const ContractList = () => {
  const navigate = useNavigate();
  const [contracts] = useState<ContractResponse[]>(mockContracts);
  const [expandedContractId, setExpandedContractId] = useState<string | null>(null);

  const getStatusColor = (status: ContractStatus) => {
    switch (status) {
      case ContractStatus.DRAFT:
        return 'bg-gray-100 text-gray-800';
      case ContractStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case ContractStatus.APPROVED:
        return 'bg-green-100 text-green-800';
      case ContractStatus.REJECTED:
        return 'bg-red-100 text-red-800';
      case ContractStatus.CANCELLED:
        return 'bg-gray-100 text-gray-800';
      case ContractStatus.COMPLETED:
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: ContractStatus) => {
    switch (status) {
      case ContractStatus.DRAFT:
        return '임시저장';
      case ContractStatus.PENDING:
        return '대기중';
      case ContractStatus.APPROVED:
        return '승인됨';
      case ContractStatus.REJECTED:
        return '거절됨';
      case ContractStatus.CANCELLED:
        return '취소됨';
      case ContractStatus.COMPLETED:
        return '완료됨';
      default:
        return status;
    }
  };

  const toggleContract = (contractId: string) => {
    setExpandedContractId(expandedContractId === contractId ? null : contractId);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">계약 관리</h1>
        <button
          onClick={() => navigate('/wholesaler/transactions/contracts/new')}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          계약 생성
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-8 px-6 py-3"></th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  제목
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  공급자
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  수신자
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  계약일
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  총액
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contracts.map((contract) => (
                <React.Fragment key={contract.id}>
                  <tr
                    onClick={() => toggleContract(contract.id)}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      {expandedContractId === contract.id ? (
                        <FiChevronDown className="h-5 w-5 text-gray-400" />
                      ) : (
                        <FiChevronRight className="h-5 w-5 text-gray-400" />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{contract.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{contract.supplier_company_name || '-'}</div>
                      <div className="text-sm text-gray-500">{contract.supplier_person_username || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{contract.receiver_company_name || '-'}</div>
                      <div className="text-sm text-gray-500">{contract.receiver_person_username || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {contract.contract_datetime
                          ? format(new Date(contract.contract_datetime), 'yyyy-MM-dd')
                          : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(contract.contract_status)}`}>
                        {getStatusLabel(contract.contract_status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {contract.total_price.toLocaleString()}원
                    </td>
                  </tr>
                  {expandedContractId === contract.id && (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 bg-gray-50">
                        <ContractDetail contract={contract} />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ContractList; 