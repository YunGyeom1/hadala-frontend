import React, { useState, useEffect } from 'react';
import { Company, CompanyType } from '../../types';
import { getCompanyTypeLabel } from '../../utils/companyUtils';
import { COMPANY_TYPE_OPTIONS } from '../../constants/companyConstants';
import { companyService } from '../../services/companyService';

interface CompanySearchProps {
  onSearch: (searchTerm: string, type?: CompanyType) => void;
  onSelect: (company: Company) => void;
  placeholder?: string;
  className?: string;
}

const CompanySearch: React.FC<CompanySearchProps> = ({
  onSearch,
  onSelect,
  placeholder = "Search companies...",
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
      // Actual API call
      const searchCompanies = async () => {
        try {
          const allCompanies = await companyService.getCompanies();
          const filteredCompanies = allCompanies.filter(company => 
            company.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (!selectedType || company.type === selectedType)
          );
          setCompanies(filteredCompanies);
        } catch (error) {
          console.error('Company search failed:', error);
          setCompanies([]);
        } finally {
          setLoading(false);
        }
      };
      
      searchCompanies();
    } else {
      setCompanies([]);
    }
  }, [searchTerm, selectedType]);

  // const handleSearch = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   onSearch(searchTerm, selectedType || undefined);
  // };

  const handleSearchClick = () => {
    onSearch(searchTerm, selectedType || undefined);
  };

  const handleSelect = (company: Company) => {
    onSelect(company);
    setSearchTerm(company.name);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsOpen(true);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSearchClick();
              }
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
                    {getCompanyTypeLabel(company.type)} • {company.owner_name || company.business_number || '-'}
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
          <option value="">All</option>
          {COMPANY_TYPE_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        <button
          type="button"
          onClick={handleSearchClick}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Search
        </button>
      </div>
      
      {loading && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-4 text-center text-gray-500">
          Searching...
        </div>
      )}
    </div>
  );
};

export default CompanySearch; 