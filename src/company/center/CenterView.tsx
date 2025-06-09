import React, { useState } from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { CenterWithWholesalers } from './center';

interface CenterViewProps {
  center: CenterWithWholesalers;
  onUpdate?: (center: CenterWithWholesalers) => void;
  onDelete?: (id: string) => void;
}

export const CenterView: React.FC<CenterViewProps> = ({
  center,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCenter, setEditedCenter] = useState(center);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(editedCenter);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedCenter(center);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(center.id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{center.name}</h2>
          <p className="text-gray-600">{center.address}</p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                저장
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                취소
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleEdit}
                className="p-2 text-blue-600 hover:text-blue-800"
              >
                <FiEdit2 size={20} />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 text-red-600 hover:text-red-800"
              >
                <FiTrash2 size={20} />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">기본 정보</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">생성일</p>
              <p className="text-gray-900">{formatDate(center.created_at)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">수정일</p>
              <p className="text-gray-900">{formatDate(center.updated_at)}</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">등록된 도매업자</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    이름
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    역할
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    연락처
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    등록일
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {center.wholesalers.map((wholesaler) => (
                  <tr key={wholesaler.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {wholesaler.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {wholesaler.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {wholesaler.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(wholesaler.joined_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}; 