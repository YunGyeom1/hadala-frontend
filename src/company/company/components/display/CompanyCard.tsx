import React, { useState, useEffect } from 'react';
import { Company, CompanyType, CompanyCreateRequest } from '../../types';
import { getCompanyTypeLabel } from '../../utils/companyUtils';
import { useProfile } from '../../../../profile/ProfileContext';
import { authService } from '../../../../core/auth/auth';

interface CompanyCardProps {
  company?: Company;
  type: CompanyType;
  onUpdate?: (company: Company) => void;
  onCreate?: (company: CompanyCreateRequest) => void;
  existingCompanies?: Company[];
}

const CompanyCard: React.FC<CompanyCardProps> = ({ 
  company, 
  type,
  onUpdate, 
  onCreate,
  existingCompanies = []
}) => {
  const { currentProfile } = useProfile();
  const user = authService.getUser();
  const [isEditing, setIsEditing] = useState(false);
  const [editedCompany, setEditedCompany] = useState<Company | CompanyCreateRequest>(
    company || {
      type,
      name: '',
      owner_name: user?.name || currentProfile?.name || '',
      wholesale_company_detail_id: ''
    }
  );
  const [errors, setErrors] = useState<{ name?: string }>({});

  useEffect(() => {
    if (company) setEditedCompany(company);
  }, [company]);

  const validateName = (name: string): boolean => {
    if (!name) {
      setErrors(prev => ({ ...prev, name: 'Company name is required.' }));
      return false;
    }
    if (existingCompanies.some(c => c.name === name && (!company || c.id !== company.id))) {
      setErrors(prev => ({ ...prev, name: 'This company name is already in use.' }));
      return false;
    }
    setErrors(prev => ({ ...prev, name: undefined }));
    return true;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateName(editedCompany.name)) return;

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
        owner_name: user?.name || currentProfile?.name || '',
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
          <h2 className="text-xl font-semibold text-white">Company Information</h2>
          <p className="text-white/80 mt-1">{getCompanyTypeLabel(type)}</p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-white/20 border border-white/30 rounded-md hover:bg-white/30"
          >
            {company ? 'Edit' : 'Create'}
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-white bg-white/20 border border-white/30 rounded-md hover:bg-white/30"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-white/20 border border-white/30 rounded-md hover:bg-white/30"
            >
              Save
            </button>
          </div>
        )}
      </div>
      <div className="p-6 space-y-6">
        <div>
          <p className="text-gray-600">Company Name <span className="text-red-500">*</span></p>
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
          <p className="text-gray-600">Owner Name</p>
          <p className="font-medium">{user?.name || currentProfile?.name || company?.owner_name || '-'}</p>
        </div>
        <div>
          <p className="text-gray-600">Company Type</p>
          <p className="font-medium">{getCompanyTypeLabel(type)}</p>
        </div>
      </div>
    </div>
  );
};

export default CompanyCard; 