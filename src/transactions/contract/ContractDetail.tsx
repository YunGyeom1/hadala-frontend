import React from 'react';
import { ContractResponse } from './types';
import { ProductQuality, ContractStatus } from '../common/types';

interface ContractDetailProps {
  contract: ContractResponse;
}

const getStatusLabel = (status: ContractStatus) => {
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
      return '계약중';
    default:
      return '알 수 없음';
  }
};

const qualityOrder: ProductQuality[] = [ProductQuality.A, ProductQuality.B, ProductQuality.C] as const;

const ContractDetail: React.FC<ContractDetailProps> = ({ contract }) => {
  // 품목 + 등급별 구조로 변환
  const grouped: Record<string, Partial<Record<ProductQuality, { quantity: number; price: number; unitPrice: number }>>> = {};
  const gradeTotalWeight: Record<ProductQuality, number> = { A: 0, B: 0, C: 0 };
  const gradeTotalPrice: Record<ProductQuality, number> = { A: 0, B: 0, C: 0 };

  contract.items.forEach((item) => {
    const { product_name, quality, quantity, total_price, unit_price } = item;

    if (!grouped[product_name]) {
      grouped[product_name] = {};
    }

    grouped[product_name][quality] = { 
      quantity, 
      price: total_price,
      unitPrice: unit_price
    };
    gradeTotalWeight[quality] += quantity;
    gradeTotalPrice[quality] += total_price;
  });

  const totalWeight = Object.values(gradeTotalWeight).reduce((sum, weight) => sum + weight, 0);
  const totalPrice = Object.values(gradeTotalPrice).reduce((sum, price) => sum + price, 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-6">{contract.title}</h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-gray-600">공급사</p>
          <p className="font-medium">{contract.supplier_company_name}</p>
        </div>
        <div>
          <p className="text-gray-600">수신사</p>
          <p className="font-medium">{contract.receiver_company_name}</p>
        </div>
        <div>
          <p className="text-gray-600">계약일시</p>
          <p className="font-medium">{contract.contract_datetime ? new Date(contract.contract_datetime).toLocaleString() : ''}</p>
        </div>
        <div>
          <p className="text-gray-600">상태</p>
          <p className="font-medium">{getStatusLabel(contract.contract_status)}</p>
        </div>
        <div>
          <p className="text-gray-600">계약 ID</p>
          <p className="font-medium">{contract.id}</p>
        </div>
      </div>

      {/* 등급별 품목 테이블 */}
      <div className="overflow-x-auto">
        <table className="min-w-full border divide-y divide-gray-200 text-center">
          <thead className="bg-gray-50">
            <tr>
              <th className="border px-4 py-2">작물명</th>
              {qualityOrder.map((q) => (
                <th key={q} className="border px-4 py-2">{q}등급</th>
              ))}
              <th className="border px-4 py-2">총 무게</th>
              <th className="border px-4 py-2">총 금액</th>
              <th className="border px-4 py-2 text-sm text-gray-600">단가</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(grouped).map(([product, qualities]) => {
              const productTotalWeight = qualityOrder.reduce((sum, q) => sum + (qualities[q]?.quantity || 0), 0);
              const productTotalPrice = qualityOrder.reduce((sum, q) => sum + (qualities[q]?.price || 0), 0);

              return (
                <tr key={product}>
                  <td className="border px-4 py-2 font-medium">{product}</td>
                  {qualityOrder.map((q) => (
                    <td key={q} className="border px-4 py-2 text-green-600 font-medium">
                      {qualities[q] ? `${qualities[q].quantity}kg` : ''}
                    </td>
                  ))}
                  <td className="border px-4 py-2 font-medium">{productTotalWeight}kg</td>
                  <td className="border px-4 py-2 font-medium">{productTotalPrice.toLocaleString()}원</td>
                  <td className="border px-4 py-2 text-sm text-gray-600 whitespace-pre-line">
                    {qualityOrder.map(q => 
                      qualities[q] ? `${q}등급: ${qualities[q].unitPrice.toLocaleString()}원/kg` : ''
                    ).filter(Boolean).join('\n')}
                  </td>
                </tr>
              );
            })}
            <tr className="font-semibold text-black bg-gray-50">
              <td className="border px-4 py-2">등급별 합계</td>
              {qualityOrder.map((q) => (
                <td key={q} className="border px-4 py-2">{gradeTotalWeight[q]}kg</td>
              ))}
              <td className="border px-4 py-2">{totalWeight}kg</td>
              <td className="border px-4 py-2">{totalPrice.toLocaleString()}원</td>
              <td className="border px-4 py-2 text-sm text-gray-600 whitespace-pre-line">
                {qualityOrder.map(q => 
                  gradeTotalWeight[q] > 0 ? `${q}등급: ${Math.round(gradeTotalPrice[q] / gradeTotalWeight[q]).toLocaleString()}원/kg` : ''
                ).filter(Boolean).join('\n')}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {contract.notes && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">비고</h3>
          <p className="text-gray-700">{contract.notes}</p>
        </div>
      )}
    </div>
  );
};

export default ContractDetail; 