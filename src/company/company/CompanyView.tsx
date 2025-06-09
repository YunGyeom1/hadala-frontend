import React, { useState } from 'react';
import { Company, CompanyUpdate } from './company';
import { FiEdit2, FiSave, FiX } from 'react-icons/fi';

interface CompanyViewProps {
  company: Company;
  onUpdate?: (data: CompanyUpdate) => void;
}

const CompanyView: React.FC<CompanyViewProps> = ({ company, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCompany, setEditedCompany] = useState<CompanyUpdate>({});

  const handleEdit = () => {
    setEditedCompany({
      name: company.name,
      description: company.description,
      address: company.address,
      phone: company.phone,
      email: company.email,
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(editedCompany);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedCompany(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">회사 정보</h1>
        {!isEditing ? (
          <button
            onClick={handleEdit}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            <FiEdit2 className="mr-2" />
            수정
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              <FiSave className="mr-2" />
              저장
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              <FiX className="mr-2" />
              취소
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">회사명</label>
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={editedCompany.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          ) : (
            <p className="text-gray-900">{company.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">사업자등록번호</label>
          <p className="text-gray-900">{company.business_number}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
          {isEditing ? (
            <textarea
              name="description"
              value={editedCompany.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              rows={3}
            />
          ) : (
            <p className="text-gray-900">{company.description}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">주소</label>
          {isEditing ? (
            <input
              type="text"
              name="address"
              value={editedCompany.address}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          ) : (
            <p className="text-gray-900">{company.address}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">전화번호</label>
          {isEditing ? (
            <input
              type="text"
              name="phone"
              value={editedCompany.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          ) : (
            <p className="text-gray-900">{company.phone}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={editedCompany.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          ) : (
            <p className="text-gray-900">{company.email}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyView; 