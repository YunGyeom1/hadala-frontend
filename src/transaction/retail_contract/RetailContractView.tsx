import React, { useState, useMemo } from 'react';
import type { RetailContract } from './retail_contract';
import { FiTrash2, FiEdit2, FiX, FiCheck, FiPlus } from 'react-icons/fi';

interface RetailContractViewProps {
  contract: RetailContract;
  onUpdate?: (contract: RetailContract) => void;
  onDelete?: (contractId: string) => void;
}

export const RetailContractView = ({ contract, onUpdate, onDelete }: RetailContractViewProps) => {
  const [editedContract, setEditedContract] = useState<RetailContract>(contract);
  const [isEditing, setIsEditing] = useState(false);

  const totalPrice = useMemo(() => {
    return editedContract.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
  }, [editedContract.items]);

  const handleItemChange = (itemId: string, field: string, value: any) => {
    setEditedContract(prev => {
      const updatedItems = prev.items.map(item => {
        if (item.id === itemId) {
          const updatedItem = { ...item, [field]: value };
          if (field === 'quantity' || field === 'unit_price') {
            updatedItem.total_price = updatedItem.quantity * updatedItem.unit_price;
          }
          return updatedItem;
        }
        return item;
      });

      return {
        ...prev,
        items: updatedItems,
        total_price: updatedItems.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0)
      };
    });
  };

  const handleRemoveItem = (itemId: string) => {
    setEditedContract(prev => {
      const updatedItems = prev.items.filter(item => item.id !== itemId);
      return {
        ...prev,
        items: updatedItems,
        total_price: updatedItems.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0)
      };
    });
  };

  const handleAddItem = () => {
    const newItem = {
      id: `temp-${Date.now()}`,
      contract_id: editedContract.id,
      product_id: '',
      quantity: 0,
      unit_price: 0,
      total_price: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setEditedContract(prev => ({
      ...prev,
      items: [...prev.items, newItem],
      total_price: [...prev.items, newItem].reduce((sum, item) => sum + (item.quantity * item.unit_price), 0)
    }));
  };

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(editedContract);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedContract(contract);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(contract.id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-gray-900">
              계약 #{contract.id.slice(0, 8)}
            </h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(editedContract.contract_status)}`}>
              {editedContract.contract_status}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(editedContract.payment_status)}`}>
              {editedContract.payment_status}
            </span>
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

        <div className="px-6 py-4 border-b border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">계약명</h3>
              {isEditing ? (
                <input
                  type="text"
                  value={editedContract.contract_name}
                  onChange={(e) => setEditedContract(prev => ({ ...prev, contract_name: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">{editedContract.contract_name}</p>
              )}
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">계약일</h3>
              {isEditing ? (
                <input
                  type="date"
                  value={editedContract.contract_date.split('T')[0]}
                  onChange={(e) => setEditedContract(prev => ({ ...prev, contract_date: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">{new Date(editedContract.contract_date).toLocaleDateString('ko-KR')}</p>
              )}
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">계약 상태</h3>
              {isEditing ? (
                <select
                  value={editedContract.contract_status}
                  onChange={(e) => setEditedContract(prev => ({ ...prev, contract_status: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="PENDING">대기중</option>
                  <option value="COMPLETED">완료</option>
                  <option value="CANCELLED">취소</option>
                </select>
              ) : (
                <p className="mt-1 text-sm text-gray-900">{editedContract.contract_status}</p>
              )}
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">결제 상태</h3>
              {isEditing ? (
                <select
                  value={editedContract.payment_status}
                  onChange={(e) => setEditedContract(prev => ({ ...prev, payment_status: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="PENDING">대기중</option>
                  <option value="PAID">결제완료</option>
                  <option value="OVERDUE">연체</option>
                </select>
              ) : (
                <p className="mt-1 text-sm text-gray-900">{editedContract.payment_status}</p>
              )}
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">소매상 ID</h3>
              {isEditing ? (
                <input
                  type="text"
                  value={editedContract.retailer_id}
                  onChange={(e) => setEditedContract(prev => ({ ...prev, retailer_id: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">{editedContract.retailer_id}</p>
              )}
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">센터 ID</h3>
              {isEditing ? (
                <input
                  type="text"
                  value={editedContract.center_id}
                  onChange={(e) => setEditedContract(prev => ({ ...prev, center_id: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">{editedContract.center_id}</p>
              )}
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">도매상 ID</h3>
              {isEditing ? (
                <input
                  type="text"
                  value={editedContract.wholesaler_id || ''}
                  onChange={(e) => setEditedContract(prev => ({ ...prev, wholesaler_id: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">{editedContract.wholesaler_id || '-'}</p>
              )}
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">회사 ID</h3>
              {isEditing ? (
                <input
                  type="text"
                  value={editedContract.company_id}
                  onChange={(e) => setEditedContract(prev => ({ ...prev, company_id: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">{editedContract.company_id}</p>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  품목
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
                {isEditing && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    작업
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {editedContract.items.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {isEditing ? (
                      <input
                        type="text"
                        value={item.product_id}
                        onChange={(e) => handleItemChange(item.id, 'product_id', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    ) : (
                      item.product_id
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
                          handleItemChange(item.id, 'quantity', value ? parseInt(value) : 0);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    ) : (
                      item.quantity.toLocaleString()
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {isEditing ? (
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={item.unit_price || ''}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, '');
                          handleItemChange(item.id, 'unit_price', value ? parseInt(value) : 0);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    ) : (
                      new Intl.NumberFormat('ko-KR', {
                        style: 'currency',
                        currency: 'KRW'
                      }).format(item.unit_price)
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    {new Intl.NumberFormat('ko-KR', {
                      style: 'currency',
                      currency: 'KRW'
                    }).format(item.quantity * item.unit_price)}
                  </td>
                  {isEditing && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td colSpan={3} className="px-6 py-4 text-right text-sm font-medium text-gray-500">
                  총계
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                  {new Intl.NumberFormat('ko-KR', {
                    style: 'currency',
                    currency: 'KRW'
                  }).format(totalPrice)}
                </td>
                {isEditing && <td />}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}; 