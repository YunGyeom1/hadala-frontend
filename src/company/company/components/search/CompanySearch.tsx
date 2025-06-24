import React, { useState, useEffect } from 'react';
import { Company, CompanyType } from '../../types';
import { getCompanyTypeLabel } from '../../utils/companyUtils';
import { COMPANY_TYPE_OPTIONS } from '../../constants/companyConstants';

interface CompanySearchProps {
  onSearch: (searchTerm: string, type?: CompanyType) => void;
  onSelect: (company: Company) => void;
  selectedCompany?: Company;
  placeholder?: string;
  className?: string;
}

const CompanySearch: React.FC<CompanySearchProps> = ({
  onSearch,
  onSelect,
  selectedCompany,
  placeholder = "회사 검색...",
  className = ""
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<CompanyType | ''>('');
  const [isOpen, setIsOpen] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchTerm.length >= 2) {
      setLoading(true);
      // 실제 API 호출 대신 시뮬레이션
      setTimeout(() => {
        const filteredCompanies = [
          {
            id: '1',
            name: '테스트 회사 1',
            type: CompanyType.WHOLESALER,
            owner_name: '홍길동',
            created_at: '2024-01-01',
            updated_at: '2024-01-01'
          },
          {
            id: '2',
            name: '테스트 회사 2',
            type: CompanyType.RETAILER,
            owner_name: '김철수',
            created_at: '2024-01-01',
            updated_at: '2024-01-01'
          }
        ].filter(company => 
          company.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (!selectedType || company.type === selectedType)
        );
        setCompanies(filteredCompanies);
        setLoading(false);
      }, 300);
    } else {
      setCompanies([]);
    }
  }, [searchTerm, selectedType]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm, selectedType || undefined);
  };

  const handleSelect = (company: Company) => {
    onSelect(company);
    setSearchTerm(company.name);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          
          {isOpen && companies.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
              {companies.map((company) => (
                <div
                  key={company.id}
                  onClick={() => handleSelect(company)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0"
                >
                  <div className="font-medium">{company.name}</div>
                  <div className="text-sm text-gray-600">
                    {getCompanyTypeLabel(company.type)} • {company.owner_name}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as CompanyType | '')}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">전체</option>
          {COMPANY_TYPE_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          검색
        </button>
      </form>
      
      {loading && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-4 text-center text-gray-500">
          검색 중...
        </div>
      )}
    </div>
  );
};

export default CompanySearch; 