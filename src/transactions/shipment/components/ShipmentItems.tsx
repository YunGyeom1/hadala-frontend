import React from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import { ShipmentItem } from '../types';
import { ProductQuality, qualityToString } from '@/transactions/common/types';

interface ShipmentItemsProps {
  items: ShipmentItem[];
  onItemChange: (index: number, field: keyof ShipmentItem, value: string | number) => void;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
}

const ShipmentItems: React.FC<ShipmentItemsProps> = ({
  items,
  onItemChange,
  onAddItem,
  onRemoveItem,
}) => {
  const handleNumericChange = (index: number, field: 'quantity' | 'unit_price', value: string) => {
    const numericValue = value.replace(/,/g, '');
    if (!isNaN(Number(numericValue))) {
      onItemChange(index, field, Number(numericValue));
    }
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold border-b pb-2 flex-grow">출하 품목</h2>
        <button type="button" onClick={onAddItem} className="btn btn-sm btn-outline">
          품목 추가
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th className="w-1/3">품목명</th>
              <th>품질</th>
              <th>수량</th>
              <th>단가</th>
              <th>총액</th>
              <th className="w-12"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="text"
                    value={item.product_name}
                    onChange={(e) => onItemChange(index, 'product_name', e.target.value)}
                    className="input input-bordered w-full"
                  />
                </td>
                <td>{qualityToString(item.quality as ProductQuality)}</td>
                <td>
                  <input
                    type="text"
                    value={Number(item.quantity).toLocaleString()}
                    onChange={(e) => handleNumericChange(index, 'quantity', e.target.value)}
                    className="input input-bordered w-full text-right"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={Number(item.unit_price).toLocaleString()}
                    onChange={(e) => handleNumericChange(index, 'unit_price', e.target.value)}
                    className="input input-bordered w-full text-right"
                  />
                </td>
                <td>
                  <span className="font-mono text-right block pr-4">
                    {Number(item.total_price).toLocaleString()}
                  </span>
                </td>
                <td>
                  <button type="button" onClick={() => onRemoveItem(index)} className="btn btn-ghost btn-sm">
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShipmentItems; 