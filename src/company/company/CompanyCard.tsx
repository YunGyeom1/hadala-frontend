import React, { useState } from 'react';
import { Company, CompanyType, CompanyCreateRequest } from './types';
import { mockCompanies } from './mockData';

interface CompanyCardProps {
  company?: Company;
  type: CompanyType;
  onUpdate?: (company: Company) => void;
  onCreate?: (company: CompanyCreateRequest) => void;
  existingCompanies?: Company[];
}

const getCompanyTypeLabel = (type: CompanyType) => {
  switch (type) {
    case CompanyType.FARMER:
      return '농가';
    case CompanyType.RETAILER:
      return '소매상';
    case CompanyType.WHOLESALER:
      return '도매상';
    default:
      return '알 수 없음';
  }
};

const CompanyCard: React.FC<CompanyCardProps> = ({ 
  company, 
  type,
  onUpdate, 
  onCreate,
  existingCompanies = []
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCompany, setEditedCompany] = useState<Company | CompanyCreateRequest>(
    company || {
      type,
      name: '',
      owner_name: '',
      wholesale_company_detail_id: ''
    }
  );

  const [errors, setErrors] = useState<{
    name?: string;
  }>({});

  const validateName = (name: string): boolean => {
    if (!name) {
      setErrors(prev => ({ ...prev, name: '회사명은 필수입니다.' }));
      return false;
    }
    if (existingCompanies.some(c => c.name === name && (!company || c.id !== company.id))) {
      setErrors(prev => ({ ...prev, name: '이미 사용 중인 회사명입니다.' }));
      return false;
    }
    setErrors(prev => ({ ...prev, name: undefined }));
    return true;
  };

  const validateForm = (): boolean => {
    return validateName(editedCompany.name);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (company && onUpdate) {
      onUpdate(editedCompany as Company);
    } else if (onCreate) {
      onCreate(editedCompany as CompanyCreateRequest);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (company) {
      setEditedCompany(company);
    } else {
      setEditedCompany({
        type,
        name: '',
        owner_name: '',
        wholesale_company_detail_id: ''
      });
    }
    setErrors({});
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="bg-blue-600 px-6 py-4 rounded-t-lg flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-white">회사 정보</h2>
          <p className="text-white/80 mt-1">{getCompanyTypeLabel(type)}</p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-white/20 border border-white/30 rounded-md hover:bg-white/30"
          >
            {company ? '수정' : '생성'}
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-white bg-white/20 border border-white/30 rounded-md hover:bg-white/30"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-white/20 border border-white/30 rounded-md hover:bg-white/30"
            >
              저장
            </button>
          </div>
        )}
      </div>
      <div className="p-6 space-y-6">
        <div>
          <p className="text-gray-600">회사명 <span className="text-red-500">*</span></p>
          {isEditing ? (
            <div>
              <input
                type="text"
                value={editedCompany.name}
                onChange={e => {
                  setEditedCompany({ ...editedCompany, name: e.target.value });
                  validateName(e.target.value);
                }}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>
          ) : (
            <p className="font-medium">{company?.name || '-'}</p>
          )}
        </div>
        <div>
          <p className="text-gray-600">대표자명</p>
          <p className="font-medium">{company?.owner_name || '-'}</p>
        </div>
        <div>
          <p className="text-gray-600">회사 타입</p>
          <p className="font-medium">{getCompanyTypeLabel(type)}</p>
        </div>
      </div>
    </div>
  );
};

export default CompanyCard; 