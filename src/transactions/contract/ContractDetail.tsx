import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ContractResponse } from './types';
import { ProductQuality, ContractStatus } from '../common/types';
import { format } from 'date-fns';

interface ContractDetailProps {
  contract?: ContractResponse;
}

const getStatusLabel = (status: ContractStatus | string) => {
  const statusStr = typeof status === 'string' ? status.toLowerCase() : status;
  switch (statusStr) {
    case ContractStatus.DRAFT:
    case 'draft':
      return '초안';
    case ContractStatus.PENDING:
    case 'pending':
      return '검토중';
    case ContractStatus.APPROVED:
    case 'approved':
      return '승인됨';
    case ContractStatus.REJECTED:
    case 'rejected':
      return '거절됨';
    case ContractStatus.CANCELLED:
    case 'cancelled':
      return '취소됨';
    case ContractStatus.COMPLETED:
    case 'completed':
      return '완료됨';
    default:
      return '알 수 없음';
  }
};

const qualityOrder: ProductQuality[] = [ProductQuality.A, ProductQuality.B, ProductQuality.C] as const;

const ContractDetail: React.FC<ContractDetailProps> = ({ contract: propContract }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [contract, setContract] = useState<ContractResponse | null>(propContract || null);

  useEffect(() => {
    if (propContract) {
      setContract(propContract);
    } else if (id) {
      // TODO: API 연동 시 실제 API 호출로 변경
      // const foundContract = mockContracts.find(c => c.id === id);
      // if (foundContract) {
      //   setContract(foundContract);
      // }
    }
  }, [id, propContract]);

  if (!contract) {
    return <div>계약을 찾을 수 없습니다.</div>;
  }

  const getStatusColor = (status: ContractStatus) => {
    const statusStr = typeof status === 'string' ? status.toLowerCase() : status;
    switch (statusStr) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: ContractStatus) => {
    const statusStr = typeof status === 'string' ? status.toLowerCase() : status;
    switch (statusStr) {
      case 'draft':
        return '임시저장';
      case 'pending':
        return '대기중';
      case 'approved':
        return '승인됨';
      case 'rejected':
        return '거절됨';
      case 'cancelled':
        return '취소됨';
      case 'completed':
        return '완료됨';
      default:
        return status;
    }
  };

  const getPaymentStatusLabel = (status: string) => {
    switch (status) {
      case 'unpaid':
        return '미결제';
      case 'paid':
        return '결제완료';
      case 'partial':
        return '부분결제';
      case 'overdue':
        return '연체';
      default:
        return status;
    }
  };

  // 상세 페이지에서 렌더링하는 경우 (URL 파라미터 있음)
  if (id && !propContract) {
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
                    <dt className="text-sm font-medium text-gray-500">결제 상태</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {getPaymentStatusLabel(contract.payment_status || 'unpaid')}
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
                    <dd className="mt-1 text-sm text-gray-900">{contract.supplier_company?.name || '-'}</dd>
                    <dd className="text-sm text-gray-500">{contract.supplier_contractor?.username || '-'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">수신자</dt>
                    <dd className="mt-1 text-sm text-gray-900">{contract.receiver_company?.name || '-'}</dd>
                    <dd className="text-sm text-gray-500">{contract.receiver_contractor?.username || '-'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">출발 센터</dt>
                    <dd className="mt-1 text-sm text-gray-900">{contract.departure_center?.name || '-'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">도착 센터</dt>
                    <dd className="mt-1 text-sm text-gray-900">{contract.arrival_center?.name || '-'}</dd>
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
  }

  // 인라인 상세 정보 (테이블 확장)
  return (
    <div className="bg-white">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="text-base font-medium mb-3">기본 정보</h3>
          <dl className="space-y-2">
            <div>
              <dt className="text-xs font-medium text-gray-500">상태</dt>
              <dd className="mt-1">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(contract.contract_status)}`}>
                  {getStatusLabel(contract.contract_status)}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-gray-500">결제 상태</dt>
              <dd className="mt-1 text-xs text-gray-900">
                {getPaymentStatusLabel(contract.payment_status || 'unpaid')}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-gray-500">납기일</dt>
              <dd className="mt-1 text-xs text-gray-900">
                {contract.delivery_datetime
                  ? format(new Date(contract.delivery_datetime), 'yyyy-MM-dd')
                  : '-'}
              </dd>
            </div>
          </dl>
        </div>
        <div>
          <h3 className="text-base font-medium mb-3">센터 정보</h3>
          <dl className="space-y-2">
            <div>
              <dt className="text-xs font-medium text-gray-500">출발 센터</dt>
              <dd className="mt-1 text-xs text-gray-900">{contract.departure_center?.name || '-'}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-gray-500">도착 센터</dt>
              <dd className="mt-1 text-xs text-gray-900">{contract.arrival_center?.name || '-'}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-base font-medium mb-3">계약 품목</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  품목명
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  품질
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  수량
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  단가
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  금액
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contract.items.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-900">
                    {item.product_name}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-900">
                    {item.quality}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-900">
                    {item.quantity.toLocaleString()}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-900">
                    {item.unit_price.toLocaleString()}원
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-900">
                    {item.total_price.toLocaleString()}원
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={4} className="px-4 py-2 text-right text-xs font-medium text-gray-900">
                  총계
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-xs font-medium text-gray-900">
                  {contract.total_price.toLocaleString()}원
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {contract.notes && (
        <div className="mt-4">
          <h3 className="text-base font-medium mb-3">비고</h3>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-900 whitespace-pre-wrap">{contract.notes}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractDetail; 