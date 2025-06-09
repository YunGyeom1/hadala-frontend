import React, { useState } from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import StatusBadge from './StatusBadge';

interface BaseViewProps<T> {
  data: T;
  onUpdate?: (data: T) => void;
  onDelete?: (id: string) => void;
  renderItems: (items: any[]) => React.ReactNode;
  getTitle: (data: T) => string;
  getDate: (data: T) => string;
  getStatus?: (data: T) => { contract?: string; payment?: string };
  getTotalPrice?: (data: T) => number | undefined;
  getNote?: (data: T) => string | undefined;
}

export const BaseView = <T extends { id: string }>({
  data,
  onUpdate,
  onDelete,
  renderItems,
  getTitle,
  getDate,
  getStatus,
  getTotalPrice,
  getNote
}: BaseViewProps<T>) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<T>(data);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(editedData);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedData(data);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(data.id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(price);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            {getTitle(data)}
          </h3>
          <div className="flex space-x-2">
            {!isEditing && (
              <>
                <button
                  onClick={handleEdit}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <FiEdit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 text-red-500 hover:text-red-700"
                >
                  <FiTrash2 className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Date</p>
            <p className="text-gray-900">{formatDate(getDate(data))}</p>
          </div>
          {getStatus && (
            <>
              {getStatus(data).contract && (
                <div>
                  <p className="text-sm text-gray-500">Contract Status</p>
                  <StatusBadge status={getStatus(data).contract!} type="contract" />
                </div>
              )}
              {getStatus(data).payment && (
                <div>
                  <p className="text-sm text-gray-500">Payment Status</p>
                  <StatusBadge status={getStatus(data).payment!} type="payment" />
                </div>
              )}
            </>
          )}
          {getTotalPrice && (
            <div className="col-span-2">
              <p className="text-sm text-gray-500">Total Price</p>
              <p className="text-gray-900">
                {getTotalPrice(data) ? formatPrice(getTotalPrice(data)!) : 'Not set'}
              </p>
            </div>
          )}
          {getNote && getNote(data) && (
            <div className="col-span-2">
              <p className="text-sm text-gray-500">Note</p>
              <p className="text-gray-900">{getNote(data)}</p>
            </div>
          )}
        </div>

        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Items</h4>
          {renderItems(data as any)}
        </div>

        {isEditing && (
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}; 