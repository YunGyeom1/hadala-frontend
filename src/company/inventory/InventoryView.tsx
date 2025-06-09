import React, { useState } from 'react';
import { CompanyCropInventory } from './inventory';
import { FiEdit2, FiX, FiCheck, FiPlus, FiTrash2 } from 'react-icons/fi';

interface InventoryViewProps {
  inventory: CompanyCropInventory;
  onUpdate?: (inventory: CompanyCropInventory) => void;
  onDelete?: (inventoryId: string) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({ inventory, onUpdate, onDelete }) => {
  const [editedInventory, setEditedInventory] = useState<CompanyCropInventory>(inventory);
  const [isEditing, setIsEditing] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString('ko-KR');
  };

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(editedInventory);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedInventory(inventory);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(inventory.id);
    }
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    setEditedInventory(prev => {
      const updatedItems = [...prev.items];
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value
      };
      return {
        ...prev,
        items: updatedItems
      };
    });
  };

  const handleAddItem = () => {
    const newItem = {
      id: `temp-${Date.now()}`,
      inventory_id: editedInventory.id,
      crop_name: '',
      quality_grade: 'A' as const,
      quantity: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setEditedInventory(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const handleRemoveItem = (index: number) => {
    setEditedInventory(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  // 작물별, 등급별로 그룹화
  const groupedItems = editedInventory.items.reduce((acc, item) => {
    const key = `${item.crop_name}-${item.quality_grade}`;
    if (!acc[key]) {
      acc[key] = {
        crop_name: item.crop_name,
        quality_grade: item.quality_grade,
        quantity: 0,
      };
    }
    acc[key].quantity += item.quantity;
    return acc;
  }, {} as Record<string, { crop_name: string; quality_grade: string; quantity: number }>);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">재고 현황</h2>
          <p className="text-gray-600">날짜: {formatDate(editedInventory.date)}</p>
        </div>
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <FiCheck className="mr-2" />
                저장
              </button>
              <button
                onClick={handleCancel}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FiX className="mr-2" />
                취소
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FiEdit2 className="mr-2" />
                수정
              </button>
              <button
                onClick={handleDelete}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <FiTrash2 className="mr-2" />
                삭제
              </button>
            </>
          )}
        </div>
      </div>

      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">품목 목록</h3>
        {isEditing && (
          <button
            onClick={handleAddItem}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FiPlus className="mr-2" />
            품목 추가
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작물명</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">등급</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">수량(kg)</th>
              {isEditing && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작업</th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Object.values(groupedItems).map((item, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {isEditing ? (
                    <input
                      type="text"
                      value={item.crop_name}
                      onChange={(e) => handleItemChange(index, 'crop_name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  ) : (
                    item.crop_name
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {isEditing ? (
                    <select
                      value={item.quality_grade}
                      onChange={(e) => handleItemChange(index, 'quality_grade', e.target.value as 'A' | 'B' | 'C')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="A">A등급</option>
                      <option value="B">B등급</option>
                      <option value="C">C등급</option>
                    </select>
                  ) : (
                    `${item.quality_grade}등급`
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {isEditing ? (
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={item.quantity || ''}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        handleItemChange(index, 'quantity', value ? parseInt(value) : 0);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  ) : (
                    formatNumber(item.quantity)
                  )}
                </td>
                {isEditing && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <button
                      onClick={() => handleRemoveItem(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 text-sm text-gray-500">
        <p>생성일: {formatDate(editedInventory.created_at)}</p>
        <p>수정일: {formatDate(editedInventory.updated_at)}</p>
      </div>
    </div>
  );
}; 