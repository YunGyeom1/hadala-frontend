import React from 'react';
import { Company } from '../../types';
import { getCompanyTypeLabel, getCompanyTypeColor } from '../../utils/companyUtils';

interface CompanySearchListProps {
  companies: Company[];
  onSelect: (company: Company) => void;
  selectedCompanyId?: string;
  loading?: boolean;
  emptyMessage?: string;
}

const CompanySearchList: React.FC<CompanySearchListProps> = ({
  companies,
  onSelect,
  selectedCompanyId,
  loading = false,
  emptyMessage = "검색 결과가 없습니다"
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (companies.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="divide-y divide-gray-200">
        {companies.map((company) => (
          <div
            key={company.id}
            onClick={() => onSelect(company)}
            className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
              selectedCompanyId === company.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-medium text-gray-900">
                    {company.name}
                  </h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCompanyTypeColor(company.type)}`}>
                    {getCompanyTypeLabel(company.type)}
                  </span>
                </div>
                <div className="mt-1 text-sm text-gray-500">
                  대표자: {company.owner_name}
                </div>
                {company.phone && (
                  <div className="mt-1 text-sm text-gray-500">
                    연락처: {company.phone}
                  </div>
                )}
                {company.email && (
                  <div className="mt-1 text-sm text-gray-500">
                    이메일: {company.email}
                  </div>
                )}
              </div>
              <div className="text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanySearchList; 