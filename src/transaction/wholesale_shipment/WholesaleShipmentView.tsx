import React, { useState, useMemo } from 'react';
import type { WholesaleShipment, WholesaleShipmentItem } from './wholesale_shipment';
import { FiTrash2, FiEdit2, FiX, FiCheck, FiPlus } from 'react-icons/fi';

interface WholesaleShipmentViewProps {
  shipment: WholesaleShipment;
  onUpdate?: (shipment: WholesaleShipment) => void;
  onDelete?: (shipmentId: string) => void;
}

export const WholesaleShipmentView = ({ shipment, onUpdate, onDelete }: WholesaleShipmentViewProps) => {
  const [editedShipment, setEditedShipment] = useState<WholesaleShipment>(shipment);
  const [isEditing, setIsEditing] = useState(false);

  const totalPrice = useMemo(() => {
    return editedShipment.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
  }, [editedShipment.items]);

  const handleItemChange = (itemId: string, field: string, value: any) => {
    setEditedShipment(prev => {
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
    setEditedShipment(prev => {
      const updatedItems = prev.items.filter(item => item.id !== itemId);
      return {
        ...prev,
        items: updatedItems,
        total_price: updatedItems.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0)
      };
    });
  };

  const handleAddItem = () => {
    const newItem: WholesaleShipmentItem = {
      id: `temp-${Date.now()}`,
      shipment_id: editedShipment.id,
      product_id: '',
      quantity: 0,
      unit_price: 0,
      total_price: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setEditedShipment(prev => ({
      ...prev,
      items: [...prev.items, newItem],
      total_price: [...prev.items, newItem].reduce((sum, item) => sum + (item.quantity * item.unit_price), 0)
    }));
  };

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(editedShipment);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedShipment(shipment);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(shipment.id);
    }
  };

  const getStatusColor = (isFinalized: boolean) => {
    return isFinalized ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-gray-900">
              출하 #{shipment.id.slice(0, 8)}
            </h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(editedShipment.is_finalized)}`}>
              {editedShipment.is_finalized ? '확정' : '미확정'}
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
              <h3 className="text-sm font-medium text-gray-500">농가 ID</h3>
              {isEditing ? (
                <input
                  type="text"
                  value={editedShipment.farmer_id}
                  onChange={(e) => setEditedShipment(prev => ({ ...prev, farmer_id: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">{editedShipment.farmer_id}</p>
              )}
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">출하일</h3>
              {isEditing ? (
                <input
                  type="date"
                  value={editedShipment.shipment_date.split('T')[0]}
                  onChange={(e) => setEditedShipment(prev => ({ ...prev, shipment_date: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">{new Date(editedShipment.shipment_date).toLocaleDateString('ko-KR')}</p>
              )}
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">계약 ID</h3>
              {isEditing ? (
                <input
                  type="text"
                  value={editedShipment.contract_id}
                  onChange={(e) => setEditedShipment(prev => ({ ...prev, contract_id: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">{editedShipment.contract_id}</p>
              )}
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">확정 여부</h3>
              {isEditing ? (
                <select
                  value={editedShipment.is_finalized ? 'true' : 'false'}
                  onChange={(e) => setEditedShipment(prev => ({ ...prev, is_finalized: e.target.value === 'true' }))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="true">확정</option>
                  <option value="false">미확정</option>
                </select>
              ) : (
                <p className="mt-1 text-sm text-gray-900">{editedShipment.is_finalized ? '확정' : '미확정'}</p>
              )}
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">도매상 ID</h3>
              {isEditing ? (
                <input
                  type="text"
                  value={editedShipment.wholesaler_id}
                  onChange={(e) => setEditedShipment(prev => ({ ...prev, wholesaler_id: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">{editedShipment.wholesaler_id}</p>
              )}
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">센터 ID</h3>
              {isEditing ? (
                <input
                  type="text"
                  value={editedShipment.center_id}
                  onChange={(e) => setEditedShipment(prev => ({ ...prev, center_id: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">{editedShipment.center_id}</p>
              )}
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">회사 ID</h3>
              {isEditing ? (
                <input
                  type="text"
                  value={editedShipment.company_id}
                  onChange={(e) => setEditedShipment(prev => ({ ...prev, company_id: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">{editedShipment.company_id}</p>
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
              {editedShipment.items.map((item) => (
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