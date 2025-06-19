import React, { useState } from 'react';
import { Company } from './types';

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
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.business_number?.includes(searchTerm)
  );

  return (
    <div className="bg-white rounded-lg shadow h-[600px]">
      <div className="p-6 h-full flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-base font-medium">회사 검색</h4>
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            취소
          </button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="회사명 또는 사업자등록번호로 검색"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredCompanies.length > 0 ? (
            <div className="space-y-2">
              {filteredCompanies.map((company) => (
                <button
                  key={company.id}
                  onClick={() => onSelect(company)}
                  className="w-full text-left p-4 border rounded-lg hover:bg-gray-50"
                >
                  <p className="font-medium">{company.name}</p>
                  <p className="text-sm text-gray-500">{company.business_number || '-'}</p>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-4">
              검색 결과가 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanySearchList; 