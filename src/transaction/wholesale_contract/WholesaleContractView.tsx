import React from 'react';
import type { WholesaleContract } from './wholesale_contract';
import { BaseView } from '@/common/components/BaseView';

interface WholesaleContractViewProps {
  contract: WholesaleContract;
  onUpdate?: (contract: WholesaleContract) => void;
  onDelete?: (contractId: string) => void;
}

export const WholesaleContractView = ({ contract, onUpdate, onDelete }: WholesaleContractViewProps) => {
  const renderItems = (data: WholesaleContract) => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Product
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Quantity
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Unit Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.items.map((item) => (
            <tr key={item.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {item.product_id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {item.quantity}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {new Intl.NumberFormat('ko-KR', {
                  style: 'currency',
                  currency: 'KRW'
                }).format(item.unit_price)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {new Intl.NumberFormat('ko-KR', {
                  style: 'currency',
                  currency: 'KRW'
                }).format(item.total_price)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <BaseView
      data={contract}
      onUpdate={onUpdate}
      onDelete={onDelete}
      renderItems={renderItems}
      getTitle={(data) => `Contract #${data.id.slice(0, 8)}`}
      getDate={(data) => data.contract_date}
      getStatus={(data) => ({
        contract: data.contract_status,
        payment: data.payment_status
      })}
      getTotalPrice={(data) => data.total_price}
      getNote={(data) => data.note}
    />
  );
}; 