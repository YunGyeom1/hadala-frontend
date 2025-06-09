import React from 'react';
import CompanyView from '@/company/company/CompanyView';
import { mockCompany } from '@/company/company/company.mock';

const CompanyPage = () => {
  const handleUpdate = (data: any) => {
    console.log('회사 정보 업데이트:', data);
    // TODO: API 호출하여 회사 정보 업데이트
  };

  return (
    <div className="p-6">
      <CompanyView company={mockCompany} onUpdate={handleUpdate} />
    </div>
  );
};

export default CompanyPage; 