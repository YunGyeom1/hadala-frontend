import React from 'react';
import { Company } from './types';
import SearchList from '@/shared/SearchList';

interface CompanySearchListProps {
  companies: Company[];
  onSelect: (company: Company) => void;
  onCancel: () => void;
}

const CompanySearchList: React.FC<CompanySearchListProps> = ({
  companies,
  onSelect,
  onCancel,
}) => {
  return (
    <SearchList
      items={companies}
      onSelect={onSelect}
      onCancel={onCancel}
      searchFields={(company) => [
        company.name,
        company.business_number || '',
        company.address || '',
        company.phone || ''
      ]}
      renderItem={(company) => (
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium">{company.name}</p>
            <p className="text-sm text-gray-500">{company.business_number || '-'}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">{company.address || '-'}</p>
            <p className="text-sm text-gray-500">{company.phone || '-'}</p>
          </div>
        </div>
      )}
      placeholder="회사명 또는 사업자등록번호로 검색..."
    />
  );
};

export default CompanySearchList; 