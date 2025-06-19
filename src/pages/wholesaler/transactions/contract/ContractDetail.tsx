import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockContracts } from '@/transactions/contract/mock';
import { ContractResponse } from '@/transactions/contract/types';
import { ContractStatus } from '@/transactions/common/types';
import { format } from 'date-fns';

const ContractDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [contract, setContract] = useState<ContractResponse | null>(null);

  useEffect(() => {
    // TODO: API 연동 시 실제 API 호출로 변경
    const foundContract = mockContracts.find(c => c.id === id);
    if (foundContract) {
      setContract(foundContract);
    }
  }, [id]);

  if (!contract) {
    return <div>계약을 찾을 수 없습니다.</div>;
  }

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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">계약 상세</h1>
        <div className="space-x-2">
          <button
            onClick={() => navigate('/wholesaler/transactions/contracts')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            목록으로
          </button>
          <button
            onClick={() => navigate(`/wholesaler/transactions/contracts/${id}/edit`)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            수정
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-medium mb-4">기본 정보</h2>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">제목</dt>
                  <dd className="mt-1 text-sm text-gray-900">{contract.title}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">상태</dt>
                  <dd className="mt-1">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(contract.contract_status)}`}>
                      {getStatusLabel(contract.contract_status)}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">계약일</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {contract.contract_datetime
                      ? format(new Date(contract.contract_datetime), 'yyyy-MM-dd')
                      : '-'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">납기일</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {contract.delivery_datetime
                      ? format(new Date(contract.delivery_datetime), 'yyyy-MM-dd')
                      : '-'}
                  </dd>
                </div>
              </dl>
            </div>
            <div>
              <h2 className="text-lg font-medium mb-4">거래처 정보</h2>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">공급자</dt>
                  <dd className="mt-1 text-sm text-gray-900">{contract.supplier_company_name || '-'}</dd>
                  <dd className="text-sm text-gray-500">{contract.supplier_person_username || '-'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">수신자</dt>
                  <dd className="mt-1 text-sm text-gray-900">{contract.receiver_company_name || '-'}</dd>
                  <dd className="text-sm text-gray-500">{contract.receiver_person_username || '-'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">출발 센터</dt>
                  <dd className="mt-1 text-sm text-gray-900">{contract.departure_center_name || '-'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">도착 센터</dt>
                  <dd className="mt-1 text-sm text-gray-900">{contract.arrival_center_name || '-'}</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-medium mb-4">계약 품목</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      품목명
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      품질
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      수량
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      단가
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      금액
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {contract.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.product_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.quality}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.quantity.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.unit_price.toLocaleString()}원
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.total_price.toLocaleString()}원
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                      총계
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {contract.total_price.toLocaleString()}원
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {contract.notes && (
            <div className="mt-8">
              <h2 className="text-lg font-medium mb-4">비고</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-900 whitespace-pre-wrap">{contract.notes}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContractDetail; 