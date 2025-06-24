import React from 'react';
import { ContractItem } from '../types';

interface ContractItemsProps {
  items: ContractItem[];
  onItemChange: (index: number, field: keyof ContractItem, value: string | number) => void;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
}

const ContractItems: React.FC<ContractItemsProps> = ({
  items,
  onItemChange,
  onAddItem,
  onRemoveItem,
}) => {
  const handleNumericChange = (index: number, field: string, value: string) => {
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      onItemChange(index, field as keyof ContractItem, value);
    }
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">계약 품목</h2>
        <button
          type="button"
          onClick={onAddItem}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          품목 추가
        </button>
      </div>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="flex items-end space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">품목</label>
              <input
                type="text"
                value={item.product_id}
                onChange={(e) => onItemChange(index, 'product_id', e.target.value)}
                placeholder="품목명을 입력하세요"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">품질</label>
              <div className="flex items-center space-x-2">
                {['A', 'B', 'C'].map(q => (
                  <button
                    key={q}
                    type="button"
                    className={`px-2 py-1 rounded border ${item.quality === q ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
                    onClick={() => onItemChange(index, 'quality', q)}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">수량</label>
              <input
                type="text"
                value={item.quantity}
                onChange={(e) => handleNumericChange(index, 'quantity', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">단가</label>
              <input
                type="text"
                value={item.unit_price}
                onChange={(e) => handleNumericChange(index, 'unit_price', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">총액</label>
              <input
                type="text"
                value={item.total_price}
                onChange={(e) => handleNumericChange(index, 'total_price', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              />
            </div>
            <button
              type="button"
              onClick={() => onRemoveItem(index)}
              className="px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700"
            >
              삭제
            </button>
          </div>
        ))}
      </div>

      {/* 계약 품목 미리보기 */}
      {items.length > 0 && (
        <div className="mt-4">
          <span className="text-sm text-gray-700">
            {items.map(item => `${item.product_id || '품목명 미입력'}(${item.quality}) ${item.quantity}개 x ${item.unit_price}원`).join(', ')}
          </span>
        </div>
      )}
    </div>
  );
};

export default ContractItems; 